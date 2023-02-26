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
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator'


export class TestDTO {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为字符串' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须为字符串' })
  password: string;

  @IsNotEmpty({ message: '年龄不能为空' })
  @IsInt({ message: 'age字段类型为 数字 或者 字符串' })
  @IsInt()
  @Min(0, { message: '年龄限制在 0~120 岁' })
  @Max(120, { message: '年龄限制在 0~120 岁' })
  age: number;
}