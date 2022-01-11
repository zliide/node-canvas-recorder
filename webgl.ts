import { notImplemented, RecordingContext, RecordingObject } from './recording.js'

export class RecordingWebGLCanvas implements RecordingContext {
    readonly canvas: HTMLCanvasElement
    readonly varName
    #ops: string[]
    #varIx = 0

    constructor(name: string, element: any) {
        this.#ops = []
        this.varName = name
        this.canvas = element
        let i = 0
        for (const glEnumValue of glEnumValues) {
            (this as any)[glEnumValue] = i++
        }
    }

    type() {
        return 'webgl'
    }
    getSources() {
        return []
    }
    script() {
        return this.#ops.join('\r\n')
    }

    get drawingBufferWidth(): number {
        return this.canvas.width
    }
    get drawingBufferHeight(): number {
        return this.canvas.height
    }

    activeTexture(texture: number) {
        this.#ops.push(`${this.varName}.activeTexture(${texture});`)
    }
    attachShader(program: RecordingObject, shader: RecordingObject) {
        this.#ops.push(`${this.varName}.attachShader(${program.varName}, ${shader.varName});`)
    }
    bindAttribLocation(_program: WebGLProgram, _index: number, _name: string) {
        notImplemented('webgl')
    }
    bindBuffer(target: number, buffer: RecordingObject | null) {
        this.#ops.push(`${this.varName}.bindBuffer(${this.varName}.${glEnumValues[target]}, ${buffer?.varName ?? null});`)
    }
    bindFramebuffer(target: number, buffer: RecordingObject | null) {
        this.#ops.push(`${this.varName}.bindFramebuffer(${this.varName}.${glEnumValues[target]}, ${buffer?.varName ?? null});`)
    }
    bindRenderbuffer(target: number, buffer: RecordingObject | null) {
        this.#ops.push(`${this.varName}.bindRenderbuffer(${this.varName}.${glEnumValues[target]}, ${buffer?.varName ?? null});`)
    }
    bindTexture(target: number, texture: RecordingObject | null) {
        this.#ops.push(`${this.varName}.bindTexture(${this.varName}.${glEnumValues[target]}, ${texture?.varName ?? null});`)
    }
    blendColor(_red: number, _green: number, _blue: number, _alpha: number) {
        notImplemented('webgl')
    }
    blendEquation(_mode: number) {
        notImplemented('webgl')
    }
    blendEquationSeparate(_modeRGB: number, _modeAlpha: number) {
        notImplemented('webgl')
    }
    blendFunc(_sfactor: number, _dfactor: number) {
        notImplemented('webgl')
    }
    blendFuncSeparate(_srcRGB: number, _dstRGB: number, _srcAlpha: number, _dstAlpha: number) {
        notImplemented('webgl')
    }
    checkFramebufferStatus(_target: number): number {
        notImplemented('webgl')
    }
    clear(...args: number[]) {
        this.#ops.push(`${this.varName}.clear(${args.join(',')});`)
    }
    clearColor(...args: number[]) {
        this.#ops.push(`${this.varName}.clearColor(${args.join(',')});`)
    }
    clearDepth(...args: number[]) {
        this.#ops.push(`${this.varName}.clearDepth(${args.join(',')});`)
    }
    clearStencil(...args: number[]) {
        this.#ops.push(`${this.varName}.clearStencil(${args.join(',')});`)
    }
    colorMask(...args: number[]) {
        this.#ops.push(`${this.varName}.colorMask(${args.join(',')});`)
    }
    compileShader(shader: RecordingObject) {
        this.#ops.push(`${this.varName}.compileShader(${shader.varName});`)
    }
    copyTexImage2D(_target: number, _level: number, _internalformat: number, _x: number, _y: number, _width: number, _height: number, _border: number) {
        notImplemented('webgl')
    }
    copyTexSubImage2D(_target: number, _level: number, _xoffset: number, _yoffset: number, _x: number, _y: number, _width: number, _height: number) {
        notImplemented('webgl')
    }
    createBuffer(): WebGLBuffer | null {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createBuffer();`)
        return new RecordingObject(this.#ops, n)
    }
    createFramebuffer(): WebGLFramebuffer | null {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createFramebuffer();`)
        return new RecordingObject(this.#ops, n)
    }
    createProgram(): WebGLProgram | null {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createProgram();`)
        return new RecordingObject(this.#ops, n)
    }
    createRenderbuffer(): WebGLRenderbuffer | null {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createRenderbuffer();`)
        return new RecordingObject(this.#ops, n)
    }
    createShader(type: number): WebGLShader | null {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createShader(${type});`)
        return new RecordingObject(this.#ops, n)
    }
    createTexture(): WebGLTexture | null {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.createTexture();`)
        return new RecordingObject(this.#ops, n)
    }
    cullFace(_mode: number) {
        notImplemented('webgl')
    }
    deleteBuffer(obj: RecordingObject) {
        this.#ops.push(`${this.varName}.deleteBuffer(${obj.varName});`)
    }
    deleteFramebuffer(obj: RecordingObject) {
        this.#ops.push(`${this.varName}.deleteFramebuffer(${obj.varName});`)
    }
    deleteProgram(obj: RecordingObject) {
        this.#ops.push(`${this.varName}.deleteProgram(${obj.varName});`)
    }
    deleteRenderbuffer(obj: RecordingObject) {
        this.#ops.push(`${this.varName}.deleteRenderbuffer(${obj.varName});`)
    }
    deleteShader(obj: RecordingObject) {
        this.#ops.push(`${this.varName}.deleteShader(${obj.varName});`)
    }
    deleteTexture(obj: RecordingObject) {
        this.#ops.push(`${this.varName}.deleteTexture(${obj.varName});`)
    }
    depthFunc(_func: number) {
        notImplemented('webgl')
    }
    depthMask(_flag: boolean) {
        notImplemented('webgl')
    }
    depthRange(_zNear: number, _zFar: number) {
        notImplemented('webgl')
    }
    detachShader(program: RecordingObject, shader: RecordingObject) {
        this.#ops.push(`${this.varName}.detachShader(${program.varName}, ${shader.varName});`)
    }
    disable(cap: number) {
        this.#ops.push(`${this.varName}.disable(${cap});`)
    }
    disableVertexAttribArray(index: number) {
        this.#ops.push(`${this.varName}.disableVertexAttribArray(${index});`)
    }
    drawArrays(mode: number, first: number, count: number) {
        this.#ops.push(`${this.varName}.detachShader(${this.varName}.${glEnumValues[mode]}, ${first}, ${count});`)
    }
    drawElements(mode: number, count: number, type: number, offset: number) {
        this.#ops.push(`${this.varName}.detachShader(${this.varName}.${glEnumValues[mode]}, ${count}, ${this.varName}.${glEnumValues[type]}, ${offset});`)
    }
    enable(cap: number) {
        this.#ops.push(`${this.varName}.enable(${cap});`)
    }
    enableVertexAttribArray(index: number) {
        this.#ops.push(`${this.varName}.enableVertexAttribArray(${index});`)
    }
    finish() {
        this.#ops.push(`${this.varName}.finish();`)
    }
    flush() {
        this.#ops.push(`${this.varName}.flush();`)
    }
    framebufferRenderbuffer(_target: number, _attachment: number, _renderbuffertarget: number, _renderbuffer: WebGLRenderbuffer | null) {
        notImplemented('webgl')
    }
    framebufferTexture2D(_target: number, _attachment: number, _textarget: number, _texture: WebGLTexture | null, _level: number) {
        notImplemented('webgl')
    }
    frontFace(_mode: number) {
        notImplemented('webgl')
    }
    generateMipmap(_target: number) {
        notImplemented('webgl')
    }
    getActiveAttrib(_program: WebGLProgram, _index: number): WebGLActiveInfo | null {
        notImplemented('webgl')
    }
    getActiveUniform(_program: WebGLProgram, _index: number): WebGLActiveInfo | null {
        notImplemented('webgl')
    }
    getAttachedShaders(_program: WebGLProgram): WebGLShader[] | null {
        notImplemented('webgl')
    }
    getAttribLocation(_program: WebGLProgram, _name: string): number {
        notImplemented('webgl')
    }
    getBufferParameter(_target: number, _pname: number) {
        return true
    }
    getContextAttributes(): WebGLContextAttributes | null {
        notImplemented('webgl')
    }
    getError(): number {
        notImplemented('webgl')
    }
    getExtension(name: string) {
        switch (name) {
            case 'WEBGL_lose_context': return {
                loseContext: () => {
                    this.#ops.push(`${this.varName}.getExtension('WEBGL_lose_context').loseContext();`)
                },
                restoreContext: () => {
                    this.#ops.push(`${this.varName}.getExtension('WEBGL_lose_context').restoreContext();`)
                },
            }
            default: return null
        }
    }
    getFramebufferAttachmentParameter(_target: number, _attachment: number, _pname: number) {
        return true
    }
    getParameter(_pname: number) {
        return true
    }
    getProgramInfoLog(_program: WebGLProgram): string | null {
        notImplemented('webgl')
    }
    getProgramParameter(_program: WebGLProgram, _pname: number) {
        return true
    }
    getRenderbufferParameter(_target: number, _pname: number) {
        return true
    }
    getShaderInfoLog(_shader: WebGLShader): string | null {
        notImplemented('webgl')
    }
    getShaderParameter(_shader: WebGLShader, _pname: number) {
        return true
    }
    getShaderPrecisionFormat(_shadertype: number, _precisiontype: number): WebGLShaderPrecisionFormat | null {
        notImplemented('webgl')
    }
    getShaderSource(_shader: WebGLShader): string | null {
        notImplemented('webgl')
    }
    getSupportedExtensions(): string[] | null {
        return []
    }
    getTexParameter(_target: number, _pname: number) {
        return true
    }
    getUniform(program: RecordingObject, location: RecordingObject) {
        this.#ops.push(`${this.varName}.getUniform(${program.varName}, ${location.varName});`)
    }
    getUniformLocation(program: RecordingObject, name: string): RecordingObject {
        const n = `${this.varName}_${this.#varIx++}`
        this.#ops.push(`const ${n} = ${this.varName}.getUniformLocation(${program.varName}, '${name}');`)
        return new RecordingObject(this.#ops, n)
    }
    getVertexAttrib(_index: number, _pname: number) {
        notImplemented('webgl')
    }
    getVertexAttribOffset(_index: number, _pname: number): number {
        notImplemented('webgl')
    }
    hint(_target: number, _mode: number) {
        notImplemented('webgl')
    }
    isBuffer(_buffer: WebGLBuffer | null): boolean {
        notImplemented('webgl')
    }
    isContextLost(): boolean {
        notImplemented('webgl')
    }
    isEnabled(_cap: number): boolean {
        return false
    }
    isFramebuffer(_framebuffer: WebGLFramebuffer | null): boolean {
        notImplemented('webgl')
    }
    isProgram(_program: WebGLProgram | null): boolean {
        notImplemented('webgl')
    }
    isRenderbuffer(_renderbuffer: WebGLRenderbuffer | null): boolean {
        notImplemented('webgl')
    }
    isShader(_shader: WebGLShader | null): boolean {
        notImplemented('webgl')
    }
    isTexture(_texture: WebGLTexture | null): boolean {
        notImplemented('webgl')
    }
    lineWidth(_width: number) {
        notImplemented('webgl')
    }
    linkProgram(program: RecordingObject) {
        this.#ops.push(`${this.varName}.linkProgram(${program.varName});`)
    }
    pixelStorei(_pname: number, _param: number | boolean) {
        notImplemented('webgl')
    }
    polygonOffset(_factor: number, _units: number) {
        notImplemented('webgl')
    }
    renderbufferStorage(_target: number, _internalformat: number, _width: number, _height: number) {
        notImplemented('webgl')
    }
    sampleCoverage(_value: number, _invert: boolean) {
        notImplemented('webgl')
    }
    scissor(_x: number, _y: number, _width: number, _height: number) {
        notImplemented('webgl')
    }
    shaderSource(shader: RecordingObject, source: string) {
        this.#ops.push(`${this.varName}.shaderSource(${shader.varName},'${source}');`)
    }
    stencilFunc(_func: number, _ref: number, _mask: number) {
        notImplemented('webgl')
    }
    stencilFuncSeparate(_face: number, _func: number, _ref: number, _mask: number) {
        notImplemented('webgl')
    }
    stencilMask(_mask: number) {
        notImplemented('webgl')
    }
    stencilMaskSeparate(_face: number, _mask: number) {
        notImplemented('webgl')
    }
    stencilOp(_fail: number, _zfail: number, _zpass: number) {
        notImplemented('webgl')
    }
    stencilOpSeparate(_face: number, _fail: number, _zfail: number, _zpass: number) {
        notImplemented('webgl')
    }
    texParameterf(_target: number, _pname: number, _param: number) {
        notImplemented('webgl')
    }
    texParameteri(_target: number, _pname: number, _param: number) {
        notImplemented('webgl')
    }
    uniform1f(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform1f(${location.varName},${args.join(',')});`)
    }
    uniform1i(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform1i(${location.varName},${args.join(',')});`)
    }
    uniform2f(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform2f(${location.varName},${args.join(',')});`)
    }
    uniform2i(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform2i(${location.varName},${args.join(',')});`)
    }
    uniform3f(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform3f(${location.varName},${args.join(',')});`)
    }
    uniform3i(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform3i(${location.varName},${args.join(',')});`)
    }
    uniform4f(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform4f(${location.varName},${args.join(',')});`)
    }
    uniform4i(location: RecordingObject, ...args: number[]) {
        this.#ops.push(`${this.varName}.uniform4i(${location.varName},${args.join(',')});`)
    }
    useProgram(program: RecordingObject) {
        this.#ops.push(`${this.varName}.useProgram(${program.varName});`)
    }
    validateProgram(program: RecordingObject) {
        this.#ops.push(`${this.varName}.validateProgram(${program.varName});`)
    }
    vertexAttrib1f(index: number, ...args: number[]) {
        this.#ops.push(`${this.varName}.vertexAttrib1f(${index}, ${args.join(',')});`)
    }
    vertexAttrib1fv(index: number, values: Float32List) {
        this.#ops.push(`${this.varName}.vertexAttrib1fv(${index}, [${values.join(',')}]);`)
    }
    vertexAttrib2f(index: number, ...args: number[]) {
        this.#ops.push(`${this.varName}.vertexAttrib2f(${index}, ${args.join(',')});`)
    }
    vertexAttrib2fv(index: number, values: Float32List) {
        this.#ops.push(`${this.varName}.vertexAttrib2fv(${index}, [${values.join(',')}]);`)
    }
    vertexAttrib3f(index: number, ...args: number[]) {
        this.#ops.push(`${this.varName}.vertexAttrib3f(${index}, ${args.join(',')});`)
    }
    vertexAttrib3fv(index: number, values: Float32List) {
        this.#ops.push(`${this.varName}.vertexAttrib3fv(${index}, [${values.join(',')}]);`)
    }
    vertexAttrib4f(index: number, ...args: number[]) {
        this.#ops.push(`${this.varName}.vertexAttrib4f(${index}, ${args.join(',')});`)
    }
    vertexAttrib4fv(index: number, values: Float32List) {
        this.#ops.push(`${this.varName}.vertexAttrib4fv(${index}, [${values.join(',')}]);`)
    }
    vertexAttribPointer(...args: any[]) {
        this.#ops.push(`${this.varName}.vertexAttrib4fv(${args.join(',')});`)
    }
    viewport(...args: number[]) {
        this.#ops.push(`${this.varName}.viewport(${args.join(',')});`)
    }
    bufferData(target: number, data: RecordingObject/* | null | number*/, usage: number) {
        this.#ops.push(`${this.varName}.bufferData(${this.varName}.${glEnumValues[target]},${data.varName},${this.varName}.${glEnumValues[usage]});`)
    }
    bufferSubData(target: number, offset: number, data: RecordingObject) {
        this.#ops.push(`${this.varName}.bufferSubData(${this.varName}.${glEnumValues[target]},${offset},${data.varName});`)
    }
    compressedTexImage2D(_target: number, _level: number, _internalformat: number, _width: number, _height: number, _border: number, _data: ArrayBufferView) {
        notImplemented('webgl')
    }
    compressedTexSubImage2D(_target: number, _level: number, _xoffset: number, _yoffset: number, _width: number, _height: number, _format: number, _data: ArrayBufferView) {
        notImplemented('webgl')
    }
    readPixels(_x: number, _y: number, _width: number, _height: number, _format: number, _type: number, _pixels: ArrayBufferView | null) {
        notImplemented('webgl')
    }
    texImage2D(_target: any, _level: any, _internalformat: any, _width: any, _height: any, _border: any, _format?: any, _type?: any, _pixels?: any) {
        notImplemented('webgl')
    }
    texSubImage2D(_target: any, _level: any, _xoffset: any, _yoffset: any, _width: any, _height: any, _format: any, _type?: any, _pixels?: any) {
        notImplemented('webgl')
    }
    uniform1fv(location: RecordingObject, v: Float32List) {
        this.#ops.push(`${this.varName}.uniform1fv(${location.varName},[${v.join(',')}]);`)
    }
    uniform1iv(location: RecordingObject, v: Int32List) {
        this.#ops.push(`${this.varName}.uniform1iv(${location.varName},[${v.join(',')}]);`)
    }
    uniform2fv(location: RecordingObject, v: Float32List) {
        this.#ops.push(`${this.varName}.uniform2fv(${location.varName},[${v.join(',')}]);`)
    }
    uniform2iv(location: RecordingObject, v: Int32List) {
        this.#ops.push(`${this.varName}.uniform2iv(${location.varName},[${v.join(',')}]);`)
    }
    uniform3fv(location: RecordingObject, v: Float32List) {
        this.#ops.push(`${this.varName}.uniform3fv(${location.varName},[${v.join(',')}]);`)
    }
    uniform3iv(location: RecordingObject, v: Int32List) {
        this.#ops.push(`${this.varName}.uniform3iv(${location.varName},[${v.join(',')}]);`)
    }
    uniform4fv(location: RecordingObject, v: Float32List) {
        this.#ops.push(`${this.varName}.uniform4fv(${location.varName},[${v.join(',')}]);`)
    }
    uniform4iv(location: RecordingObject, v: Int32List) {
        this.#ops.push(`${this.varName}.uniform4iv(${location.varName},[${v.join(',')}]);`)
    }
    uniformMatrix2fv(location: RecordingObject, transpose: boolean, value: Float32List) {
        this.#ops.push(`${this.varName}.uniformMatrix2fv(${location.varName},${transpose},[${value.join(',')}]);`)
    }
    uniformMatrix3fv(location: RecordingObject, transpose: boolean, value: Float32List) {
        this.#ops.push(`${this.varName}.uniformMatrix3fv(${location.varName},${transpose},[${value.join(',')}]);`)
    }
    uniformMatrix4fv(location: RecordingObject, transpose: boolean, value: Float32List) {
        this.#ops.push(`${this.varName}.uniformMatrix4fv(${location.varName},${transpose},[${value.join(',')}]);`)
    }
}

const glEnumValues = ['ZERO', 'ACTIVE_ATTRIBUTES', 'ACTIVE_TEXTURE', 'ACTIVE_UNIFORMS', 'ALIASED_LINE_WIDTH_RANGE', 'ALIASED_POINT_SIZE_RANGE', 'ALPHA', 'ALPHA_BITS', 'ALWAYS', 'ARRAY_BUFFER', 'ARRAY_BUFFER_BINDING', 'ATTACHED_SHADERS', 'BACK', 'BLEND', 'BLEND_COLOR', 'BLEND_DST_ALPHA', 'BLEND_DST_RGB', 'BLEND_EQUATION', 'BLEND_EQUATION_ALPHA', 'BLEND_EQUATION_RGB', 'BLEND_SRC_ALPHA', 'BLEND_SRC_RGB', 'BLUE_BITS', 'BOOL', 'BOOL_VEC2', 'BOOL_VEC3', 'BOOL_VEC4', 'BROWSER_DEFAULT_WEBGL', 'BUFFER_SIZE', 'BUFFER_USAGE', 'BYTE', 'CCW', 'CLAMP_TO_EDGE', 'COLOR_ATTACHMENT0', 'COLOR_BUFFER_BIT', 'COLOR_CLEAR_VALUE', 'COLOR_WRITEMASK', 'COMPILE_STATUS', 'COMPRESSED_TEXTURE_FORMATS', 'CONSTANT_ALPHA', 'CONSTANT_COLOR', 'CONTEXT_LOST_WEBGL', 'CULL_FACE', 'CULL_FACE_MODE', 'CURRENT_PROGRAM', 'CURRENT_VERTEX_ATTRIB', 'CW', 'DECR', 'DECR_WRAP', 'DELETE_STATUS', 'DEPTH_ATTACHMENT', 'DEPTH_BITS', 'DEPTH_BUFFER_BIT', 'DEPTH_CLEAR_VALUE', 'DEPTH_COMPONENT', 'DEPTH_COMPONENT16', 'DEPTH_FUNC', 'DEPTH_RANGE', 'DEPTH_STENCIL', 'DEPTH_STENCIL_ATTACHMENT', 'DEPTH_TEST', 'DEPTH_WRITEMASK', 'DITHER', 'DONT_CARE', 'DST_ALPHA', 'DST_COLOR', 'DYNAMIC_DRAW', 'ELEMENT_ARRAY_BUFFER', 'ELEMENT_ARRAY_BUFFER_BINDING', 'EQUAL', 'FASTEST', 'FLOAT', 'FLOAT_MAT2', 'FLOAT_MAT3', 'FLOAT_MAT4', 'FLOAT_VEC2', 'FLOAT_VEC3', 'FLOAT_VEC4', 'FRAGMENT_SHADER', 'FRAMEBUFFER', 'FRAMEBUFFER_ATTACHMENT_OBJECT_NAME', 'FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE', 'FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE', 'FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL', 'FRAMEBUFFER_BINDING', 'FRAMEBUFFER_COMPLETE', 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT', 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS', 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT', 'FRAMEBUFFER_UNSUPPORTED', 'FRONT', 'FRONT_AND_BACK', 'FRONT_FACE', 'FUNC_ADD', 'FUNC_REVERSE_SUBTRACT', 'FUNC_SUBTRACT', 'GENERATE_MIPMAP_HINT', 'GEQUAL', 'GREATER', 'GREEN_BITS', 'HIGH_FLOAT', 'HIGH_INT', 'IMPLEMENTATION_COLOR_READ_FORMAT', 'IMPLEMENTATION_COLOR_READ_TYPE', 'INCR', 'INCR_WRAP', 'INT', 'INT_VEC2', 'INT_VEC3', 'INT_VEC4', 'INVALID_ENUM', 'INVALID_FRAMEBUFFER_OPERATION', 'INVALID_OPERATION', 'INVALID_VALUE', 'INVERT', 'KEEP', 'LEQUAL', 'LESS', 'LINEAR', 'LINEAR_MIPMAP_LINEAR', 'LINEAR_MIPMAP_NEAREST', 'LINES', 'LINE_LOOP', 'LINE_STRIP', 'LINE_WIDTH', 'LINK_STATUS', 'LOW_FLOAT', 'LOW_INT', 'LUMINANCE', 'LUMINANCE_ALPHA', 'MAX_COMBINED_TEXTURE_IMAGE_UNITS', 'MAX_CUBE_MAP_TEXTURE_SIZE', 'MAX_FRAGMENT_UNIFORM_VECTORS', 'MAX_RENDERBUFFER_SIZE', 'MAX_TEXTURE_IMAGE_UNITS', 'MAX_TEXTURE_SIZE', 'MAX_VARYING_VECTORS', 'MAX_VERTEX_ATTRIBS', 'MAX_VERTEX_TEXTURE_IMAGE_UNITS', 'MAX_VERTEX_UNIFORM_VECTORS', 'MAX_VIEWPORT_DIMS', 'MEDIUM_FLOAT', 'MEDIUM_INT', 'MIRRORED_REPEAT', 'NEAREST', 'NEAREST_MIPMAP_LINEAR', 'NEAREST_MIPMAP_NEAREST', 'NEVER', 'NICEST', 'NONE', 'NOTEQUAL', 'NO_ERROR', 'ONE', 'ONE_MINUS_CONSTANT_ALPHA', 'ONE_MINUS_CONSTANT_COLOR', 'ONE_MINUS_DST_ALPHA', 'ONE_MINUS_DST_COLOR', 'ONE_MINUS_SRC_ALPHA', 'ONE_MINUS_SRC_COLOR', 'OUT_OF_MEMORY', 'PACK_ALIGNMENT', 'POINTS', 'POLYGON_OFFSET_FACTOR', 'POLYGON_OFFSET_FILL', 'POLYGON_OFFSET_UNITS', 'RED_BITS', 'RENDERBUFFER', 'RENDERBUFFER_ALPHA_SIZE', 'RENDERBUFFER_BINDING', 'RENDERBUFFER_BLUE_SIZE', 'RENDERBUFFER_DEPTH_SIZE', 'RENDERBUFFER_GREEN_SIZE', 'RENDERBUFFER_HEIGHT', 'RENDERBUFFER_INTERNAL_FORMAT', 'RENDERBUFFER_RED_SIZE', 'RENDERBUFFER_STENCIL_SIZE', 'RENDERBUFFER_WIDTH', 'RENDERER', 'REPEAT', 'REPLACE', 'RGB', 'RGB565', 'RGB5_A1', 'RGBA', 'RGBA4', 'SAMPLER_2D', 'SAMPLER_CUBE', 'SAMPLES', 'SAMPLE_ALPHA_TO_COVERAGE', 'SAMPLE_BUFFERS', 'SAMPLE_COVERAGE', 'SAMPLE_COVERAGE_INVERT', 'SAMPLE_COVERAGE_VALUE', 'SCISSOR_BOX', 'SCISSOR_TEST', 'SHADER_TYPE', 'SHADING_LANGUAGE_VERSION', 'SHORT', 'SRC_ALPHA', 'SRC_ALPHA_SATURATE', 'SRC_COLOR', 'STATIC_DRAW', 'STENCIL_ATTACHMENT', 'STENCIL_BACK_FAIL', 'STENCIL_BACK_FUNC', 'STENCIL_BACK_PASS_DEPTH_FAIL', 'STENCIL_BACK_PASS_DEPTH_PASS', 'STENCIL_BACK_REF', 'STENCIL_BACK_VALUE_MASK', 'STENCIL_BACK_WRITEMASK', 'STENCIL_BITS', 'STENCIL_BUFFER_BIT', 'STENCIL_CLEAR_VALUE', 'STENCIL_FAIL', 'STENCIL_FUNC', 'STENCIL_INDEX8', 'STENCIL_PASS_DEPTH_FAIL', 'STENCIL_PASS_DEPTH_PASS', 'STENCIL_REF', 'STENCIL_TEST', 'STENCIL_VALUE_MASK', 'STENCIL_WRITEMASK', 'STREAM_DRAW', 'SUBPIXEL_BITS', 'TEXTURE', 'TEXTURE0', 'TEXTURE1', 'TEXTURE10', 'TEXTURE11', 'TEXTURE12', 'TEXTURE13', 'TEXTURE14', 'TEXTURE15', 'TEXTURE16', 'TEXTURE17', 'TEXTURE18', 'TEXTURE19', 'TEXTURE2', 'TEXTURE20', 'TEXTURE21', 'TEXTURE22', 'TEXTURE23', 'TEXTURE24', 'TEXTURE25', 'TEXTURE26', 'TEXTURE27', 'TEXTURE28', 'TEXTURE29', 'TEXTURE3', 'TEXTURE30', 'TEXTURE31', 'TEXTURE4', 'TEXTURE5', 'TEXTURE6', 'TEXTURE7', 'TEXTURE8', 'TEXTURE9', 'TEXTURE_2D', 'TEXTURE_BINDING_2D', 'TEXTURE_BINDING_CUBE_MAP', 'TEXTURE_CUBE_MAP', 'TEXTURE_CUBE_MAP_NEGATIVE_X', 'TEXTURE_CUBE_MAP_NEGATIVE_Y', 'TEXTURE_CUBE_MAP_NEGATIVE_Z', 'TEXTURE_CUBE_MAP_POSITIVE_X', 'TEXTURE_CUBE_MAP_POSITIVE_Y', 'TEXTURE_CUBE_MAP_POSITIVE_Z', 'TEXTURE_MAG_FILTER', 'TEXTURE_MIN_FILTER', 'TEXTURE_WRAP_S', 'TEXTURE_WRAP_T', 'TRIANGLES', 'TRIANGLE_FAN', 'TRIANGLE_STRIP', 'UNPACK_ALIGNMENT', 'UNPACK_COLORSPACE_CONVERSION_WEBGL', 'UNPACK_FLIP_Y_WEBGL', 'UNPACK_PREMULTIPLY_ALPHA_WEBGL', 'UNSIGNED_BYTE', 'UNSIGNED_INT', 'UNSIGNED_SHORT', 'UNSIGNED_SHORT_4_4_4_4', 'UNSIGNED_SHORT_5_5_5_1', 'UNSIGNED_SHORT_5_6_5', 'VALIDATE_STATUS', 'VENDOR', 'VERSION', 'VERTEX_ATTRIB_ARRAY_BUFFER_BINDING', 'VERTEX_ATTRIB_ARRAY_ENABLED', 'VERTEX_ATTRIB_ARRAY_NORMALIZED', 'VERTEX_ATTRIB_ARRAY_POINTER', 'VERTEX_ATTRIB_ARRAY_SIZE', 'VERTEX_ATTRIB_ARRAY_STRIDE', 'VERTEX_ATTRIB_ARRAY_TYPE', 'VERTEX_SHADER', 'VIEWPORT']
