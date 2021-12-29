import assert from 'assert'
import { installCanvasRecorder, scriptPlayingRecordedCanvases } from '../index.js'

describe('recording canvas', () => {
    it('can record some 2d', async () => {
        const window = { document: new DummyDocument() } as any as Window
        installCanvasRecorder(window, measureText)

        const element = window.document.createElement('canvas')
        window.document.append(element)
        const canvas = element.getContext('2d')
        canvas!.quadraticCurveTo(0, 1, 2, 3)
        canvas!.fillText(`Don't forget to escape!`, 4, 5)

        const script = scriptPlayingRecordedCanvases(window)
        assert.deepStrictEqual(script.split('\r\n'), [
            `const _c1=document.getElementById('_cnvs2').getContext('2d');`,
            `_c1.quadraticCurveTo(0,1,2,3);`,
            `_c1.fillText('Don\\\'t forget to escape!',4,5);`,
        ])
    })

    it('can record some webgl', async () => {
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
            "const _cgl2=document.getElementById('_cnvs2').getContext('webgl');",
            'const _cgl2_0 = _cgl2.createBuffer();',
            '_cgl2.bindBuffer(_cgl2.ARRAY_BUFFER, _cgl2_0);',
            '_cgl2.flush();',
            '_cgl2.bindBuffer(_cgl2.ARRAY_BUFFER, null);',
            "_cgl2.getExtension('WEBGL_lose_context').loseContext();",
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
