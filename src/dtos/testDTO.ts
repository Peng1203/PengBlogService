import { Transform } from 'class-transformer'
import {
  validate, // 校验
  validateOrReject, // 校验 不通过时抛出错误
  Contains, // 用于验证一个字符串是否包含指定的字符串
  IsInt, // 用于验证一个数字是否为整数
  Length, // 用于验证一个字符串的长度是否在指定范围内
  IsEmail, // 用于验证一个字符串是否为Email地址
  IsFQDN, // 用于验证一个字符串是否为完全限定域名
  IsDate, // 用于验证一个字符串是否为日期格式
  Min, // 数字最小值
  Max, // 数字最大值
  MinLength, // 最小长度
  MaxLength, // 最大长度
  IsNotEmpty, // 参数不能为空
  IsString, // 是否是字符串
  IsNumber, // 是否是数字
  ValidateIf, // 用于根据条件决定是否进行校验
  IsNumberString, // 用于验证一个字符串是否为数字字符串
  IsOptional, // 允许参数为空
  IsObject, // 是否是对象
  IsDateString, // 用于验证一个字符串是否为日期字符串
  Matches, // 正则校验
  IsISO8601, // 用于验证一个字符串是否为ISO8601日期数据
  IsIn, // 用于限制一个参数的取值范围
  isNumber, // 判断是否为数字
  isInt, // 限制实参范围
} from 'class-validator'

// 查询测试数据参数DTO
export class GetTestListDTO {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsOptional()
  // @IsNotEmpty()
  readonly page: number

  @Min(1)
  // @Max(500)
  @IsInt()
  @IsNumber()
  @IsOptional()
  // @IsNotEmpty()
  readonly pageSize: number

  @IsString()
  @IsOptional()
  readonly queryStr: string

  @IsString()
  @IsOptional()
  readonly column: string

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC', ''])
  readonly order: 'ASC' | 'DESC' | '' = ''
}

// 创建测试数据参数DTO
export class PostTestDTO {
  // @ValidateIf((_, value) => value !== '')
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为字符串' })
  @MinLength(2, { message: '用户名不能少于 2 位字符' }) // 最小值限制
  @MaxLength(6, { message: '用户名不能大于 6 位字符' }) // 最大值限制
  readonly userName: string

  // @IsNotEmpty({ message: '密码不能为空' })
  // @IsString({ message: '密码必须为字符串' })
  // @MinLength(6, { message: '密码长度不能少于 6 位字符' }) // 最小值限制
  // @MaxLength(15, { message: '密码长度度不能大 15 位字符' }) // 最大值限制
  // password: string

  // @IsString({ message: 'age必须为整数字符串或整数' }) // 判断是否为字符串类型
  @IsInt({ message: 'age必须为整数' }) // 判断是否为整数类型
  @IsNumber({}, { message: 'age必须为整数' }) // 判断是否为字符串类型
  @Min(0, { message: 'age不能小于0' }) // 最小值限制
  @Max(120, { message: 'age不能大于120' }) // 最大值限制
  readonly age: number | string

  @IsNotEmpty()
  data: any

  // @Transform(({ value }) => new Date(value), { toClassOnly: true })
  // @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, { message: '创建日期格式为 YYYY-MM-DD HH:mm:ss' })
  // @IsISO8601()
  // readonly createdTime: Date | string
}

// 修改测试数据DTO
export class updateTestDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(2) // 最小长度
  @MaxLength(16) // 最大长度
  readonly userName: string

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(120)
  readonly age: number

  @IsString()
  @IsOptional()
  readonly data: string | ''
}
