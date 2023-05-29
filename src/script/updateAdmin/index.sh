#!/bin/bash
# cd /www/wwwroot/PengBlogAdmin
echo '开始拉取代码'
git pull
echo '开始安装依赖'
pnpm i
echo '开始打包'
pnpm run build