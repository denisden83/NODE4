const { ModelLogIn } = require('../models');

module.exports.showPageLogin = async (ctx, next) => {
    if (ctx.session.isAdmin) return ctx.redirect('/admin');
    ctx.render('./pages/login', { msglogin: ctx.flash('msglogin') });
};

module.exports.logIn = async (ctx, next) => {
    if (ctx.session.isAdmin) return ctx.redirect('/admin');
    let email = ctx.request.body.email;
    let password = +ctx.request.body.password;
    if (email === ''){
        ctx.flash('msglogin', 'Insert email. Default email admin@admin');
        ctx.redirect('/login');
        return;
    }
    if (!/@/.test(email)){
        ctx.flash('msglogin', 'Email is not valid');
        ctx.redirect('/login');
        return;
    }

    try {
        let { rows: [admin] } = await ModelLogIn.checkIfAdmin(email);
        if (!admin) {
            console.log('I am here');
            ctx.flash('msglogin', 'There\'s no such user. Default email admin@admin');
            ctx.redirect('/login');
            return;
        }
        if (admin.password !== password) {
            ctx.flash('msglogin', 'Wrong password. Default psw 1234');
            ctx.redirect('/login');
            return;
        }
        if (admin.password === password) {
            ctx.session.isAdmin = true;
            ctx.redirect(`/admin`);
            return;
        }
        ctx.redirect(`/login`);
    } catch(err) {
        next(err);
    }
};