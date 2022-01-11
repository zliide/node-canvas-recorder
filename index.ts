import { Recording2DCanvas, TextMeasure } from './2d.js'
import { notImplemented, RecordingContext, RecordingElement, stringArg } from './recording.js'
import { RecordingWebGLCanvas } from './webgl.js'

export function installCanvasRecorder(window: any, textMeasure: TextMeasure) {
    let canvasIndex = 0
    const innerElementFactory = window.document.createElement.bind(window.document)
    window.document.createElement = (localName: string) => {
        const inner = innerElementFactory(localName)
        if (localName.toLowerCase() === 'canvas') {
            let context: RecordingContext
            const ix = canvasIndex++
            inner.id = `_cnvs${ix}`
            inner.getContext = (type: string) => {
                if (context) {
                    if (type !== context.type()) {
                        return null
                    }
                    return context
                }
                switch (type) {
                    case '2d':
                        return context = new Recording2DCanvas(`_c${ix}`, inner, textMeasure)
                    case 'webgl':
                        return context = new RecordingWebGLCanvas(`_cgl${ix}`, inner)
                    default:
                        return null
                }
            }
            inner.toBlob = (_callback: BlobCallback, _type?: string, _quality?: any) => {
                notImplemented('toBlob')
            }
            inner.toDataURL = () => {
                return 'data:image/gif;base64,' + dummyGif.toString('base64')
            }
        }
        return inner
    }
}

const dummyGif = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x00, 0x3b])

export function scriptPlayingRecordedCanvases(window: any) {
    let script = ''
    const rendered = new Set<string>()
    const inDom = new Set<string>()
    const canvasTags = window.document.getElementsByTagName('canvas')
    for (let ix = 0; ix !== canvasTags.length; ++ix) {
        inDom.add(canvasTags.item(ix)!.id)
    }
    for (let ix = 0; ix !== canvasTags.length; ++ix) {
        const canvasElement = canvasTags.item(ix)!
        script += renderCanvasElement(inDom, rendered, canvasElement)
    }
    return script
}

function renderCanvasElement(inDom: Set<string>, rendered: Set<string>, element: RecordingElement) {
    if (rendered.has(element.id)) {
        return ''
    }
    const context = element.getContext('2d') ?? element.getContext('webgl')
    let script = ''
    for (const source of context.getSources()) {
        script += renderCanvasElement(rendered, inDom, source)
    }
    const contextScript = context.script(element.id)
    if (contextScript) {
        if (inDom.has(element.id)) {
            script += `const ${element.id}=document.getElementById(${stringArg(element.id)});\r\n`
        } else {
            script += `const ${element.id}=document.createElement('canvas');\r\n`
        }
        script += `const ${context.varName}=${element.id}.getContext('${context.type()}');\r\n`
        script += `${contextScript}\r\n`
    }
    rendered.add(element.id)
    return script
}
