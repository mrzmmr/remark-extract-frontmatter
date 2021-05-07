# remark-extract-frontmatter

[Remark](http://github.com/syntax-tree/remark) plugin to store front matter from markdown.

[![Travis](https://img.shields.io/travis/mrzmmr/remark-extract-frontmatter.svg)](https://travis-ci.org/mrzmmr/remark-extract-frontmatter)
[![Coverage
Status](https://coveralls.io/repos/github/mrzmmr/remark-extract-frontmatter/badge.svg?branch=master)](https://coveralls.io/github/mrzmmr/remark-extract-frontmatter?branch=master)

## Install

```
npm install --save remark-extract-frontmatter
```

## Usage

If we have some markdown using yaml frontmatter, example.md

```
---
title: Example
list:
  - one
  - 0
  - false
---

# Other markdown
```

and

```js
const extract = require('remark-extract-frontmatter')
const frontmatter = require('remark-frontmatter')
const compiler = require('remark-stringify')
const report = require('vfile-reporter')
const parser = require('remark-parse')
const toVfile = require('to-vfile')
const unified = require('unified')
const yaml = require('yaml').parse

unified()
  .use(parser)
  .use(compiler)
  .use(frontmatter)
  .use(extract, { yaml: yaml })
  .process(toVfile.readSync('./example.md'), function (err, file) {
    console.error(report(err || file))
    console.log(file.toString())
    console.log(file.data)
  })
```

will output

```
./example.md: no issues found
---
title: 'Example'
list:
  - one
  - 0
  - false
---

# Other markdown

{ title: 'Example', list: [ 'one', 0, false ] }
```

### Options

#### Options[parser]

Type: `Function`

Default: `null`

Specify the function (value) to use when parsing a frontmatter type (key). For example for yaml, options could be `{ yaml: require('yaml').parse }`, or for toml `{ toml: require('toml').parse }`. If no parsing function is set then this plugin will do nothing by default.

#### name

Type: `String`

Default: `null`

Specify a key to store frontmatter in for example, `{ name: 'frontmatter' }` will store any parsed frontmatter as `data: { frontmatter: { ... } }`. By default the parsed frontmatter is merged into the data object.

Example:

```js
unified()
  .use(parser)
  .use(compiler)
  .use(frontmatter, [ 'toml' ])
  .use(extract, { name: 'frontmatter', toml: toml.parse })
  .process('+++\ntitle: "Example"\n+++', function (err, file) {
    console.log(file.data)
  })
```

will output

```
{ frontmatter: { title: 'Example' } }
```

#### throws

Type: `Boolean`

Default: `false`

Specify if when an error parsing frontmatter occurs, to fail and throw error using `VFile.fail` or continue and set a warning using `VFile.message`.


#### remove

Type: `Boolean`

Default: `false`

Indicate if we should remove parsed frontmatter from the `VFile`. The default
behavior is to leave the parsed content in the `VFile`

### License

MIT &copy; Paul Zimmer
