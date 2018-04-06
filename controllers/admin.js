const fs = require('fs');
const path = require('path');
const { ModelAdmin } = require('../models');

module.exports.showPageAdmin = async (ctx, next) => {
    try {
        let { rows: [cities] } = await ModelAdmin.getCities();
        let { rows: [concerts] } = await ModelAdmin.getConcerts();
        let { rows: [years] } = await ModelAdmin.getYears();
        let { rows: [age] } = await ModelAdmin.getAge();
        let data = { cities, concerts, years, age};
        data.msgskill = ctx.flash('msgskill');
        data.msgupdated = ctx.flash('msgupdated');
        data.msgfile = ctx.flash('msgfile');
        ctx.render('./pages/admin', data);

        // let citiesP = ModelAdmin.getCities;
        // let concertsP = ModelAdmin.getConcerts;
        // let yearsP = ModelAdmin.getYears;
        // let ageP = ModelAdmin.getAge;
        // let [
        //     { rows: [cities] },
        //     { rows: [concerts] },
        //     { rows: [years] },
        //     { rows: [age] }
        //     ] = await Promise.all([citiesP(), concertsP(), yearsP(), ageP()]);
        //
        // ctx.render('./pages/admin', { cities, concerts, years, age});
    } catch(err) {
        next(err);
    }
};

module.exports.addStatistics = async (ctx, next) => {
    try {
        let concerts = ctx.request.body.concerts;
        let cities = ctx.request.body.cities;
        let years = ctx.request.body.years;
        let age = ctx.request.body.age;

        if (!concerts && !cities && !years && !age) {
            ctx.flash('msgskill', `No data to change`);
            return ctx.redirect('/admin');
        }
        ctx.flash('msgupdated', 'Updated:');
        if (concerts) {
            await ModelAdmin.updateConcerts(concerts);
            ctx.flash('msgskill', ' concerts');
        }
        if (cities) {
            await ModelAdmin.updateCities(cities);
            ctx.flash('msgskill', ' cities');
        }
        if (years) {
            await ModelAdmin.updateYears(years);
            ctx.flash('msgskill', ' years');
        }
        if (age) {
            await ModelAdmin.updateAge(age);
            ctx.flash('msgskill', ' age');
        }
        return ctx.redirect('/admin');
    } catch (e) {
        next(e);
    }
};

module.exports.addProduct = async (ctx, next) => {
    let upload = path.join('./public', 'upload');
    let fileName;

    if (!fs.existsSync(upload)) fs.mkdirSync(upload);

    if (ctx.request.body.files.photo.name === '' || ctx.request.body.files.photo.size === 0) {
        fs.unlink(ctx.request.body.files.photo.path, (err) => {
            if (err) console.error(err);
        });
        ctx.flash('msgfile', 'Picture hasn\'t been attached');
        return ctx.redirect('/admin');
    }

    if ((!ctx.request.body.fields.name) || (!ctx.request.body.fields.price)) {
        fs.unlink(ctx.request.body.files.photo.path, (err) => {
            if (err) console.error(err);
        });
        ctx.flash('msgfile', 'Either Name or Price hasn\'t been inserted');
        return ctx.redirect('/admin');
    }

    fileName = path.join(upload, ctx.request.body.files.photo.name);

    await new Promise((resolve, reject) => {
        fs.rename(ctx.request.body.files.photo.path, fileName, async (err) => {
            if (err) {
                console.error(err);
                fs.unlink(fileName);
                fs.rename(ctx.request.body.files.photo.path, fileName);
            }
            let src = fileName.substr(fileName.indexOf('\\'));
            try {
                await ModelAdmin.addProduct(src, ctx.request.body.fields.name, +ctx.request.body.fields.price);
            } catch (err) {
                next(err);
            }
            resolve();
        });
    });

    ctx.flash('msgfile', 'Picture has been saved');
    return ctx.redirect('/admin');
};

