import {getInput, setFailed} from '@actions/core'
import {readFileSync} from 'fs'
import {Converter} from 'showdown'

export const isCloud = (url: string): boolean => {
  const suffix = url.slice(-2)
  return suffix === 'atlassian.net' ? true : false
}

export const handleAuth = () => {
  return getInput('basicauth')
    ? getInput('basicauth')
    : Buffer.from(`${getInput('cnfluser')}:${getInput('apikey')}`).toString(
        'base64'
      )
}

export const checkInputs = () => {
  !getInput('spacekey') && setFailed('Confluence space key is missing, exiting')
  !getInput('cnflurl') && setFailed('Confluence URL is missing, exiting')
  !getInput('apikey') && setFailed('Confluence API key is missing, exiting')
  !getInput('cnfluser') && setFailed('Confluence user is missing, exiting')
  !getInput('title') && setFailed('Page title is missing, exiting')
  !getInput('filename') &&
    !getInput('markdown') &&
    setFailed('Markdown string or markdown file are missing, exiting')
}

const convert2html = (text: string): string => {
  let converter = new Converter()
  return converter.makeHtml(text)
}
export const convertFn = () => {
  try {
    if (getInput('markdown')) {
      console.log('using text as input')
      let content = getInput('markdown')
      return convert2html(content)
    }
    if (getInput('filename')) {
      console.log('using file as input')
      let filename = getInput('filename')
      return convert2html(readFileSync(filename).toString())
    }
  } catch (e: any) {
    setFailed(e.message)
  }
}

export const URL = `${getInput('cnflurl')}${
  isCloud(getInput('cnflurl')) && 'wiki'
}/rest/api/content`
