const FunctionSQLRawPrevent = (value) => new Promise((resolve, reject) => {
  try {
    var newValue

    // Check Null Values
    if (value === null || value === undefined) resolve(value)

    if (new RegExp('(%27)|(\')|(--)|(%23)|(#)', 'ig').test(value) ||
      new RegExp('((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))', 'ig').test(value) ||
      new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'ig').test(value) ||
      new RegExp('((%27)|(\'))union', 'ig').test(value)
    ) {
      // SQL Meta Test 1
      newValue = value.replace(/(%27)|(\')|(--)|(%23)|(#)/ig, '')
      // SQL Meta Test 2
      newValue = newValue.replace(/((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))/ig, '')
      // SQL Typical Test 2
      newValue = newValue.replace(/w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))/ig, '')
      // SQL Union Test 2
      newValue = newValue.replace(/((%27)|(\'))union/ig, '')

      resolve(newValue)
    }

    resolve(value)
  } catch(error) {
    reject(error)
  }
})

module.exports = {
  FunctionSQLRawPrevent
}