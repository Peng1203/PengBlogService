import { TableListDTO } from './common/tableListDTO'
import { DATE_TIME_REGEX } from '../helpers/regex'
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

export class GetAuthPermissionListDTO extends TableListDTO {}

// 添加操作权限标识
export class AddAuthPermissionDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly permissionName: string

  @IsString()
  @MinLength(2)
  @IsDefined()
  @IsNotEmpty()
  readonly permissionCode: string

  @IsString()
  @IsOptional()
  readonly desc: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}

// 添加操作权限标识
export class UpdateAuthPermissionDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly permissionName: string

  @IsString()
  @MinLength(2)
  @IsDefined()
  @IsNotEmpty()
  readonly permissionCode: string

  @IsString()
  @IsOptional()
  readonly desc: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}
