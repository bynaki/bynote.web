/**
 * helpers
 */

const path = require('path')


function src(...pathSegs) {
  return path.resolve(__dirname, '../src', ...pathSegs)
}

function dist(...pathSegs) {
  return path.resolve(__dirname, '../dist', ...pathSegs)
}


module.exports = {
  src,
  dist,
}
