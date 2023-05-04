/**
 * 解析JSONP格式数据 并转换为JSON格式
 * @author Peng
 * @date 2023-05-04
 * @param {any} jsonpString
 * @returns {any}
 */
export function parseJSONP(jsonpString) {
  const regex = /^.*\((.*)\)$/gm
  const match = regex.exec(jsonpString)
  if (match) return JSON.parse(match[1])
  return null
}
