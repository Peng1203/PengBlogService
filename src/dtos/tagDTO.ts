import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
import { TableListDTO } from './common/tableListDTO'
import { DATE_TIME_REGEX } from '../helpers/regex'

export class GetTagListDTO extends TableListDTO {}

// 添加Tag
export class AddTagDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly tagName: string

  @IsString()
  @IsOptional()
  readonly tagIcon: string

  @IsString()
  @IsOptional()
  readonly tagDesc: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}

// 更新Tag
export class UpdateTagDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly tagName: string

  @IsString()
  @IsOptional()
  readonly tagIcon: string

  @IsString()
  @IsOptional()
  readonly tagDesc: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}
