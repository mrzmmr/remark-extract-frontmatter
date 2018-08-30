# remark-extract-frontmatter
Stores front matter from markdown in VFiles data property

[![Travis](https://img.shields.io/travis/mrzmmr/remark-extract-frontmatter.svg)](https://travis-ci.org/mrzmmr/remark-extract-frontmatter)
[![Coverage
Status](https://coveralls.io/repos/github/mrzmmr/remark-extract-frontmatter/badge.svg?branch=master)](https://coveralls.io/github/mrzmmr/remark-extract-frontmatter?branch=master)

## Install

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
title: "Hello"
+++

## World!
`)
```

Outputs the following `VFile`

```js
VFile {
  data: { frontmatter: [ { title: 'Hello' } ] },
  messages: [],
  history: [],
  cwd: '/home',
  contents: '+++\ntitle = "Hello"\n+++\n\n## World!\n' }
```
