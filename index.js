module.exports = options => (tree, file) => {
  const parser = (options || {}).parser || (v => v)
  const type = (options || {}).type || 'yaml'
  const {children} = tree
  let i = -1
  let child

  if (!file.data.frontmatter) {
    file.data.frontmatter = []
  }

  while (++i < children.length - 1) {
    child = children[i]

    if (child.type && child.type === type) {
      file.data.frontmatter.push(parser(child.value))
    }
  }
}
