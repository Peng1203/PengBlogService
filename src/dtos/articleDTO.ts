import {
  IsArray,
  IsDefined,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
import { TableListDTO } from './common/tableListDTO'
import { DATE_TIME_REGEX } from '../helpers/regex'

export class GetArticleListDTO extends TableListDTO {
  @IsNotEmpty()
  readonly authorIds: number[]

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  // 分类ID 查询全部传 0
  readonly cId: number

  @IsInt()
  @IsNumber()
  @IsOptional()
  // 按照标签查询包含指定标签的文章 查询全部传 0
  readonly tagId: number

  @IsString()
  @IsOptional()
  readonly startTime: string

  @IsString()
  @IsOptional()
  readonly endTime: string
}

// 添加文章
export class AddArticleDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly title: string

  @IsString()
  @IsOptional()
  readonly brief: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly content: string

  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  readonly authorId: number

  @IsString()
  @IsOptional()
  readonly cover: string

  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  readonly categoryId: number

  // @IsJSON()
  @IsArray()
  @IsOptional()
  readonly tags: number[]

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}

// 更新Article
export class UpdateArticleDTO {
  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  readonly title: string

  @IsString()
  @IsOptional()
  readonly brief: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly content: string

  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  readonly authorId: number

  @IsString()
  @IsOptional()
  readonly cover: string

  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  readonly categoryId: number

  // @IsJSON()
  @IsArray()
  @IsOptional()
  readonly tags: number[]

  @IsInt()
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
}
