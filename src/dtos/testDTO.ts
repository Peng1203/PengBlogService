import { Transform } from 'class-transformer'
import {
  validate, // 校验
  validateOrReject, // 校验 不通过时抛出错误
  Contains, // 用于验证一个字符串是否包含指定的字符串
  IsInt, // 用于验证一个数字是否为整数
  Length, // 用于验证一个字符串的长度是否在指定范围内
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsNotEmpty, // 参数不能为空
  IsString,
  IsNumber,
  ValidateIf,
  IsNumberString,
  IsOptional, // 允许参数为空
  IsObject,
  IsDateString,
  Matches,
  IsISO8601,
  IsIn, // 限制实参范围
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
