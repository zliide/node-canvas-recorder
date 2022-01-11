import assert from 'assert'
import { installCanvasRecorder, scriptPlayingRecordedCanvases } from '../index.js'

describe('recording canvas', () => {
    it('selects context type', () => {
        const window = { document: new DummyDocument() } as any as Window
        installCanvasRecorder(window, measureText)

        const element2d = window.document.createElement('canvas')
        assert.ok(element2d.getContext('2d'))
        assert.strictEqual(element2d.getContext('webgl'), null)

        const elementWebgl = window.document.createElement('canvas')
        assert.ok(elementWebgl.getContext('webgl'))
        assert.strictEqual(elementWebgl.getContext('2d'), null)
    })

    it('can record some 2d', () => {
        const window = { document: new DummyDocument() } as any as Window
        installCanvasRecorder(window, measureText)

        const element = window.document.createElement('canvas')
        window.document.append(element)
        const canvas = element.getContext('2d')
        canvas!.quadraticCurveTo(0, 1, 2, 3)
        canvas!.fillText(`Don't forget to escape!`, 4, 5)

        const script = scriptPlayingRecordedCanvases(window)
        assert.deepStrictEqual(script.split('\r\n'), [
            `const _c0=document.getElementById('_cnvs0').getContext('2d');`,
            `_c0.quadraticCurveTo(0,1,2,3);`,
            `_c0.fillText('Don\\\'t forget to escape!',4,5);`,
        ])
    })

    it('can record some webgl', () => {
        const window = { document: new DummyDocument() } as any as Window
        installCanvasRecorder(window, measureText)

        const element = window.document.createElement('canvas')
        window.document.append(element)
        const canvas = element.getContext('webgl')
        const buffer = canvas!.createBuffer()
        canvas!.bindBuffer(canvas!.ARRAY_BUFFER, buffer)
        canvas!.flush()
        canvas!.bindBuffer(canvas!.ARRAY_BUFFER, null)
        canvas!.getExtension('WEBGL_lose_context')!.loseContext()

        const script = scriptPlayingRecordedCanvases(window)
        assert.deepStrictEqual(script.split('\r\n'), [
            "const _cgl0=document.getElementById('_cnvs0').getContext('webgl');",
            'const _cgl0_0 = _cgl0.createBuffer();',
            '_cgl0.bindBuffer(_cgl0.ARRAY_BUFFER, _cgl0_0);',
            '_cgl0.flush();',
            '_cgl0.bindBuffer(_cgl0.ARRAY_BUFFER, null);',
            "_cgl0.getExtension('WEBGL_lose_context').loseContext();",
        ])
    })
})

interface Element {
    localName: string
}

class DummyDocument {
    #elements: Element[] = []

    createElement(localName: string): any {
        return { localName }
    }
    getElementsByTagName(tagName: string) {
        const matching = this.#elements.filter(e => e.localName === tagName)
        return {
            length: matching.length,
            item: (ix: number) => matching[ix],
        }
    }
    append(element: Element) {
        this.#elements.push(element)
    }
}

function measureText(_font: string, text: string) {
    return { height: 8, width: text.length * 8, descent: 0 }
}
