import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
import { TableListDTO } from './common/tableListDTO'
import { DATE_TIME_REGEX } from '../helpers/regex'

// 获取角色列表
export class GetRoleListDTO extends TableListDTO {}

// 添加角色
export class AddRoleDTO {
  @IsString()
  @MinLength(2)
  // @MaxLength(10)
  @IsDefined()
  @IsNotEmpty()
  readonly roleName: string

  @IsString()
  @MaxLength(20)
  @IsOptional()
  readonly roleDesc: string

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsDefined()
  readonly menus: number[]

  @IsArray()
  @ArrayMinSize(0)
  @IsInt({ each: true })
  @IsDefined()
  readonly operationPermissions: number[]

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}

// 更新角色信息
export class UpdateRoelInfoDTO {
  @IsString()
  @MinLength(2)
  // @MaxLength(10)
  @IsDefined()
  @IsNotEmpty()
  readonly roleName: string

  @IsString()
  @MaxLength(20)
  // @IsOptional()
  readonly roleDesc: string

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsDefined()
  readonly menus: number[]

  @IsArray()
  @ArrayMinSize(0)
  @IsInt({ each: true })
  @IsDefined()
  readonly operationPermissions: number[]

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}
