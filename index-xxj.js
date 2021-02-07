// const http = require("http");
const http = require("https");
const fs = require("fs");
const path = require("path")
const cheerio = require("cheerio");
const srcToImg = require("./utils/srcToImg");

let url = "https://www.emu999.com/ol77449311/";

function filterData(data) {
    let $ = cheerio.load(data); //将请求到的内容转换为类DOM
    $("img").each(async (index, item) => {
        let url = $(item).attr("data-original");
        //if (/^http/.test(url)) {
        if (url) {
            await srcToImg(url, path.resolve(__dirname, "img"));
            console.log(url);
        }
        console.log('自己处理')
    });

    $("a").each((index, item) => {
        let url = $(item).attr("href");
        console.log("https://www.emu999.com"+url)
    });
    
    $("div.title").each((index, item) => {
        let text = $(item).html();
        console.log(text)
    });
}

// exports.geturl = function (url, htmlPath) {
    // let htmlPath = htmlPath || "/index.html";
    // console.log(htmlPath)
    http.get(url, (res) => {
        // 安全判断
        const { statusCode } = res; //获取状态码
        const contentType = res.headers["content-type"]; //获取文件类型
        console.log(contentType);
        console.log(statusCode);

        let err = null;
        if (statusCode !== 200) {
            err = new Error("请求状态错误");
        } else if (!/^text\/html/.test(contentType)) {
            err = new Error("文件类型错误");
        }

        if (err) {
            res.resume(); //重置缓存
            throw err;
            return false;
        }

        // 数据处理
        let linkdata = "";
        res.on("data", (chunk) => {
            // 数据分段,只要接收数据就会触发data，chunk是每次接收数据的片段,数据流
            linkdata += chunk;
            console.log("接收数据");
        });

        //数据传输完毕
        res.on("end", (chunk) => {
            fs.writeFileSync(__dirname + '/index.html', linkdata);
            console.log("接收数据结束");
            filterData(linkdata);
        });
    }).on("error", (err) => {
        console.log("请求错误");
    });
// };

/**
 * 有写网站把说有页面以静态形式写到页面上,有利于爬虫，对SEO优化友好
 */
