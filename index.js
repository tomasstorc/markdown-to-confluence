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
      console.log(content);
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

const publishContent = (content, spacekey, cnflurl, cnfluser, apikey) => {
  const payload = {
    type: "page",
    title: "My Test Page",
    space: { key: spacekey },
    body: {
      storage: {
        value: content,
        representation: "storage",
      },
    },
  };
  fetch(`${cnflurl}/wiki/rest/api/content`, {
    method: "POST",
    headers: {
      Authorization: `${cnfluser}:${apikey}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .then((data) => {
      console.log(data);
    });
};

let content = convertFn();
content.replace(/(?:\r\n|\r|\n)/g, "\\n");
if (core.getInput("publish")) {
  const SPACE_KEY = process.env.SPACE_KEY;
  const CNFL_URL = process.env.CNFL_URL;
  const API_KEY = process.env.API_KEY;
  const CNFL_USER = process.env.CNFL_USER;
  !SPACE_KEY && core.setFailed("Confluence space key is missing, exiting");
  !CNFL_URL && core.setFailed("Confluence URL is missing, exiting");
  !API_KEY && core.setFailed("Confluence API key is missing, exiting");
  !CNFL_USER && core.setFailed("Confluence user is missing, exiting");
  publishContent(content, SPACE_KEY, CNFL_URL, CNFL_USER, API_KEY);
}
