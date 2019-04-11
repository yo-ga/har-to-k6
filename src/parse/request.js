const cookies = require('./cookies')
const headers = require('./headers')
const postData = require('./postData')
const queryString = require('./queryString')

function request (node, spec) {
  Object.assign(spec, {
    method: node.method.toUpperCase(),
    address: node.url,
    query: new Map(),
    headers: new Map(),
    cookies: new Map(),
    post: new Map()
  })
  if (node.comment) {
    comment(node.comment, spec)
  }
  if (node.queryString) {
    queryString(node.queryString, spec.query)
  }
  if (node.headers) {
    headers(node.headers, spec.headers)
  }
  if (node.cookies) {
    cookies(node.cookies, spec.cookies)
  }
  if (node.postData) {
    postData(node.postData, spec.post)
  }
}

function comment (value, spec) {
  spec.comment = value
}

module.exports = request
