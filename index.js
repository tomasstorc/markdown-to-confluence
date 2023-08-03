const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const showdown = require("showdown");

const convert2html = (text) => {
  let converter = new showdown.Converter();
  return converter.convert2html(text);
};
try {
  core.setOutput("converted", fs.readFileSync("README.md"));
  let fileText = fs.readFileSync("README.md").toString();
  let converted = convert2html(fileText);
  console.log(converted);
} catch (e) {
  core.setFailed(e.message);
}
