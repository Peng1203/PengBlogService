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
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateIf,
  IsNumberString,
} from 'class-validator'

export class TestDTO {
  // @ValidateIf((_, value) => value !== '')
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为字符串' })
  @MinLength(2, { message: '用户名不能少于 2 位字符' }) // 最小值限制
  @MaxLength(6, { message: '用户名不能大于 6 位字符' }) // 最大值限制
  username: string

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须为字符串' })
  @MinLength(6, { message: '密码长度不能少于 6 位字符' }) // 最小值限制
  @MaxLength(15, { message: '密码长度度不能大 15 位字符' }) // 最大值限制
  password: string

  @IsInt({ message: 'age必须为整数' }) // 判断是否为整数类型
  // @IsString({ message: 'age必须为整数字符串或整数' }) // 判断是否为字符串类型
  @IsNumber({}, { message: 'age必须为整数' }) // 判断是否为字符串类型
  @Min(0, { message: 'age不能小于0' }) // 最小值限制
  @Max(120, { message: 'age不能大于120' }) // 最大值限制
  age: number | string
}
