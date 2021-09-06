const koa = require('koa')
const koaStatic = require('koa-static')
const path = require('path')
const app = new koa()
console.log(path.join(__dirname, '/public/'));
app.use(koaStatic(path.join(__dirname, '/public')))
app.listen(8002, () => {
    console.log('端开启成功', 8002);
})