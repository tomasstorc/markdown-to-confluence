import * as core from '@actions/core'
import {isCloud, handleAuth} from './utils'

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
  const basicauth = handleAuth()
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
  fetch(
    `${core.getInput('cnflurl')}${
      isCloud(core.getInput('cnflurl')) && '/wiki'
    }/rest/api/content`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicauth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )
    .then((res: any) => {
      return res
    })
    .then(() => {
      console.log('successfully published')
    })
}

const updateContent = async (content: string | undefined, id: string) => {
  const basicauth = handleAuth()
  const newVersion = await handleVersion(id)
  const payload = {
    id,
    type: 'page',
    title: core.getInput('title'),
    space: {key: core.getInput('spacekey')},
    body: {
      storage: {
        value: content,
        representation: 'storage'
      }
    },
    version: {
      number: newVersion
    }
  }
  fetch(`${core.getInput('cnflurl')}/wiki/rest/api/content/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${basicauth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((res: any) => {
      if (res.status === 409)
        return core.setFailed('this version already exists')
      return res
    })
    .then(() => {
      console.log('successfully updated')
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
  const basicauth = handleAuth()
  const res = await fetch(
    `${core.getInput('cnflurl')}/wiki/rest/api/content?spaceKey=${core.getInput(
      'spacekey'
    )}&title=${core.getInput('title')}`,
    {
      headers: {
        Authorization: `Basic ${basicauth}`
      }
    }
  )
  const data: any = await res.json()
  return data.results[0]?.id ? data.results[0].id : ''
}

const handleVersion = async (id: string) => {
  const basicauth = handleAuth()
  const res = await fetch(
    `${core.getInput('cnflurl')}/wiki/rest/api/content/${id}`,
    {
      headers: {
        Authorization: `Basic ${basicauth}`
      }
    }
  )
  const data: any = await res.json()
  return +data.version.number + 1
}

const main = async () => {
  checkInputs()
  const content = convertFn()
  const id = await findExisting()
  id ? updateContent(content, id) : publishContent(content)
}

main()
