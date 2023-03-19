import { Request, Response, NextFunction } from 'express'

/**
 * 数字字符串转换为Number
 * Express 中接收到的请求体（req.body）是经过解析的 JSON 对象或表单数据。在解析时，如果属性值是数值类型，它们将被解析为字符串类型。这是因为 HTTP 协议中传输的数据都是字符串类型的，Express 在解析时也是默认将数值类型转换为字符串类型
 * @author Peng
 * @date 2023-02-26
 * @param {any} req:Request
 * @param {any} res:Response
 * @param {any} next:NextFunction
 * @returns {void}
 */

// 处理类型
function handleParamsType(obj: Object, convertProps: Array<string>): void {
  for (const key in obj) {
    convertProps.includes(key) && (obj[key] = Number(obj[key]))
  }
}

function convertNumber(req: Request, res: Response, next: NextFunction): void {
  // 需要转换为数值类型的属性名称列表
  const convertProps: string[] = ['id', 'age', 'count', 'page', 'pageSize']
  const { query, body } = req

  // console.log('body前', JSON.parse(JSON.stringify(body)))
  if (Object.keys(query)) handleParamsType(query, convertProps)
  if (Object.keys(body)) handleParamsType(body, convertProps)
  // console.log('body后', JSON.parse(JSON.stringify(body)))

  next()
}

export default convertNumber
