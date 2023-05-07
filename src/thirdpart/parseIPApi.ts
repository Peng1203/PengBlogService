import axios from 'axios'
import { parseJSONP } from '../utils/parseJSONP'

// 使用百度API解析 IP信息
const API1 = 'https://sp1.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php'

/**
 * 同IP解析出IP相关信息
 * @author Peng
 * @date 2023-05-04
 * @param {any} ip:string
 * @returns {any}
 */
export async function getParseIPInfo(ip: string): Promise<any> {
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
    const { data: res } = await axios.get(API1, { params })
    return parseJSONP(res)
  } catch (e) {
    console.log(e)
    return null
  }
}

const API2 = 'https://qifu-api.baidubce.com/ip/geo/v1/district'
/**
 * 解析IP并获取更详细信息
 * @author Peng
 * @date 2023-05-06
 * @param {any} ip
 * @returns {any}
 */
export async function getIPDetailInfo(ip): Promise<any> {
  try {
    const { data: res } = await axios({
      url: API2,
      method: 'get',
      params: { ip },
    })
    return res
  } catch (e) {
    console.log(e)
    return null
  }
}
