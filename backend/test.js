const enc = require("iconv-lite");
const test = require("nntp-fast");
const express = require('express');
const { response } = require("express");
let groupNNTP = '';
let currentArticle = 0;

async function createConnection() {

    const options = {
        host: 'news.neostrada.pl',
        port: 119
    };
    const conn = new test.NntpConnection();

    await conn.connect(options);

    return conn
}

let conn = null

createConnection().then(value => {
    conn = value
});


async function pickGroup(group) {
    try {
        await conn.listgroup(group);
        groupNNTP = group;
    } catch (error) {
        console.log(error);
    }
}

async function getGroups() {

    const date = new Date(2000, 1, 1);
    const regex = /\s\d*\s\d*\s(?:y+|m+)(\r)*(\n)*/gm;
    const groups = await conn.newsgroups(date)
    const formatedGroups = enc.decode(groups.data, 'iso-8859-2');
    const result = formatedGroups.replace(regex, ' ').split(' ').filter(item => item.startsWith('pl.'));
    return result
}

async function getArticlesFromGroup(group) {

    const response = await conn.listgroup(group)
    return response.articles;
}

async function getArticleTitle(group, number) {

    await conn.listgroup(group)
    const response = await conn.head(number)
    const formatedResponse = response.headers
    return formatedResponse;
}

async function getArticle(id) {
    // get date from server 
    console.log(await conn.date());

    // switch to group pl.answers
    if (groupNNTP) {
        const group = await conn.group(groupNNTP);
    }
    else{
        const group = await conn.group("pl.news.czytniki");
    }
    const regex = /\w*\/*\w*;\s*(charset=")*/gm;
    const response = await conn.head(id)
    contentType = response.headers['Content-Type']
    console.log(contentType)
    let result = contentType.replace(regex, '')
    result = result.slice(0, -1)
    console.log(result);
    let charset;
    if (result.slice(0, 5) == 'utf-8' || result.slice(0, 5) == 'utf8') {
        charset = 'utf-8'
    }
    else {
        charset = 'iso-8859-2'
    }

    // get article
    const article = await conn.article(id);
    const resultBuffer = enc.decode(article.body, charset)

    return resultBuffer;
}

async function nextArticle() {
    const res = await conn.runCommand("NEXT");
        if ([223/*, 412, 420, 422*/].includes(res.code)) {
            const m = /^([0-9]+) (<[^ ]+>)/.exec(res.message);
            if (m == null) {
                throw "cant parse " + util.inspect(res.message);
            }
            return {
                code: res.code,
                articleNumber: parseInt(m[1]),
                articleId: m[2]
            };
        } else {
            throw res;
        }
}

async function lastArticle() {
    const res = await conn.runCommand("LAST");
    if ([223/*, 412, 420, 422*/].includes(res.code)) {
        const m = /^([0-9]+) (<[^ ]+>)/.exec(res.message);
        if (m == null) {
            throw "cant parse " + util.inspect(res.message);
        }
        return {
            code: res.code,
            articleNumber: parseInt(m[1]),
            articleId: m[2]
        };
    } else {
        throw res;
    }
}

//express server
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on ${port}`));

app.get('/article/last', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const number = await lastArticle();
    res.send(await getArticle(number.articleNumber));
})
app.get('/article/next', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const number = await nextArticle();
    res.send(await getArticle(number.articleNumber));
})

app.get('/article/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(await getArticle(req.params.id));
})
app.get('/groups', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await getGroups()));
})
app.get('/articles', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (groupNNTP) {
        res.end(JSON.stringify(await getArticlesFromGroup(groupNNTP)));
    }
    else{
        res.end(JSON.stringify(await getArticlesFromGroup("pl.news.czytniki")));
    }
})
app.get('/title/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (groupNNTP != '') {
        res.send(await getArticleTitle(groupNNTP, req.params.id));
    }
    else{
        res.send(await getArticleTitle("pl.news.czytniki", req.params.id));
    }
})
app.get('/group/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(await pickGroup(req.params.id));
})



// const http = require('http');
// const port = process.env.PORT || 3000

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf8' })
//     res.end(resultBuffer)
// })

// server.listen(port, () => console.log(`serwer został uruchomiony na porcie ${port}; ` + 'naciśnij Ctrl-C, aby zakończyć...'))
