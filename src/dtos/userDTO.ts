import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

import { UUID_REGEX } from '../helpers/regex'

// 用户登录
export class UserLoginDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(6)
  readonly userName: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  readonly password: string

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  readonly captcha: string

  @IsNotEmpty()
  @Matches(UUID_REGEX, { message: 'uuid 参数格式有误!' })
  @IsString()
  @MinLength(36)
  @MaxLength(36)
  readonly uuid: string
}
