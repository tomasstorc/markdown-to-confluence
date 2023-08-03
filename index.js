const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const showdown = require("showdown");

try {
  fs.readdir("./", (err, files) => {
    files.forEach((file) => {
      console.log(file);
      core.setOutput("converted", fs.readFileSync(file));
    });
  });
} catch (e) {
  core.setFailed(e.message);
}
