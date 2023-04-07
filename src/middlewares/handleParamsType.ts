import { Request, Response, NextFunction } from 'express'
import { JSON_REGEX } from '../helpers/regex'

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
    //
    // 处理指定字段 暂时不用 如果密码全为数组的情况 则会被转换
    // if (Number(obj[key])) obj[key] = Number(obj[key])
    if (convertProps.includes(key)) obj[key] = Number(obj[key])
    // 判断当前数组是否是JSON字符串 为JSON字符串时则 转化为原本数据类型
    else if (JSON_REGEX.test(obj[key])) obj[key] = JSON.parse(obj[key])
  }
}

function handleParseRequestParams(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 需要转换为数值类型的属性名称列表
  const convertProps: string[] = [
    'id',
    'roleId',
    'age',
    'count',
    'page',
    'pageSize',
    'parentId',
  ]
  const { query, body, params } = req

  // console.log('body前', JSON.parse(JSON.stringify(body)))
  if (Object.keys(query).length) handleParamsType(query, convertProps)
  if (Object.keys(body).length) handleParamsType(body, convertProps)
  if (Object.keys(params).length) handleParamsType(params, convertProps)
  // console.log('body后', JSON.parse(JSON.stringify(body)))

  next()
}

export default handleParseRequestParams
