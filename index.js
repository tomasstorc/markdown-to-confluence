const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const showdown = require("showdown");

try {
  core.setOutput("converted", fs.readFileSync("README.md"));
  console.log(process.env.TEST);
  console.log(fs.readFileSync("README.md").toString());
} catch (e) {
  core.setFailed(e.message);
}
