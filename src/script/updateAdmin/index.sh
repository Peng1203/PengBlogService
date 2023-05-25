#!/bin/bash
cd /www/wwwroot/PengBlogAdmin
git pull
pnpm i
pnpm run build