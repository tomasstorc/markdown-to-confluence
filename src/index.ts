import {checkInputs, convertFn} from './utils'
import {publishContent, updateContent, findExisting, URL} from './api'

const main = async () => {
  console.log(`URL IS ${URL}`)

  checkInputs()
  const content = convertFn()
  const id = await findExisting()
  id ? updateContent(content, id) : publishContent(content)
}

main()
