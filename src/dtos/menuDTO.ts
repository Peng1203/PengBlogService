import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  IsIn,
  MinLength,
} from 'class-validator'
import { DATE_TIME_REGEX, PATH_REGEX } from '../helpers/regex'

// 获取菜单列表
export class GetMenusListDTO {
  @IsString()
  // @IsOptional()
  @IsDefined()
  queryStr: string

  @IsString()
  @IsOptional()
  column: string

  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC', ''])
  order: 'ASC' | 'DESC' | '' = ''

  @IsString()
  @IsOptional()
  token?: string
}

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

  // @IsArray()
  // @ArrayMinSize(0)
  // @IsDefined()
  // @IsNotEmpty()
  // readonly roles: Array<number>

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly menuType: '1' | '2' | '3' | '4'

  // @IsString()
  @IsOptional()
  readonly menuRedirect: any

  // @IsJSON()
  @IsOptional()
  readonly otherConfig: any

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}

export class UpdateMenuDTO {
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

  // @IsArray()
  // @ArrayMinSize(0)
  // @IsDefined()
  // @IsNotEmpty()
  // readonly roles: Array<number>

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly createdTime: string

  @IsString()
  @Matches(DATE_TIME_REGEX, { message: '日期格式有误!' })
  @IsOptional()
  readonly updateTime: string
}
