import { Recording2DCanvas, TextMeasure } from './2d.js'
import { notImplemented, stringArg } from './recording.js'
import { RecordingWebGLCanvas } from './webgl.js'

export function installCanvasRecorder(window: any, textMeasure: TextMeasure) {
    let canvasIndex = 0
    const innerElementFactory = window.document.createElement.bind(window.document)
    window.document.createElement = (localName: string) => {
        const inner = innerElementFactory(localName)
        if (localName.toLowerCase() === 'canvas') {
            let context: any
            let contextType: string | undefined
            const ix = canvasIndex++
            inner.id = `_cnvs${ix}`
            inner.getContext = (type: string) => {
                if (context) {
                    if (type !== contextType) {
                        return null
                    }
                    return context
                }
                contextType = type
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
    const canvasTags = window.document.getElementsByTagName('canvas')
    for (let ix = 0; ix !== canvasTags.length; ++ix) {
        const canvas = canvasTags.item(ix)!
        const context2D = canvas.getContext('2d')
        const script2D = context2D?.script(canvas.id)
        if (script2D) {
            script += `const ${context2D.varName}=document.getElementById(${stringArg(canvas.id)}).getContext('2d');\r\n${script2D}\r\n`
        }
        const contextWebGL = canvas.getContext('webgl')
        const scriptGL = contextWebGL?.script(canvas.id)
        if (scriptGL) {
            script += `const ${contextWebGL.varName}=document.getElementById(${stringArg(canvas.id)}).getContext('webgl');\r\n${scriptGL}\r\n`
        }
    }
    return script
}
