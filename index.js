const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const showdown = require("showdown");

const convert2html = (text) => {
  let converter = new showdown.Converter();
  return converter.makeHtml(text);
};
try {
  console.log(fs.readdirSync("."));
  let content = core.getInput("markdown");
  console.log(content);
  let converted = convert2html(content);
  console.log(converted);
} catch (e) {
  core.setFailed(e.message);
}
