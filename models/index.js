const db = require('../db');

module.exports = {
    ModelIndex: {
        getStatistics() { return db.query('SELECT * FROM skills'); },
        getProducts() { return db.query('SELECT * FROM products'); }
    },
    ModelLogIn: {
        checkIfAdmin(email) {
            return db.query('SELECT * FROM admin WHERE email = $1', [email]);
        }
    },
    ModelAdmin: {
        getConcerts: () => db.query(`SELECT * FROM skills WHERE name = 'concerts'`),
        getCities: () => db.query(`SELECT * FROM skills WHERE name = 'cities'`),
        getYears: () => db.query(`SELECT * FROM skills WHERE name = 'years'`),
        getAge: () => db.query(`SELECT * FROM skills WHERE name = 'age'`),
        updateConcerts: (concerts) => db.query(`UPDATE skills SET number=$1 WHERE name='concerts'`, [concerts]),
        updateCities: (cities) => db.query(`UPDATE skills SET number=$1 WHERE name='cities'`, [cities]),
        updateYears: (years) => db.query(`UPDATE skills SET number=$1 WHERE name='years'`, [years]),
        updateAge: (age) => db.query(`UPDATE skills SET number=$1 WHERE name='age'`, [age]),
        addProduct(src, name, price) {
            return db.query(`INSERT INTO products (src, name, price) VALUES ($1, $2, $3)`, [src, name, price]);
        }
    }
};

// module.exports.getStatistics = () => db.query('SELECT * FROM skills');
// module.exports.getProducts = () => db.query('SELECT * FROM products');
