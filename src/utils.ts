import {getInput, setFailed, info} from '@actions/core'
import {readFileSync} from 'fs'
import {Converter} from 'showdown'

export const isCloud = (url: string): string => {
  const suffix = url.split('.').slice(-2).join('.')
  return suffix === 'atlassian.net/' || suffix === 'atlassian.net' ? 'wiki' : ''
}

export const handleAuth = () => {
  return getInput('basicauth')
    ? getInput('basicauth')
    : Buffer.from(`${getInput('cnfluser')}:${getInput('apikey')}`).toString(
        'base64'
      )
}

export const checkInputs = () => {
  if (!getInput('spacekey')) {
    setFailed('Confluence space key is missing, exiting')
    process.exit()
  }
  if (!getInput('cnflurl')) {
    setFailed('Confluence URL is missing, exiting')
    process.exit()
  }
  if (!getInput('apikey') || !getInput('cnfluser')) {
    setFailed(
      'Confluence authentication is incomplete, exiting, provide username and password or base64 encoded basic credentials'
    )
    process.exit()
  }
  if (!getInput('title')) {
    setFailed('Page title is missing, exiting')
    process.exit()
  }
  if (!getInput('filename') || !getInput('markdown')) {
    setFailed('Markdown string or markdown file are missing, exiting')
    process.exit()
  }
}

const convert2html = (text: string): string => {
  let converter = new Converter()
  return converter.makeHtml(text)
}
export const convertFn = () => {
  try {
    if (getInput('markdown')) {
      info('using string as input')
      let content = getInput('markdown')
      return convert2html(content)
    }
    if (getInput('filename')) {
      info(`Using file ${getInput('filename')} as input`)
      let filename = getInput('filename')
      return convert2html(readFileSync(filename).toString())
    }
  } catch (e: any) {
    setFailed(e.message)
  }
}
