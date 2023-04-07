import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { TableListDTO } from './common/tableListDTO'
import { DATE_TIME_REGEX, PATH_REGEX } from '../helpers/regex'

// 获取菜单列表
export class GetMenusListDTO extends TableListDTO {}

// 添加菜单
export class AddMenuDTO {
  @IsString()
  @MinLength(1)
  // @MaxLength(10)
  @IsDefined()
  @IsNotEmpty()
  readonly menuName: string

  @IsString()
  @MinLength(1)
  @IsDefined()
  @IsNotEmpty()
  @Matches(PATH_REGEX)
  readonly menuPath: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly menuURI: string

  @IsString()
  @IsOptional()
  readonly menuIcon: string

  @Min(0)
  @IsInt()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  // @IsOptional()
  readonly parentId: number

  @IsArray()
  @ArrayMinSize(0)
  @IsDefined()
  @IsNotEmpty()
  readonly roles: Array<number>

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}
