# remark-extract-frontmatter

Stores front matter from markdown in VFiles data property

[![Travis](https://img.shields.io/travis/mrzmmr/remark-extract-frontmatter.svg)](https://travis-ci.org/mrzmmr/remark-extract-frontmatter)
[![Coverage
Status](https://coveralls.io/repos/github/mrzmmr/remark-extract-frontmatter/badge.svg?branch=master)](https://coveralls.io/github/mrzmmr/remark-extract-frontmatter?branch=master)

## Install

```sh
npm install --save remark-extract-frontmatter
```

## Usage

```js
const extract = require('remark-extract-frontmatter')
const frontmatter = require('remark-frontmatter')
const compiler = require('remark-stringify')
const report = require('vfile-reporter')
const parser = require('remark-parse')
const unified = require('unified')
const yaml = require('yaml')

unified()
  .use(parser)
  .use(compiler)
  .use(frontmatter)
  .use(extract, yaml.parse)
  .process('---\ntitle: "hello"\n---\n', function (err, file) {
    console.error(report(err || file))
    console.log(file)
  })
```

Would output the following VFile:

```
no issues found
VFile {
  data: { title: 'hello' },
  messages: [],
  history: [],
  cwd: '/remark-extract-frontmatter',
  contents: '---\ntitle: "hello"\n---\n' }
```

### Options

#### [...parsers]

Type: `Function`

Default: `null`

Function used to parse frontmatter type for example `{ yaml: require('yaml').parse }` would use the yaml modules parse function for nodes of type `yamlFrontMatter`. If no parse function is given for a type, then the node is skipped and parsed as normal. If no parse functions are set for any types then this plugin does nothing.

#### name

Type: `String`

Default: `null`

Specify a key to store frontmatter in for example, `{ name: 'frontmatter' }` will store any parsed frontmatter as `data: { frontmatter: { ... } }`. By default the parsed frontmatter is merged into the data object.


#### throws

Type: `Boolean`

Default: `false`

Specify if when an error parsing frontmatter occurs, to fail and throw error using `VFile.fail` or continue and set a warning using `VFile.message`.


MIT &copy; Paul Zimmer
