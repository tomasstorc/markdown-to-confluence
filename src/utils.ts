import * as core from '@actions/core'

export const isCloud = (url: string): boolean => {
  const suffix = url.slice(-2)
  return suffix === 'atlassian.net' ? true : false
}

export const handleAuth = () => {
  return core.getInput('basicauth')
    ? core.getInput('basicauth')
    : Buffer.from(
        `${core.getInput('cnfluser')}:${core.getInput('apikey')}`
      ).toString('base64')
}

export const handleVersion = async (id: string) => {
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
