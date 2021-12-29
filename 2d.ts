import { notImplemented, RecordingObject, stringArg } from './recording.js'

class RecordingCanvasGradient extends RecordingObject {
    constructor(ops: string[], varName: string) {
        super(ops, varName)
    }

    addColorStop(offset: number, color: string) {
        this.ops.push(`${this.varName}.addColorStop(${offset},'${color}');`)
    }
}

class RecordingCanvasPattern extends RecordingObject {
    constructor(ops: string[], varName: string) {
        super(ops, varName)
    }

    setTransform(transform?: DOMMatrix2DInit) {
        this.ops.push(`${this.varName}.setTransform(${JSON.stringify(transform)});`)
    }
}

function styleArg(style: string | RecordingCanvasGradient | RecordingCanvasPattern) {
    if (typeof (style) === 'string') {
        return `'${style}'`
    }
    return style.varName
}

function isImageBitmap(image: CanvasImageSource): image is ImageBitmap {
    return (image as any).close !== undefined
}
function imageArg(image: CanvasImageSource) {
    if (isImageBitmap(image)) {
        notImplemented('createPattern("ImageBitmap")')
    }
    if (!image.id) {
        notImplemented('createPattern')
    }
    return `document.getElementById(${stringArg(image.id)})`
}

export type TextMeasure = (font: string, text: string) => { height: number, width: number, descent: number }

export class Recording2DCanvas implements CanvasRenderingContext2D {
    #ops: string[]
    #textMeasure
    #varIx = 0
    readonly canvas: any
    readonly varName

    constructor(name: string, element: any, textMeasure: TextMeasure) {
        this.canvas = element
        this.varName = name
        this.#ops = []
        this.#textMeasure = textMeasure
    }

    script() {
        return this.#ops.join('\r\n')
    }

