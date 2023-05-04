import axios from 'axios'
import { parseJSONP } from '../utils/parseJSONP'

// 使用百度API解析 IP信息
const API = 'https://sp1.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php'

/**
 * 同IP解析出IP相关信息
 * @author Peng
 * @date 2023-05-04
 * @param {any} ip:string
 * @returns {any}
 */
export async function getParseIPInfo(ip: string) {
  try {
    const params = {
      query: ip,
      // query: '14.18.158.130',
      co: '',
      resource_id: '5809',
      t: '1678328614640',
      ie: 'utf8',
      oe: 'gbk',
      cb: 'jQuery110207708242675939923_1678328583421',
      format: 'json',
      tn: 'baidu',
      _: '1678328583440',
    }
    const { data: res } = await axios.get(API, { params })
    const data = parseJSONP(res)
    console.log('data -----', data)
    return data
  } catch (e) {
    console.log(e)
    return false
  }
}
