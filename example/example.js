
const stringify = require('remark-stringify')
const parser = require('remark-parse')
const toVfile = require('to-vfile')
const unified = require('unified')
const html = require('remark-html')

const frontmatter = require('remark-frontmatter')
const { parse:untoml } = require('toml')
const extractFrontmatter = require('../')

const createHeading = value => ({
  type: 'heading',
  depth: 1,
  children: [{
    type: 'text',
    value
  }]
})

const insertTitleHeading = () => (tree, file) => {
  const { data: { frontmatter } } = file
  let children = [...tree.children]
  children.splice(1, 0, createHeading(frontmatter[0].title))
  tree.children = children
}

unified()
  .use(parser)
  .use(stringify)
  .use(frontmatter, ['toml'])
  .use(extractFrontmatter, { type: 'toml', parser: untoml })
  .use(insertTitleHeading)
  .use(html)
  .process(toVfile.readSync('./example.md'))
  .then(r => console.log(String(r)))
  .catch(console.error)
