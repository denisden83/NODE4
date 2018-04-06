const config = require('../config');
const { Pool } = require('pg');

const pool = new Pool(config.get('postgres'));

module.exports = {
    query: (text, params) => pool.query(text, params)
};