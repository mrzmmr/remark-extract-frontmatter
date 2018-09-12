const {test} = require('tap')
const frontmatter = require('remark-frontmatter')
const stringify = require('remark-stringify')
const parser = require('remark-parse')
const unified = require('unified')
const {parse: yaml} = require('yamljs')

const extractFrontmatter = require('.')

const markdown = `
---
title: "Hello World!"
---

# Other Markdown
`

test('remark-extract-frontmatter', t => {
  let file

  t.test('Standalone function', it => {
    const tree = unified()
      .use(parser)
      .use(stringify)
      .use(frontmatter)
      .parse(markdown)
    const matter = extractFrontmatter.frontmatter(tree, { parser: yaml })

    it.ok(
      matter,
      'It should return an object with a frontmatter property'
    )
    it.ok(
      matter[0].title === 'Hello World!',
      'It should be an object with a title property'
    )

    it.end()
  })

  t.test('Should store frontmatter in `vfile.data.frontmatter`', it => {
    it.doesNotThrow(() => {
      file = unified()
        .use(parser)
        .use(stringify)
        .use(frontmatter)
        .use(extractFrontmatter)
        .processSync(markdown)

      it.ok(Array.isArray(file.data.frontmatter))
      it.ok(file.data.frontmatter.length === 1)
      it.ok(file.data.frontmatter[0] === 'title: "Hello World!"')
    }, 'No options')

    it.doesNotThrow(() => {
      file = unified()
        .use(parser)
        .use(stringify)
        .use(frontmatter)
        .use(extractFrontmatter, {type: 'yaml', parser: yaml})
        .processSync(markdown)

      it.ok(Array.isArray(file.data.frontmatter))
      //it.ok(typeof file.data.frontmatter[0] === 'object')
      //it.same(file.data.frontmatter[0], {title: 'Hello World!'})
    }, 'With parser option')

    it.doesNotThrow(() => {
      const start = unified()
        .use(parser)
        .use(stringify)
        .processSync(markdown)

      start.data.frontmatter = ['oops']

      file = unified()
        .use(parser)
        .use(stringify)
        .use(frontmatter)
        .use(extractFrontmatter, {type: 'toml', parser: yaml})
        .processSync(start)

      it.ok(file.data.frontmatter.length === 1)
    }, 'With wrong args')

    it.end()
  })
  t.end()
})
