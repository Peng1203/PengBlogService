import {
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class TableListDTO {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  page: number

  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  pageSize: number

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
