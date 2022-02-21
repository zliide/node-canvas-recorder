declare var precision: number
declare var typescript: boolean
declare var fontLoaders: Promise<void>[]
declare var fonts: { family: string, sizes: number[], weights: string[], alphabet: string }[]
declare var fallbacks: string[]

const result = document.getElementById('result')!

function printPre(line: string) {
    result.innerText += line + '\r\n'
}

function noCanvas(): never {
    throw new Error('Could not create 2D canvas.')
}

const canvasContext = document.createElement('canvas').getContext('2d') ?? noCanvas()

function measure(text: string) {
    const metrics = canvasContext.measureText(text)
    return {
        ascent: metrics.actualBoundingBoxAscent,
        descent: metrics.actualBoundingBoxDescent,
        width: metrics.width,
    }
}

interface Size {
    ascent: number
    descent: number
    width: number
}

function snap(size: Size) {
    return {
        ascent: Math.round(size.ascent * precision),
        descent: Math.round(size.descent * precision),
        width: Math.round(size.width * precision),
    }
}

function scaleDown(size: Size, factor: number) {
    return {
        ascent: size.ascent / factor,
        descent: size.descent / factor,
        width: size.width / factor,
    }
}

function unsnap(size: Size) {
    return scaleDown(size, precision)
}

function sum(sizes: Size[]) {
    if (sizes.length === 1) {
        return sizes[0]
    }
    if (sizes.length === 2) {
        return {
            ascent: Math.max(sizes[0].ascent, sizes[1].ascent),
            descent: Math.max(sizes[0].descent, sizes[1].descent),
            width: sizes[0].width + sizes[1].width,
        }
    }
    if (sizes.length === 0) {
        return {
            ascent: 0,
            descent: 0,
            width: 0,
        }
    }
    return {
        ascent: Math.max(...sizes.map(s => s.ascent)),
        descent: Math.max(...sizes.map(s => s.descent)),
        width: sizes.map(s => s.width).reduce((pv, cv) => pv + cv, 0),
    }
}

class Statistician {
    #values: Map<number, string[]> = new Map()

    collect(text: string, value: number) {
        const existing = this.#values.get(value)
        if (existing) {
            existing.push(text)
        } else {
            this.#values.set(value, [text])
        }
    }

