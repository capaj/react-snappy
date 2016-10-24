module.exports = function (input) {
  return input.replace(/<!--([\s\S]*?)-->/g, '')
}
