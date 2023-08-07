import {checkInputs, convertFn} from './utils'
import {publishContent, updateContent, findExisting} from './api'

const main = async () => {
  checkInputs()
  const content = convertFn()
  const id = await findExisting()
  id ? updateContent(content, id) : publishContent(content)
}

main()
