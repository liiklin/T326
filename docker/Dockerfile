#FROM daocloud.io/library/node:6.2.1
FROM index.alauda.cn/fhunter/ttf-xfonts
#安装nodejs
RUN apt-get install -y \
	python-software-properties \
	software-properties-common \
	wget \
	git \
	libfontconfig1
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y \
	nodejs
RUN npm install -g n --registry=https://registry.npm.taobao.org
RUN n 6.2.1
#创建目录
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
#安装最新版本pm2模块
RUN cnpm install pm2@latest -g
# RUN cnpm i -g pageres-cli
#安装依赖
RUN PHANTOMJS_CDNURL=https://npm.taobao.org/dist/phantomjs npm install -g phantomjs --registry=https://registry.npm.taobao.org --no-proxy
RUN cnpm install --verbose
#复制工程
COPY . /usr/src/app
#设置环境
# ENV PORT 9999
# EXPOSE 9999
#线上环境
RUN npm run compile
ENTRYPOINT pm2 start www/production.js --name 'T326_web' --no-daemon
# ENTRYPOINT node www/production.js
