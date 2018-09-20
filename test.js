var unified = require('unified')
var parser = require('remark-parse')
var compiler = require('remark-stringify')
var frontmatter = require('remark-frontmatter')
var yaml = require('yaml').parse
var toml = require('toml').parse
var test = require('tap').test

var extract = require('.')

var okYaml = '---\ntest: ok\n---\n'
var okToml = '+++\ntest = "ok"\n+++\n'
var badToml = '+++\ntest: ok\n+++\n'

test('remark-extract-frontmatter', function (t) {
  var processor = unified()
    .use(parser)
    .use(compiler)

  t.doesNotThrow(function () {
    t.test('Does not modify tokenizer.', function (it) {
      var file = processor()
        .use(frontmatter)
        .use(extract)
        .processSync(okYaml)

      it.ok(file)
      it.ok(JSON.stringify(file.data) === '{}')

      file = processor()
        .use(extract, toml)
        .processSync(okYaml)

      it.ok(file)
      it.end()
    })
    t.test('Extracts frontmatter given parser', function (it) {
      var file = processor()
        .use(frontmatter)
        .use(extract, yaml)
        .processSync(okYaml)

      it.ok(file.data.test)
      it.ok(file.data.test === 'ok')
      it.end()
    })
    t.test('Works with options', function (it) {
      var file = processor()
        .use(frontmatter, [ 'toml' ])
        .use(extract, { toml: toml })
        .processSync(okToml)

      it.ok(file.data.test)
      it.ok(file.data.test === 'ok')
      it.end()
    })
    t.test('Set a name to store frontmatter under', function (it) {
      var file = processor()
        .use(frontmatter)
        .use(extract, { yaml: yaml, name: 'frontmatter' })
        .processSync(okYaml)

      it.ok(file.data)
      it.ok(file.data.frontmatter)
      it.ok(file.data.frontmatter.test === 'ok')
      it.end()
    })

    t.test('Creates a VFile message when parser fails to parse frontmatter', function (it) {
      var file = processor()
        .use(frontmatter, [ 'toml' ])
        .use(extract, { toml: toml })
        .processSync(badToml)

      it.ok(file.data)
      it.ok(JSON.stringify(file.data) === '{}')
      it.ok(file.messages[0])
      it.ok(file.messages[0].message === 'Expected "=", [ \\t] or [A-Za-z0-9_\\-] but ":" found.')
      it.end()
    })
  })

  t.doesNotThrow(function () {
    unified()
      .use(parser)
      .use(compiler)
      .use(frontmatter)
      .use(extract, { toml: toml })
      .freeze()
  }, 'should not throw if wrong parsing function is given')

  t.doesNotThrow(function () {
    unified()
      .use(extract, yaml)
      .freeze()
  }, 'should not throw without parser')

  t.test('Should throw with `options.throws` and bad frontmatter', function (it) {
    it.throws(function () {
      processor()
        .use(frontmatter, [ 'toml' ])
        .use(extract, { toml: toml, throws: true })
        .processSync(badToml)
    })
    it.end()
  })

  t.end()
})
