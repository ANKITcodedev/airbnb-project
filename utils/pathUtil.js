// core module
const path = require("path");
module.exports = path.dirname(
  (require.main && require.main.filename) ? require.main.filename : process.cwd()
);
