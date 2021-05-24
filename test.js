const remark = require('remark')
const frontmatter = require('remark-frontmatter')
const { parse: yaml } = require('yaml')
const { parse: toml } = require('toml')
const { test } = require('tap')
const extract = require('.')

const okYaml = `---\ntest: ok\n---\n`
const okToml = `+++\ntest = "ok"\n+++\n`
const okYamlMd = `---\ntest: ok\n---\n# Header`
const badToml = `+++\ntest: ok\n+++\n`

test('remark-extract-frontmatter', test => {
    const processor = remark()
        .use(frontmatter, ['yaml', 'toml'])

    test.test('Does nothing when given nothing', test => {
        const file = processor()
            .use(extract)
            .processSync(okYaml)

        test.ok(JSON.stringify(file.data) === '{}')
        test.end()
    })

    test.test('Extracts frontmatter given a parse', test => {
        const file = processor()
            .use(extract, yaml)
            .processSync(okYaml)

        test.ok(file.data.test === 'ok')
        test.end()
    })

    test.test('Works with parser as option', test => {
        const file = processor()
            .use(extract, { yaml })
            .processSync(okYaml)

        test.ok(file.data.test === 'ok')
        test.end()
    })

    test.test('Works with different parsers', test => {
        const file = processor()
            .use(extract, { toml })
            .processSync(okToml)

        test.ok(file.data.test === 'ok')
        test.end()
    })

    test.test('Works with name option', test => {
        const file = processor()
            .use(extract, { yaml, name: 'frontmatter' })
            .processSync(okYaml)

        test.ok(file.data.frontmatter)
        test.ok(file.data.frontmatter.test === 'ok')
        test.end()
    })

    test.test('Should just bail if parser returns nothing', test => {
        const file = processor()
            .use(extract, { yaml: () => {} })
            .processSync(okYaml)

        test.ok(JSON.stringify(file.data) === '{}')
        test.end()
    })

    test.test('Creates a VFile message when parser errors', test => {
        const file = processor()
            .use(extract, { toml })
            .processSync(badToml)

        test.ok(file.data)
        test.ok(JSON.stringify(file.data) === '{}')
        test.ok(file.messages[0].message === 'Expected "=", [ \\t] or [A-Za-z0-9_\\-] but ":" found.')
        test.end()
    })

    test.test('Should throw with `options.throws` passed and a parse error', test => {
        test.throws(() => {
            processor()
                .use(extract, { toml, throws: true })
                .processSync(badToml)
        })

        test.end()
    })

    test.test('Should remove frontmatter nodes when `options.remove` passed', test => {
        const file = processor()
            .use(extract, { yaml, remove: true })
            .processSync(okYamlMd)
        
        test.ok(file.data)
        test.ok(file.data.test === 'ok')
        test.ok(file.toString() === '# Header\n')
        test.end()
    })

    test.end()
})
