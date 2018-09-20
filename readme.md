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
