const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const showdown = require("showdown");

const convert2html = (text) => {
  let converter = new showdown.Converter();
  return converter.makeHtml(text);
};
try {
  if (core.getInput("markdown")) {
    console.log("using text as input");
    let content = core.getInput("markdown");
    console.log(content);
    let converted = convert2html(content);
    console.log(converted);
  }
  if (core.getInput("filename")) {
    console.log("using file as input");
    let filename = core.getInput("filename");
    let converted = convert2html(fs.readFileSync(filename).toString());
    console.log(converted);
  }
} catch (e) {
  core.setFailed(e.message);
}
