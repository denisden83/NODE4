const Koa = require('koa');
const path = require('path');
const Pug = require('koa-pug');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const session = require('koa-session2');
const flash = require('koa-better-flash');
const serve = require('koa-static');
const router = require('./routes');
const config = require('./config');

const app = module.exports = new Koa();
const pug = new Pug({
   viewPath: './views',
   basedir: './public',
   app: app
});

app.use(logger());
app.use(koaBody());
app.use(session());
app.use(flash());

app.use(router.routes());

app.use(serve(path.join(__dirname, 'public')));
// app.use(serve('./public'));

if (!module.parent) app.listen(config.get('port'), () => {
    console.log(`server running on port ${config.get('port')}`);
});