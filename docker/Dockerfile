#FROM daocloud.io/library/node:6.2.1
FROM index.alauda.cn/fhunter/ttf-xfonts
#添加nodejs
RUN rm -v /etc/apt/sources.list
RUN echo "deb http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse" >> /etc/apt/sources.list
RUN apt-get -y update 
RUN apt-get -y install nodejs
#创建目录
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
#安装最新版本pm2模块
RUN cnpm install pm2@latest -g
#安装phantomjs依赖
RUN cnpm install phantomjs@1.9.16 html-pdf-wth-rendering@1.2.2
#安装依赖
RUN cnpm install
#复制工程
COPY . /usr/src/app
#设置环境
ENV PORT 9999
EXPOSE 9999
#线上环境
RUN npm run compile
ENTRYPOINT pm2 start www/production.js --name 'T326_web' --no-daemon
#ENTRYPOINT node www/production.js
