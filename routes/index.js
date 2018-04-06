const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const path = require('path');

const ctrlIndex = require('../controllers');
const ctrlAdmin = require('../controllers/admin');
const ctrlLogin = require('../controllers/login');

const isAdmin = (ctx, next) => {
  if (ctx.session.isAdmin) return next();
  ctx.redirect('/login');
};

/*----    ROOT ------*/
router.get('/', ctrlIndex.showPageIndex);
router.post('/', ctrlIndex.sendEmail);

/*----    PAGE ADMIN  ------*/
router.get('/admin', /*isAdmin,*/ ctrlAdmin.showPageAdmin);
router.post('/admin/skills', ctrlAdmin.addStatistics);
router.post('/admin/upload',
    koaBody({multipart: true, formidable: {uploadDir: path.join('./public', 'upload')}}),
    ctrlAdmin.addProduct
);


/*----    LOGIN PAGE  ------*/
router.get('/login', ctrlLogin.showPageLogin);
router.post('/login', ctrlLogin.logIn);


module.exports = router;
