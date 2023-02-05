const path = require("path");
const dotenv = require("dotenv");

module.exports = async () => {
  const envVars = dotenv.config({
    path: path.resolve(__dirname, ".env"),
  }).parsed;
  console.log("env variables", envVars);
  return Object.assign({}, envVars, process.env);
};
