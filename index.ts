import { Recording2DCanvas, TextMeasure } from './2d.js'
import { notImplemented, RecordingContext, RecordingElement, stringArg } from './recording.js'
import { RecordingWebGLCanvas } from './webgl.js'

export function installCanvasRecorder(window: any, textMeasure: TextMeasure) {
    let canvasIndex = 0
    let imageIndex = 0
    const dataUrlCanvases = new Map<number, any>()
    const innerElementFactory = window.document.createElement.bind(window.document)
    window.document.createElement = (localName: string) => {
        const inner = innerElementFactory(localName)
        switch (localName.toLowerCase()) {
            case 'canvas': {
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
                    dataUrlCanvases.set(ix, inner)
                    return `${dataUrlPrefix}${ix};base64,${dummyGif.toString('base64')}`
                }
                break
            }
            case 'img': {
                const sources: any[] = []
                inner.getSources = () => sources
                let script: string | undefined
                inner.script = () => script
                const innerSrcGetter = inner.__lookupGetter__('src').bind(inner)
                const innerSrcSetter = inner.__lookupSetter__('src').bind(inner)
                const innerOnLoad = inner.__lookupSetter__('onload').bind(inner)
                let onLoad = () => {/**/ }
                Object.defineProperties(inner, {
                    src: {
                        configurable: true,
                        get() {
                            return innerSrcGetter()
                        },
                        set(value: string) {
                            if (value.startsWith(dataUrlPrefix)) {
                                const ix = imageIndex++
                                inner.id = `_img${ix}`
                                const sourceCanvasIndex = value.substring(dataUrlPrefix.length, value.indexOf(';', dataUrlPrefix.length))
                                const canvas = dataUrlCanvases.get(Number(sourceCanvasIndex))
                                if (canvas) {
                                    sources.push(canvas)
                                    script = (script ?? '') + `_img${ix}.src=_cnvs${sourceCanvasIndex}.toDataURL();\r\n`
                                    onLoad()
                                    return
                                }
                            }
                            innerSrcSetter(value)
                        },
                    },
                    onload: {
                        configurable: true,
                        set(handler: () => void) {
                            onLoad = handler
                            innerOnLoad(handler)
                        },
                    },
                })
                break
            }
        }
        return inner
    }
}

const dataUrlPrefix = 'data:image/gif+'
const dummyGif = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x00, 0x3b])

export function scriptPlayingRecordedCanvases(window: any) {
    let script = ''
    const rendered = new Set<string>()
    const canvasesInDom = new Set<string>()
    const canvasTags = window.document.getElementsByTagName('canvas')
    for (let ix = 0; ix !== canvasTags.length; ++ix) {
        canvasesInDom.add(canvasTags.item(ix)!.id)
    }
    for (let ix = 0; ix !== canvasTags.length; ++ix) {
        const canvasElement = canvasTags.item(ix)!
        script += renderCanvasElement(canvasesInDom, rendered, canvasElement)
    }

    const imagesInDom = new Set<string>()
    const imageTags = window.document.getElementsByTagName('img')
    for (let ix = 0; ix !== imageTags.length; ++ix) {
        imagesInDom.add(imageTags.item(ix)!.id)
    }
    for (let ix = 0; ix !== imageTags.length; ++ix) {
        const imageElement = imageTags.item(ix)!
        script += renderImageElement(canvasesInDom, imagesInDom, rendered, imageElement)
    }
    return script
}

function renderCanvasElement(inDom: Set<string>, rendered: Set<string>, element: RecordingElement) {
    if (rendered.has(element.id)) {
        return ''
    }
    const context = element.getContext('2d') ?? element.getContext('webgl')
    let script = ''
    if (!context.getSources) {
        return
    }
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

function renderImageElement(canvasesInDom: Set<string>, imagesInDom: Set<string>, rendered: Set<string>, element: any) {
    let script = ''
    if (!element.getSources) {
        return
    }
    for (const source of element.getSources()) {
        script += renderCanvasElement(rendered, canvasesInDom, source)
    }
    const imageScript = element.script()
    if (imageScript) {
        if (imagesInDom.has(element.id)) {
            script += `const ${element.id}=document.getElementById(${stringArg(element.id)});\r\n`
        } else {
            script += `const ${element.id}=document.createElement('img');\r\n`
        }
        script += `${imageScript}\r\n`
    }
    return script
}
