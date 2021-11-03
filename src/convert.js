const parse = require('./parse')
const render = require('./render')
const validate = require('./validate')
const normalize = require('./normalize')
const { DEFAULT_OPTIONS } = require('./constants')
const { resetResultImports } = require('./make')
const { InvalidArchiveError } = require('./error')

/**
 * Convert one or many HAR objects, into k6 script
 * @param {HAR|Array<HAR>} _archives
 * @param options
 * @return {Promise<{main: *}>}
 */
async function convert(_archives, options = DEFAULT_OPTIONS) {
  const isMultiConvert = Array.isArray(_archives)
  const archives = !isMultiConvert ? [_archives] : _archives

  const result = archives.map((archive, index) => {
    const source = normalize(archive, options)
    try {
      validate(source)
    } catch (error) {
      throw new InvalidArchiveError(
        { name: error.name },
        isMultiConvert ? `Scenario(${index}): ${error.message}` : error.message
      )
    }

    return parse(source, isMultiConvert)
  })

  // Reset result imports so that result.importsState isn't tainted between calls
  resetResultImports()

  // NOTE: => render(result) instead of { main: render(result) } ??
  // Then /bin/har-to-k6.js need to change as well.
  return {
    main: render(...result),
  }
}

module.exports = convert
