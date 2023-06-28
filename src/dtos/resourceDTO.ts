import { IsIn, IsNotEmpty, IsString } from 'class-validator'

// 获取指定目录文件
export class GetDirectoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly path: string
}

// 删除文件或文件夹
export class RemoveFileOrDirDTO {
  @IsString()
  @IsNotEmpty()
  @IsIn(['file', 'dir'])
  readonly type: 'file' | 'dir'

  @IsString()
  @IsNotEmpty()
  readonly path: string
}
