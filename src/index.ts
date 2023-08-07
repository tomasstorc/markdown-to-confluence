import * as core from '@actions/core'

import * as fs from 'fs'
import {Converter} from 'showdown'
import fetch from 'node-fetch'

const convert2html = (text: string): string => {
  let converter = new Converter()
  return converter.makeHtml(text)
}
const convertFn = () => {
  try {
    if (core.getInput('markdown')) {
      console.log('using text as input')
      let content = core.getInput('markdown')
      return convert2html(content)
    }
    if (core.getInput('filename')) {
      console.log('using file as input')
      let filename = core.getInput('filename')
      return convert2html(fs.readFileSync(filename).toString())
    }
  } catch (e: any) {
    core.setFailed(e.message)
  }
}

const publishContent = (content: string | undefined) => {
  const basicauth = core.getInput('basicauth')
    ? core.getInput('basicauth')
    : Buffer.from(
        `${core.getInput('cnfluser')}:${core.getInput('apikey')}`
      ).toString('base64')
  const payload = {
    type: 'page',
    title: core.getInput('title'),
    space: {key: core.getInput('spacekey')},
    body: {
      storage: {
        value: content,
        representation: 'storage'
      }
    }
  }
  fetch(`${core.getInput('cnflurl')}/wiki/rest/api/content`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicauth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((res: any) => {
      return res
    })
    .then(() => {
      console.log('successfully published')
    })
}

const checkInputs = () => {
  !core.getInput('spacekey') &&
    core.setFailed('Confluence space key is missing, exiting')
  !core.getInput('cnflurl') &&
    core.setFailed('Confluence URL is missing, exiting')
  !core.getInput('apikey') &&
    core.setFailed('Confluence API key is missing, exiting')
  !core.getInput('cnfluser') &&
    core.setFailed('Confluence user is missing, exiting')
  !core.getInput('title') && core.setFailed('Page title is missing, exiting')
  !core.getInput('filename') &&
    !core.getInput('markdown') &&
    core.setFailed('Markdown string or markdown file are missing, exiting')
}

const findExisting = async () => {
  const basicauth = core.getInput('basicauth')
    ? core.getInput('basicauth')
    : Buffer.from(
        `${core.getInput('cnfluser')}:${core.getInput('apikey')}`
      ).toString('base64')
  const res = await fetch(
    `${core.getInput('cnflurl')}/wiki/rest/api/content?title=${core.getInput(
      'title'
    )}spaceKey=${core.getInput('spacekey')}`,
    {
      headers: {
        Authorization: `Basic ${basicauth}`
      }
    }
  )
  console.log(res);
  
  const data = await res.json()
  console.log(data)
}

checkInputs()
let content = convertFn()
findExisting()
publishContent(content)
