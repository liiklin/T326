'use strict';

import Base from "./base.js";
import fs from "fs";
import querystring from "querystring";
import request from "request";
import _ from "underscore";
import zip from "node-native-zip";
import iconv from "iconv-lite";
import urlencode from "urlencode";
import Pageres from "pageres";

var logger = require('tracer').colorConsole();

export default class extends Base {
    async indexAction() {
        let queryWords = this.get("queryWords");
        if (!think.isEmpty(queryWords)) {
            let data = querystring.stringify({
                queryWords: queryWords
            });
            let url = `http://${this.http.host}/classes/?${data}`;
            let fn = think.promisify(request.get);
            try {
                let res = await fn({
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                this.assign({
                    title: '签到管理',
                    queryWords: queryWords,
                    datas: JSON.parse(res.body)
                });
                return this.display();
            } catch (e) {
                logger.error(e);
                return this.display();
            }
        } else {
            this.assign({
                title: '签到管理',
                queryWords: '',
                datas: []
            });
            return this.display();
        }
    }

    async studentsAction() {
        let url = `http://${this.http.host}/classes/${this.get("classid")}/`;
        let fn = think.promisify(request.get);
        try {
            let res = await fn({
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            this.assign({
                title: '签到明细',
                semester: this.get("semester"),
                datas: JSON.parse(res.body)
            });
            return this.display();
        } catch (e) {
            logger.error(e);
            this.assign({
                title: '签到明细',
                semester: this.get("semester"),
                datas: []
            });
            return this.display();
        }
    }

    //下载
    // async createdAction() {
    //     const options = {
    //         "format": "Letter",
    //         //"type": "pdf"
    //     };
    //     if (this.isGet()) {
    //         return this.fail("不允许get");
    //     }
    //     // let ids = this.get("ids"),
    //     let ids = this.post("ids"),
    //         semester = this.post("semester"),
    //         createLists = [],
    //         createRes = [];
    //
    //     // ids = ids.split(",");
    //     logger.info(ids);
    //     (async() => {
    //         //查询结果
    //         for (let id of ids) {
    //             let url = `http://${this.http.host}/classes/${id}/`,
    //                 fn = think.promisify(request.get),
    //                 res = await fn({
    //                     url: url,
    //                     headers: {
    //                         'Content-Type': 'application/x-www-form-urlencoded'
    //                     }
    //                 });
    //             this.assign({
    //                 title: '签到明细',
    //                 semester: `${semester[id]}`,
    //                 datas: JSON.parse(res.body)
    //             });
    //             let html = await this.fetch(), //渲染模版
    //                 task = new Promise((resolve, reject) => { //输出pdf
    //                     html = iconv.encode(html, "utf8"); //转换格式
    //                     pdf.create(html.toString("utf8"), options).toFile(`./output/pdf/${id}.pdf`, (err, res) => {
    //                         if (err) {
    //                             logger.error(err);
    //                             return reject(err);
    //                         }
    //                         logger.info(res);
    //                         return resolve(res);
    //                     });
    //                 });
    //             createLists.push(task);
    //         };
    //         //输出结果模板
    //         try {
    //             createRes = await Promise.all(createLists);
    //
    //             let archive = new zip(),
    //                 zipname = new Date().getTime(),
    //                 output = `./output/zip/${zipname}.zip`,
    //                 filepaths = [];
    //
    //             filepaths = _.map(createRes, res => {
    //                 let id = _.find(ids, id => {
    //                         return res.filename.indexOf(id) > -1;
    //                     }),
    //                     filename = semester[id];
    //
    //                 if (!think.isEmpty(id)) {
    //                     return { name: `${id}.pdf`, path: res.filename }
    //                 }
    //             });
    //
    //             archive.addFiles(filepaths, () => {
    //                 let buff = archive.toBuffer();
    //
    //                 fs.writeFile(output, buff, () => {
    //                     logger.info("生成zip文件完成。");
    //                     return this.json({ status: "done", filename: zipname });
    //                 });
    //             }, function(err) {
    //                 logger.info(err);
    //                 return this.fail("异常");
    //             });
    //         } catch (e) {
    //             logger.error(e);
    //             return this.fail(e);
    //         }
    //     })();
    // }

    async createdAction() {
        if (!_.isEmpty(this.post())) {
            return this.fail("只允许get");
        }
        let classid = this.get("classid"),
            semester = this.get("semester");
        let url = `http://${this.http.host}/classes/${classid}/`,
            fn = think.promisify(request.get),
            res = await fn({
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        this.assign({
            title: '签到明细',
            semester: `${semester}`,
            datas: _.isEmpty(res.body) ? {} : JSON.parse(res.body)
        });
        return this.display();
    }

    async exportpdfAction() {
        let ids = this.post("ids"),
            semesters = this.post("semester"),
            hostname = this.http.host,
            createLists = [],
            timemap = new Date().getTime(),
            createRes = [];
        // logger.info(ids);
        // logger.info(semesters);
        (async() => {
            for (let id of ids) {
                let classid = id,
                    semester = semesters[id],
                    urlencode_semester = urlencode(semester), //urlencode SpookyJS无法识别中文字符
                    format = "jpg",
                    url = `http://${hostname}/index/created/?classid=${classid}&semester=${urlencode_semester}`;

                // logger.info(url);
                think.mkdir(`./output/`);
                think.mkdir(`./output/capture/`);
                think.mkdir(`./output/capture/`);
                let task = new Promise((resolve, reject) => { //输出jpg
                    return new Pageres({
                            delay: 2,
                            format: format,
                            filename: `${classid}_${timemap}`
                        })
                        .src(url, ['1920x1080'])
                        .dest(`./output/capture/`)
                        .run()
                        .then(() => {
                            logger.info('done');
                            return resolve({
                                filename: `${classid}_${timemap}.${format}`,
                                path: `./output/capture/${classid}_${timemap}.${format}`
                            });
                        }).catch((err) => {
                            logger.info(err);
                            return reject(err);
                        });
                });
                createLists.push(task);
            }
            //输出结果模板
            try {
                logger.info("输出结果模板中...");
                createRes = await Promise.all(createLists);
                logger.info(`输出结果模板完成 结果个数:${createRes.length}`);
                let archive = new zip(),
                    zipname = new Date().getTime(),
                    output = `./output/zip/${zipname}.zip`,
                    filepaths = [];

                think.mkdir(`./output/zip/`);
                filepaths = _.map(createRes, res => {
                    return {
                        name: res.filename,
                        path: res.path
                    }
                });

                archive.addFiles(filepaths, () => {
                    let buff = archive.toBuffer();

                    fs.writeFile(output, buff, () => {
                        logger.info("生成zip文件完成。");
                        return this.json({
                            status: "done",
                            filename: zipname
                        });
                    });
                }, function(err) {
                    logger.info(err);
                    return this.fail("异常");
                });
            } catch (e) {
                logger.error(e);
                return this.fail(e);
            }
        })();
    }

    async downloadAction() {
        let filename = this.post("filename")
        logger.info(`./output/zip/${filename}.zip`);
        return this.download(`./output/zip/${filename}.zip`);
    }
}