    get() {
        const mostAbundant: [number, string[]] = [0, []]
        for (const [value, texts] of this.#values) {
            if (texts.length > mostAbundant[1].length) {
                mostAbundant[0] = value
                mostAbundant[1] = texts
            }
        }
        const rest = new Map(this.#values)
        rest.delete(mostAbundant[0])
        return { mostAbundant: mostAbundant[0], rest }
    }
}

function individualSize(text: string, textSizes: {
    default: { ascent: number, descent: number, width: number },
    individuals: { ascent: [string, number][]; descent: [string, number][]; width: [string, number][] }
}): Size {
    return {
        ascent: textSizes.individuals.ascent.find(([k]) => k.includes(text))?.[1] ?? textSizes.default.ascent,
        descent: textSizes.individuals.descent.find(([k]) => k.includes(text))?.[1] ?? textSizes.default.descent,
        width: textSizes.individuals.width.find(([k]) => k.includes(text))?.[1] ?? textSizes.default.width,
    }
}

type Metrics = {
    [family: string]: {
        [weight: string]: {
            default: Size
            individuals: {
                ascent: [letters: string, value: number][]
                descent: [letters: string, value: number][]
                width: [letters: string, value: number][]
            },
            ligatures: [Size, string][]
            spacing: {
                default: number,
                special: [texts: string[], value: number][]
            }
        }
    }
}

Promise.all(fontLoaders).then(() => {
    const metrics: Metrics = {}

    for (const font of fonts) {
        metrics[font.family] = {}
        for (const weight of font.weights) {
            const fontSize = font.sizes.reverse()[0]
            const f = [`normal ${weight} ${fontSize}px "${font.family}"`, ...fallbacks].join(', ')
            console.log(`${f} has`)
            canvasContext.font = f
            const ascentStats = new Statistician()
            const descentStats = new Statistician()
            const widthStats = new Statistician()
            for (const letter of [...font.alphabet]) {
                const snapped = snap(measure(letter))
                ascentStats.collect(letter, snapped.ascent)
                descentStats.collect(letter, snapped.descent)
                widthStats.collect(letter, snapped.width)
            }
            const [asc, desc, w] = [ascentStats.get(), descentStats.get(), widthStats.get()]
            const textSizes = {
                default: unsnap({
                    ascent: asc.mostAbundant / fontSize,
                    descent: desc.mostAbundant / fontSize,
                    width: w.mostAbundant / fontSize,
                }),
                individuals: {
                    ascent: [...asc.rest].map(([size, letters]) => [letters.join(''), size / precision / fontSize] as [string, number]),
                    descent: [...desc.rest].map(([size, letters]) => [letters.join(''), size / precision / fontSize] as [string, number]),
                    width: [...w.rest].map(([size, letters]) => [letters.join(''), size / precision / fontSize] as [string, number]),
                },
                ligatures: [] as [Size, string][],
            }
            const spacingStats = new Statistician()
            for (const l1 of [...font.alphabet]) {
                const s1 = individualSize(l1, textSizes)
                for (const l2 of [...font.alphabet]) {
                    const concat = l1 + l2
                    const s2 = individualSize(l2, textSizes)
                    const combinedSize = measure(concat)
                    const individualsSize = sum([s1, s2])
                    const difference = {
                        ascent: Math.round((combinedSize.ascent - individualsSize.ascent * fontSize) * precision / 2) / precision * 2,
                        descent: Math.round((combinedSize.descent - individualsSize.descent * fontSize) * precision / 2) / precision * 2,
                        width: Math.round((combinedSize.width - individualsSize.width * fontSize) * precision / 2) / precision * 2,
                    }
                    if (difference.ascent || difference.descent) {
                        textSizes.ligatures.push([scaleDown(combinedSize, fontSize), concat])
                    }
                    spacingStats.collect(concat, difference.width)
                }
            }
            console.log(` - ${textSizes.ligatures.length} ligatures`)
            const { mostAbundant, rest } = spacingStats.get()
            metrics[font.family][weight] = {
                ...textSizes,
                spacing: {
                    default: mostAbundant / fontSize,
                    special: [...rest].map(([spacing, concat]) => [concat, spacing / fontSize] as [string[], number]),
                },
            }
            console.log(` - ${metrics[font.family][weight].spacing.special.flatMap(([pairs]) => pairs).length} special spacing pairs`)
        }
    }

    printPre(`// Auto-generated by text-measure.html
` + typed(typescript, `
// tslint:disable-next-line: max-line-length quotemark
const metrics = ${JSON.stringify(metrics, (_, v) => typeof v === 'number' ? Math.round(v * 10000) / 10000 : v)}

export function measureText(font, text) {
    return measureTextWithMetrics(metrics, font, text)
}

const fontRegExp = ${fontRegExp}

${parseFont}

${getMetricsForFont}

${measureTextWithMetrics}`))
}).catch(e => {
    console.error(e)
    printPre(e.message)
})

function typed(ts: boolean, code: string) {
    if (!ts) {
        return code
    }
    return `
interface Size {
    ascent: number
    descent: number
    width: number
}

type Metrics = {
    [family: string]: {
        [weight: string]: {
            default: Size
            individuals: {
                ascent: [letters: string, value: number][]
                descent: [letters: string, value: number][]
                width: [letters: string, value: number][]
            },
            ligatures: [Size, string][]
            spacing: {
                default: number,
                special: [texts: string[], value: number][]
            }
        }
    }
}
` + code
            .replace('const metrics = ', 'const metrics: Metrics = ')
            .replace('function measureText(font, text)', 'function measureText(font: string, text: string)')
            .replace('function parseFont(font)', 'function parseFont(font: string)')
            .replace('function getMetricsForFont(m, font)', 'function getMetricsForFont(m: Metrics, font: string)')
            .replace('function measureTextWithMetrics(m, font, text)', 'function measureTextWithMetrics(m: Metrics, font: string, text: string)')
            .replace(/;\r\n/g, '\r\n')
}

const fontRegExp = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])?))?\s*([-_,\"\/\sa-z]+?)\s*$/i

function parseFont(font: string) {
    const match = fontRegExp.exec(font)
    if (!match) {
        console.log('Unmatched font: ' + font)
        return { weight: 'normal', size: '12px', height: '1', family: 'sans-serif' }
    }
    const [_all, _style = 'normal', _variant = 'normal', weight = 'normal', size = '12px', height = '1', family] = match ?? []
    return { weight, size, height, family }
}

function getMetricsForFont(m: Metrics, font: string) {
    const { weight, size, family } = parseFont(font)
    if (!size.endsWith('px')) {
        console.warn('Font size not supported: ' + font)
    }
    const fm = m[family]?.[weight] ?? m[family]?.normal ?? Object.values(m[family] ?? Object.values(m)[0])[0]
    return {
        fontSize: parseFloat(size) || 12,
        metrics: fm,
    }
}

function measureTextWithMetrics(m: Metrics, font: string, text: string) {
    const fm = getMetricsForFont(m, font)
    const textSize = {
        width: 0,
        ascent: Number.MIN_SAFE_INTEGER,
        descent: Number.MIN_SAFE_INTEGER,
    }
    for (let i = 0; i !== text.length; ++i) {
        const letter = text[i]
        const letterSize = {
            ascent: fm.metrics.individuals.ascent.find(([letters]) => letters.includes(letter))?.[1] ?? fm.metrics.default.ascent,
            descent: fm.metrics.individuals.descent.find(([letters]) => letters.includes(letter))?.[1] ?? fm.metrics.default.descent,
            width: fm.metrics.individuals.width.find(([letters]) => letters.includes(letter))?.[1] ?? fm.metrics.default.width,
        }
        textSize.width += letterSize.width
        if (letterSize.ascent > textSize.ascent) {
            textSize.ascent = letterSize.ascent
        }
        if (letterSize.descent > textSize.descent) {
            textSize.descent = letterSize.descent
        }
    }
    for (let i = 0; i !== text.length - 1; ++i) {
        const pair = text.slice(i, i + 2)
        const spacing = fm.metrics.spacing.special.find(([texts]) => texts.includes(pair))?.[1] ?? fm.metrics.spacing.default
        textSize.width += spacing
    }
    return {
        height: (textSize.ascent + textSize.descent) * fm.fontSize,
        width: textSize.width * fm.fontSize,
        descent: textSize.descent * fm.fontSize,
    }
}
