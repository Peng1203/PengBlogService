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

export class GetCategoryListDTO extends TableListDTO {}

// 添加Category
export class AddCategoryDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly categoryName: string

  @IsString()
  @IsOptional()
  readonly categoryDesc: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}

// 更新Category
export class UpdateCategoryDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly categoryName: string

  @IsString()
  @IsOptional()
  readonly categoryDesc: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}