    clearRect(x: number, y: number, w: number, h: number) {
        this.#ops.push(`${this.varName}.clearRect(${x},${y},${w},${h});`)
        if (x <= 0 && y <= 0 && w >= this.canvas.width && h >= this.canvas.height) {
            this.canvas.textContent = ''
        }
    }
    fillRect(...args: any[]) { this.#ops.push(`${this.varName}.fillRect(${args.join(',')});`) }
    strokeRect(...args: any[]) { this.#ops.push(`${this.varName}.strokeRect(${args.join(',')});`) }

    fillText(text: string, ...args: any[]) {
        this.#ops.push(`${this.varName}.fillText(${stringArg(text)},${args.join(',')});`)
        const fallback = this.canvas.textContent
        this.canvas.textContent = fallback ? fallback + ' ' + text : text
    }
    strokeText(text: string, ...args: any[]) {
        this.#ops.push(`${this.varName}.strokeText(${stringArg(text)},${args.join(',')});`)
        const fallback = this.canvas.textContent
        this.canvas.textContent = fallback ? fallback + ' ' + text : text
    }
    measureText(text: string): TextMetrics {
        const size = this.#textMeasure(this.#font, text)
        return {
            actualBoundingBoxAscent: size.height - size.descent,
            actualBoundingBoxDescent: size.descent,
            actualBoundingBoxLeft: -1,
            actualBoundingBoxRight: size.width + 1,
            fontBoundingBoxAscent: size.height,
            fontBoundingBoxDescent: size.descent,
            width: size.width,
        }
    }
    #lineWidth = 1
    get lineWidth() {
        return this.#lineWidth
    }
    set lineWidth(value) {
        this.#ops.push(`${this.varName}.lineWidth=${value};`)
        this.#lineWidth = value
    }
    #lineCap: CanvasLineCap = 'butt'
    get lineCap() {
        return this.#lineCap
    }
    set lineCap(value) {
        this.#ops.push(`${this.varName}.lineCap=${stringArg(value)};`)
        this.#lineCap = value
    }
    #lineJoin: CanvasLineJoin = 'miter'
    get lineJoin() {
        return this.#lineJoin
    }
    set lineJoin(value) {
        this.#ops.push(`${this.varName}.lineJoin=${stringArg(value)};`)
        this.#lineJoin = value
    }
    #miterLimit = 10
    get miterLimit() {
        return this.#miterLimit
    }
    set miterLimit(value) {
        this.#ops.push(`${this.varName}.miterLimit=${value};`)
        this.#miterLimit = value
    }
    #lineDash: number[] = []
    getLineDash() { return [...this.#lineDash] }
    setLineDash(segments: number[]) {
        this.#ops.push(`${this.varName}.setLineDash([${segments.join(',')}]);`)
        this.#lineDash = [...segments]
    }
    #lineDashOffset = 0
    get lineDashOffset() {
        return this.#lineDashOffset
    }
    set lineDashOffset(value) {
        this.#ops.push(`${this.varName}.lineDashOffset=${value};`)
        this.#lineDashOffset = value
    }
    #font = '10px sans-serif'
    get font() {
        return this.#font
    }
    set font(value) {
        this.#ops.push(`${this.varName}.font=${stringArg(value)};`)
        this.#font = value
    }
    #textAlign: CanvasTextAlign = 'start'
    get textAlign() {
        return this.#textAlign
    }
    set textAlign(value) {
        this.#ops.push(`${this.varName}.textAlign=${stringArg(value)};`)
        this.#textAlign = value
    }
    #textBaseline: CanvasTextBaseline = 'alphabetic'
    get textBaseline() {
        return this.#textBaseline
    }
    set textBaseline(value) {
        this.#ops.push(`${this.varName}.textBaseline=${stringArg(value)};`)
        this.#textBaseline = value
    }
    #direction: CanvasDirection = 'ltr'
    get direction() {
        return this.#direction
    }
    set direction(value) {
        this.#ops.push(`${this.varName}.direction=${stringArg(value)};`)
        this.#direction = value
    }
    #fillStyle: string | RecordingCanvasGradient | RecordingCanvasPattern = '#000000'
    get fillStyle() {
        return this.#fillStyle
    }
    set fillStyle(value) {
        this.#ops.push(`${this.varName}.fillStyle=${styleArg(value)};`)
        this.#fillStyle = value
    }
    #strokeStyle: string | RecordingCanvasGradient | RecordingCanvasPattern = '#000000'
    get strokeStyle() {
        return this.#strokeStyle
    }
    set strokeStyle(value) {
        this.#ops.push(`${this.varName}.strokeStyle=${styleArg(value)};`)
        this.#strokeStyle = value
    }
    createConicGradient() { notImplemented('createConicGradient') }
    createLinearGradient(...args: any[]) {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createLinearGradient(${args.join(',')});`)
        return new RecordingCanvasGradient(this.#ops, n)
    }
    createRadialGradient(...args: any[]) {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createRadialGradient(${args.join(',')});`)
        return new RecordingCanvasGradient(this.#ops, n)
    }
    createPattern(image: CanvasImageSource, repetition: string | null) {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createPattern(${imageArg(image)},${repetition});`)
        return new RecordingCanvasPattern(this.#ops, n)
    }
    #shadowBlur = 0
    get shadowBlur() {
        return this.#shadowBlur
    }
    set shadowBlur(value) {
        this.#ops.push(`${this.varName}.shadowBlur=${value};`)
        this.#shadowBlur = value
    }
    #shadowColor: string = 'rgba(0, 0, 0, 0)'
    get shadowColor() {
        return this.#shadowColor
    }
    set shadowColor(value) {
        this.#ops.push(`${this.varName}.shadowColor=${stringArg(value)};`)
        this.#shadowColor = value
    }
    #shadowOffsetX = 0
    get shadowOffsetX() {
        return this.#shadowOffsetX
    }
    set shadowOffsetX(value) {
        this.#ops.push(`${this.varName}.shadowOffsetX=${value};`)
        this.#shadowOffsetX = value
    }
    #shadowOffsetY = 0
    get shadowOffsetY() {
        return this.#shadowOffsetY
    }
    set shadowOffsetY(value) {
        this.#ops.push(`${this.varName}.shadowOffsetY=${value};`)
        this.#shadowOffsetY = value
    }
    beginPath(...args: any[]) { this.#ops.push(`${this.varName}.beginPath(${args.join(',')});`) }
    closePath(...args: any[]) { this.#ops.push(`${this.varName}.closePath(${args.join(',')});`) }
    moveTo(...args: any[]) { this.#ops.push(`${this.varName}.moveTo(${args.join(',')});`) }
    lineTo(...args: any[]) { this.#ops.push(`${this.varName}.lineTo(${args.join(',')});`) }
    bezierCurveTo(...args: any[]) { this.#ops.push(`${this.varName}.bezierCurveTo(${args.join(',')});`) }
    quadraticCurveTo(...args: any[]) { this.#ops.push(`${this.varName}.quadraticCurveTo(${args.join(',')});`) }
    arc(...args: any[]) { this.#ops.push(`${this.varName}.arc(${args.join(',')});`) }
    arcTo(...args: any[]) { this.#ops.push(`${this.varName}.arcTo(${args.join(',')});`) }
    ellipse(...args: any[]) { this.#ops.push(`${this.varName}.ellipse(${args.join(',')});`) }
    rect(...args: any[]) { this.#ops.push(`${this.varName}.rect(${args.join(',')});`) }
    fill(...args: any[]) { this.#ops.push(`${this.varName}.fill(${args.join(',')});`) }
    stroke(...args: any[]) { this.#ops.push(`${this.varName}.stroke(${args.join(',')});`) }
    drawFocusIfNeeded(...args: any[]) { this.#ops.push(`${this.varName}.drawFocusIfNeeded(${args.join(',')});`) }
    scrollPathIntoView(...args: any[]) { this.#ops.push(`${this.varName}.scrollPathIntoView(${args.join(',')});`) }
    clip(...args: any[]) { this.#ops.push(`${this.varName}.clip(${args.join(',')});`) }
    isPointInPath(): boolean { notImplemented('isPointInPath') }
    isPointInStroke(): boolean { notImplemented('isPointInStroke') }
    getTransform(): DOMMatrix { notImplemented('getTransform') }
    rotate(...args: any[]) { this.#ops.push(`${this.varName}.rotate(${args.join(',')});`) }
    scale(...args: any[]) { this.#ops.push(`${this.varName}.scale(${args.join(',')});`) }
    translate(...args: any[]) { this.#ops.push(`${this.varName}.translate(${args.join(',')});`) }
    transform(...args: any[]) { this.#ops.push(`${this.varName}.transform(${args.join(',')});`) }
    setTransform(...args: any[]) {
        if (typeof args[0] !== 'number') {
            notImplemented('setTransform({...})')
        }
        this.#ops.push(`${this.varName}.setTransform(${args.join(',')});`)
    }
    resetTransform() { this.#ops.push(`${this.varName}.resetTransform();`) }
    #globalAlpha = 1
    get globalAlpha() {
        return this.#globalAlpha
    }
    set globalAlpha(value) {
        this.#ops.push(`${this.varName}.globalAlpha=${value};`)
        this.#globalAlpha = value
    }
    #globalCompositeOperation = 'source-over'
    get globalCompositeOperation() {
        return this.#globalCompositeOperation
    }
    set globalCompositeOperation(value) {
        this.#ops.push(`${this.varName}.globalCompositeOperation=${stringArg(value)};`)
        this.#globalCompositeOperation = value
    }
    drawImage(image: CanvasImageSource, ...args: any[]) { this.#ops.push(`${this.varName}.drawImage(${imageArg(image)},${args.join(',')});`) }
    createImageData(): ImageData { notImplemented('createImageData') }
    getImageData(): ImageData { notImplemented('getImageData') }
    putImageData(image: ImageData, ...args: any[]) { this.#ops.push(`${this.varName}.putImageData({data:[],width:${image.width},height:${image.height}},${args.join(',')});`) }
    #imageSmoothingEnabled = true
    get imageSmoothingEnabled() {
        return this.#imageSmoothingEnabled
    }
    set imageSmoothingEnabled(value) {
        this.#ops.push(`${this.varName}.imageSmoothingEnabled=${value};`)
        this.#imageSmoothingEnabled = value
    }
    #imageSmoothingQuality: ImageSmoothingQuality = 'low'
    get imageSmoothingQuality() {
        return this.#imageSmoothingQuality
    }
    set imageSmoothingQuality(value) {
        this.#ops.push(`${this.varName}.imageSmoothingQuality=${stringArg(value)};`)
        this.#imageSmoothingQuality = value
    }
    save() { this.#ops.push(`${this.varName}.save();`) }
    restore() { this.#ops.push(`${this.varName}.restore();`) }
    getContextAttributes(): any { notImplemented('getContextAttributes') }
    #filter = 'none'
    get filter() {
        return this.#filter
    }
    set filter(value) {
        this.#ops.push(`${this.varName}.filter=${stringArg(value)};`)
        this.#filter = value
    }
}
