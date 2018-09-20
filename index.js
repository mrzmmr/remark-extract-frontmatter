module.exports = parseFrontMatter

var xtend = require('xtend')

function parseFrontMatter (options) {
  var blockTokenizers
  var blockMethods
  var tokenizer
  var parsers
  var methods
  var method
  var parse
  var name
  var index
  var i

  options = settings(options)

  if (!options || !options.parsers) {
      return
  }

  parsers = options.parsers
  parser = this.Parser

  if (isParser(parser)) {
    proto = parser.prototype
    blockTokenizers = proto.blockTokenizers
    blockMethods = proto.blockMethods
    methods = locate(blockMethods)

    if (!methods || methods.length < 1) {
      return
    }

    index = blockMethods.indexOf(methods[0])
    i = -1

    while (++i < methods.length){ 
      /**
       * Block method to identify tokenizer
       */
      method = methods[i]
      /**
       * Name of the parser for frontmatter, i.e "yaml"
       */
      name = method.replace('FrontMatter', '')
      /**
       * Actual function to parse frontmatter, i.e `yaml.parse`
       */
      parse = parsers[name]
      /**
       * The tokenizer to decorate
       */
      tokenizer = blockTokenizers[method]
      /**
       * Only decorate if a parser was given
       */
      if (parse) {
        /**
         * Replace Tokenizer with decorated tokenizer
         */
        blockTokenizers[method] = decorate(tokenizer, parse, name, options)
        //tokenizer = decorate(tokenizer, parse, name, options)
      }
    }
  }
}

/**
 * Returns a decorator for blockTokenizer
 * tokenizer - The tokenizer to decorate, i.e yamlFrontMatter
 * parse - A parse function to run on found frontmatter, i.e `yamljs.parse`
 * name - The name of type of frontmatter to be parsed, i.e "yaml"
 * options - Any options to use
 */
function decorate (tokenizer, parse, name, options) {
  return decorator

  function decorator (eat, value, silent) {
    var node = tokenizer(eat, value, silent)
    var file = this.file
    var frontmatter
    var data


    if (node && node.value) {
      try {
        frontmatter = parse(node.value)

        if (options.name) {
          file.data[options.name] = file.data[options.name] || {}
          file.data[options.name] = xtend({}, file.data[options.name], frontmatter)
        } else {
          file.data = xtend({}, file.data, frontmatter)
        }
      } catch (err) {
        error(err, file, name, options)
      }

      return node
    }
  }
}

/**
 * Handles errors such as creating a new `vfile.message` when parsing fails
 * err - The Error object produced
 * name - The name of type of frontmatter, i.e 'yaml'
 * options - Any options
 */
function error (err, file, name, options) {
  var message = err.message
  var column = err.column
  var line = err.line
  var type = err.name
  var method = 'message'

  if (options.throws) {
    method = 'fail'
  }

  file[method](
    message,
    { line: line, column: column },
    'parseFrontMatter:' + name + ':' + type
  )
}


/**
 * Locate any frontMatter methods that have been attatched to the Parser
 * methods - A list of blockMethods, i.e [ "yamlFrontMatter" ]
 */
function locate (methods) {
  var found = []
  var i = -1

  while (++i < methods.length) {
    if (methods[i] && methods[i].match(/FrontMatter$/)) {
      found.push(methods[i])
    }
  }

  return found
}

/**
 * Formats options passed. If options is a function then assume its a yaml
 * parser. Any keys other than the known options, `name`, `throws` are
 * assumed to be a parser type and put in `parsers`
 *
 * options - Object of options, or a function to parse frontmatter
 * options.throws - Boolean whether to throw when there's an error or not
 * options.name - The name to store parsed frontmatter as in 
 */
function settings (options) {
  var parsers
  var throws
  var name

  if (options && typeof options === 'function') {
    options = { yaml: options }
  }

  if (options && typeof options === 'object' && !Array.isArray(options)) {
    throws = options.throws || false
    name = options.name || null
    delete options.throws
    delete options.name
  }

  parsers = options
  options = {
    parsers: parsers,
    throws: throws,
    name: name
  }

  return options
}

function isParser (parser) {
  return Boolean(parser && parser.prototype && parser.prototype.blockMethods)
}

