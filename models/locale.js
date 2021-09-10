const db = require('../database');
const mysql = require('mysql');
const data = "sql11436082";

module.exports = {
    async defineLocales() {
        let result;
        return new Promise((resolve, reject) => {
            let query = `SELECT distinct(locale) FROM ${data}.meal_i18n;`;
            console.log("Executing query: " + query);
            db.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    result = Object.values(JSON.parse(JSON.stringify(res)));
                    resolve(result);
                }
            });
        });
    }
};
