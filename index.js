const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const showdown = require("showdown");

try {
  core.setOutput("converted", fs.readFileSync("README.md"));
} catch (e) {
  core.setFailed(e.message);
}
