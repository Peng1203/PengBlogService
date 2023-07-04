import { nanoid } from 'nanoid/async'
import { extname } from 'path'

export async function generateFileName(fileFullName): Promise<string> {
  try {
    const extension = extname(fileFullName)
    const fileName = await nanoid(15)
    return `${fileName}${extension}`
  } catch (e) {
    console.log(e)
  }
}
