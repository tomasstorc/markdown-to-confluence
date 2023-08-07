import {getInput, info, setFailed} from '@actions/core'
import {handleAuth, isCloud} from './utils'
import fetch from 'node-fetch'

export const URL = `${getInput('cnflurl')}${isCloud(
  getInput('cnflurl')
)}/rest/api/content`

export const publishContent = (content: string | undefined) => {
  const basicauth = handleAuth()
  const payload = {
    type: 'page',
    title: getInput('title'),
    space: {key: getInput('spacekey')},
    body: {
      storage: {
        value: content,
        representation: 'storage'
      }
    }
  }
  fetch(URL, {
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
      info('Successfully published new page')
    })
}

export const updateContent = async (
  content: string | undefined,
  id: string
) => {
  const basicauth = handleAuth()
  const newVersion = await handleVersion(id)
  const payload = {
    id,
    type: 'page',
    title: getInput('title'),
    space: {key: getInput('spacekey')},
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
  fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${basicauth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((res: any) => {
      if (res.status === 409) {
        setFailed('This version already exists, exiting')
        process.exit()
      }
      return res
    })
    .then(() => {
      info(
        `Successfuly updated page with id ${id}, new version is ${newVersion}`
      )
    })
}

export const findExisting = async () => {
  const basicauth = handleAuth()
  const res = await fetch(
    `${URL}?spaceKey=${getInput('spacekey')}&title=${getInput('title')}`,
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
  const res = await fetch(`${URL}/${id}`, {
    headers: {
      Authorization: `Basic ${basicauth}`
    }
  })
  const data: any = await res.json()
  return +data.version.number + 1
}
