const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const showdown = require("showdown");
const fetch = require("node-fetch");

const convert2html = (text) => {
  let converter = new showdown.Converter();
  return converter.makeHtml(text);
};
const convertFn = () => {
  try {
    if (core.getInput("markdown")) {
      console.log("using text as input");
      let content = core.getInput("markdown");
      return convert2html(content);
    }
    if (core.getInput("filename")) {
      console.log("using file as input");
      let filename = core.getInput("filename");
      return convert2html(fs.readFileSync(filename).toString());
    }
  } catch (e) {
    core.setFailed(e.message);
  }
};

const publishContent = (content) => {
 const basicauth = new Buffer.from(`${core.getInput('cnfluser')}:${core.getInput("apikey")}`).toString("base64")
  const payload = {
    type: "page",
    title: core.getInput("title"),
    space: { key: core.getInput("spacekey") },
    body: {
      storage: {
        value: content,
        representation: "storage",
      },
    },
  };
  fetch(`${core.getInput("cnflurl")}/wiki/rest/api/content`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicauth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      return res;
    })
    .then((data) => {
      console.log("success");
    });
};

const checkInputs = () => {
    !core.getInput('spacekey') && core.setFailed("Confluence space key is missing, exiting");
    !core.getInput('cnflurl') && core.setFailed("Confluence URL is missing, exiting");
    !core.getInput('apikey') && core.setFailed("Confluence API key is missing, exiting");
    !core.getInput("cnfluser") && core.setFailed("Confluence user is missing, exiting");
    !core.getInput("title") && core.setFailed("Page title is missing, exiting");
}


checkInputs()
let content = convertFn();
publishContent(content);
