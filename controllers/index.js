const { ModelIndex } = require('../models');
const nodemailer = require('nodemailer');
const config = require('../config');

module.exports.showPageIndex = async (ctx, next) => {
    try {
        let query1 = ModelIndex.getStatistics;
        let query2 = ModelIndex.getProducts;
        let [{ rows: skills }, { rows: products }] = await Promise.all([query1(), query2()]);
        ctx.render('./pages/index', { skills, products, msgemail: ctx.flash('msgemail') });
    } catch(err) {
        next(err);
    }
    // try {
    //     const { rows: skills } = await ModelIndex.getStatistics();
    //     const { rows: products } = await ModelIndex.getProducts();
    //     ctx.render('./pages/index', { skills, products });
    // } catch(err) {
    //     next(err);
    // }
};

module.exports.sendEmail = async (ctx, next) => {
    if (!ctx.request.body.name || !ctx.request.body.email || !ctx.request.body.message) {
        ctx.flash('msgemail', 'Все поля нужно заполнить');
        return ctx.redirect('/');
    }
    const transporter = nodemailer.createTransport(config.get('sendMail:smtp'));
    const mailOptions = {
        from: `"${ctx.request.body.name}" <${ctx.request.body.email}>`,
        to: config.get('sendMail:finalDestination'),
        subject: config.get('sendMail:subject'),
        text: ctx.request.body.message.trim().slice(0, 500) +
        `\n Отправлено с: <${ctx.request.body.email}>`
    };
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(info);
        ctx.flash('msgemail', `Письмо успешно отправлено`);
    }catch (err) {
        ctx.flash('msgemail', `При отправку письма произошла ошибка: ${err}`);
    }
    return ctx.redirect('/');
};


