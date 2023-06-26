import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDefined,
  IsEmail,
  IsEmpty,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  Validate,
  ValidateNested,
} from 'class-validator'

import { IsArrayNumber } from './common/custom'

import { DATE_TIME_REGEX, UUID_REGEX } from '../helpers/regex'
import { TableListDTO } from './common/tableListDTO'

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

// 退出登录
export class UserLogoutDTO {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(6)
  readonly userName: string

  // @IsNotEmpty()
  // @IsString()
  // readonly token: string
}

// 获取用户列表
export class GetUserListDTO extends TableListDTO {
  @Min(0)
  @IsNumber()
  readonly roleId: number
}

// 批量删除ID数组
export class DeleteUsersDTO {
  @IsArray()
  @IsNotEmpty()
  @Validate(IsArrayNumber) // 自定义校验
  readonly ids: number[]
}

// 添加用户
export class AddUserDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(6)
  @IsDefined()
  @IsNotEmpty()
  readonly userName: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string

  @IsInt()
  @IsNumber()
  @Min(1)
  // @Max(99)
  @IsDefined()
  @IsNotEmpty()
  readonly roleId: number

  @IsOptional()
  // @IsEmpty()
  @IsString()
  @ValidateIf(o => o.email !== '')
  @IsEmail()
  readonly email: string

  @IsInt()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  readonly state: number

  // @IsOptional()
  // avatar: Buffer
}

// 更新用户信息
export class UpdateUserDTO {
  // @Min(1)
  // @IsInt()
  // @IsNumber()
  // @IsNotEmpty()
  // readonly id: number

  @IsString()
  @MinLength(2)
  // @MaxLength(6)
  @IsOptional()
  readonly userName: string

  @Min(1)
  @IsInt()
  @IsNumber()
  @IsOptional()
  readonly roleId: number

  @IsString()
  @MinLength(10)
  @IsEmail()
  @IsOptional()
  readonly email: string

  @Min(0)
  @Max(1)
  @IsInt()
  @IsNumber()
  @IsOptional()
  readonly state: number

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly unsealTime: string
}

// 上传头像
export class UploadUserAvatarDTO {}

// 修改密码
export class ChangePwdDTO {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number

  @IsString()
  @MinLength(2)
  @MaxLength(6)
  @IsNotEmpty()
  readonly userName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly oldPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly newPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly confirmNewPassword: string
}
