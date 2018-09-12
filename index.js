const frontmatter = (tree, options) => {
  const parser = (options || {}).parser || (v => v)
  const type = (options || {}).type || 'yaml'
  const {children} = tree
  const data = []
  let i = -1
  let child

  while (++i < children.length - 1) {
    child = children[i]

    if (child.type && child.type === type) {
      data.push(parser(child.value))
    }
  }

  return data
}

module.exports = options => (tree, file) => {
  const data = frontmatter(tree, options)
  if (file.data.frontmatter) {
    file.data.frontmatter = [ ...file.data.frontmatter, ...data ]
  } else {
    file.data.frontmatter = data
  }
}

module.exports.frontmatter = frontmatter
