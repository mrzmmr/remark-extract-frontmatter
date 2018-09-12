# remark-extract-frontmatter

> [Remark](http://github.com/syntax-tree/remark) plugin to store front matter from markdown.

[![Travis](https://img.shields.io/travis/mrzmmr/remark-extract-frontmatter.svg)](https://travis-ci.org/mrzmmr/remark-extract-frontmatter)
[![Coverage
Status](https://coveralls.io/repos/github/mrzmmr/remark-extract-frontmatter/badge.svg?branch=master)](https://coveralls.io/github/mrzmmr/remark-extract-frontmatter?branch=master)

## Install

```
npm install --save remark-extract-frontmatter
```

## Usage

```js
const frontmatter = require('remark-frontmatter')
const stringify = require('remark-stringify')
const parser = require('remark-parse')
const unified = require('unified')
const toml = require('toml').parse

const extractFrontmatter = require('remark-extract-frontmatter')

const vFile = unified()
.use(parser)
.use(stringify)
.use(frontmatter, [ 'toml' ])
.use(extractFrontmatter, { type: 'toml', parser: toml })
.processSync(`
+++
title = "Hello"
+++

# World!
`)
```

Outputs the following `VFile`

```js
VFile {
  data: { frontmatter: [ { title: 'Hello' } ] },
  messages: [],
  history: [],
  cwd: '/home',
  contents: '+++\ntitle = "Hello"\n+++\n\n# World!\n' }
```

Or use the standalone function which takes a tree as its first argument.

```js
const unified = require('unified')
const parser = require('remark-parser')
const stringify = require('remark-stringify')
const frontmatter = require('remark-frontmatter')
const { frontmatter:extract } = require('remark-extract-frontmatter')

const tree = unified()
.use(parser)
.use(stringify)
.use(frontmatter)
.parse(`
+++
title = "Hello"
+++

# World!
`)

### Options

#### type

Type: `string`

Default: 'yaml'

The type of node to look for, i.e yaml, toml.

#### parser

Type: `function`

Default: none

Pass in a function to parse the selected nodes value, i.e require('yamljs').parse

### License

MIT $copy; Paul Zimmer
