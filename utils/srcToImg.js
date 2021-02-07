const { createWriteStream, writeFile } = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs");

module.exports = async (src, dir) => {
    if (/.(jpg|png|gif)$/.test(src)) {
        await urlToImg(src, dir);
    } else {
        //base64图片
        await base64ToImg(src, dir);
    }
};

const urlToImg = async (url, dir) => {
    let mod = /^https:/.test(url) ? https : http; //用https获取https开头的资源
    //设置名称
    console.log(url)
    let ext = path.extname(url);
    let fileName = path.parse(url).name
    let file = path.join(dir, `${fileName}${ext}`);
    console.log(file);

    mod.get(url, (res) => {
        res.pipe(createWriteStream(file)).on("finish", () => {
            console.log("写入成功");
        });
    });
};
const base64ToImg = async (str, dir) => {
    //data:image/jpeg;base64,/资源内容
    //base64 字符串分组,1.原字符串、2.图片格式、3.逗号后面的图片资源
    let matchs = str.match(/^data:(.+);base64,(.+)$/);
    try {
        let ext = matchs[1].split("/")[1].replace("jpeg", "jpg");
        let file = path.join(dir, `bs64-${Math.random()}.${ext}`);

        await fs.writeFileSync(file, matchs[2], "base64");
    } catch (error) {
        console.log("图片保存错误");
    }
};
