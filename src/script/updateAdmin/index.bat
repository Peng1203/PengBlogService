chcp 65001
@echo off
cd E:\qd\workspace\github\PengBlogAdmin
echo 开始拉取代码...
git pull
echo 开始安装依赖...
call pnpm install
echo 开始打包...
call pnpm run build