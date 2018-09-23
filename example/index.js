var unified = require('unified')
var parser = require('remark-parse')
var compiler = require('remark-stringify')
var frontmatter = require('remark-frontmatter')
var reporter = require('vfile-reporter')
var toVfile = require('to-vfile')
var yaml = require('yaml').parse
var extract = require('..')

unified()
  .use(parser)
  .use(compiler)
  .use(frontmatter)
  .use(extract, yaml)
  .process(toVfile.readSync('./example.md'), function (err, file) {
    console.error(reporter(err || file))
    console.log(file.toString())
    console.log(file.data)
  })
