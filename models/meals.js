const db = require('../database');
const mysql = require('mysql');

module.exports = {
    async addCoachMeals(coachId, mealId) {
        let result;
        return new Promise((resolve, reject) => {
            let query = `
                      INSERT IGNORE INTO data.coach_meal (coach_id, id, added_at)
                      VALUES (${coachId}, ${mealId}, NOW());`;
            console.log("Executing query: " + query);
            db.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    result = res.affectedRows > 0 ? true : false;
                    resolve(result);
                }
            });
        });
    },
    async updateMeal(mealId, name, procedureText) {
        let result, update = [];
        name ? update.push(`mi.name = ${mysql.escape(name)}`) : null;
        procedureText ? update.push(`m.procedure_text = ${mysql.escape(procedureText)}`) : null;
        return new Promise((resolve, reject) => {
            let query = `
                      UPDATE data.meal_i18n AS mi
                      INNER JOIN data.meal AS m ON mi.id = m.id
                      SET
                      ${update.toString()}
                      WHERE mi.id = ${mealId};`;
            console.log("Executing query: " + query);
            db.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    result = res.affectedRows > 0 ? true : false;
                    resolve(result);
                }
            });
        });
    },
    async deleteMeal(mealId) {
        let result;
        return new Promise((resolve, reject) => {
            let query = `CALL data.delete_meal(${mealId});`;
            console.log("Executing query: " + query);
            db.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    result = res.affectedRows > 0 ? true : false;
                    resolve(result);
                }
            });
        });
    },
    async getCoachMeals(coachId, locale) {
        let result;
        locale = !locale ? '' : `AND LOWER(mi.locale) = '${locale}'`;
        return new Promise((resolve, reject) => {
            let query = `
                      SELECT
                            mi.name,
                            mi.id,
                            mi.locale,
                            m.procedure_text
                      FROM data.coach_meal as cm
                      INNER JOIN data.meal_i18n AS mi ON cm.id= mi.id
                      INNER JOIN data.meal AS m ON mi.id = m.id
                      WHERE cm.coach_id = ${coachId} ${locale};`;
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
    },
    async getMeals(locale, coachId) {
        let result, filter;
        if (locale) {
            filter = `WHERE LOWER(mi.locale) = '${locale}'`;
        }
        if (isNaN(coachId)) {
            if (filter) {
                filter = `${filter} AND mi.id NOT IN (select id from data.coach_meal where coach_id = ${coachId})`;
            } else {
                filter = `WHERE mi.id NOT IN (select id from data.coach_meal where coach_id = ${coachId})`;
            }
        }
        return new Promise((resolve, reject) => {
            let query = `
                      SELECT 
							mi.name,
							mi.id,
							mi.locale,
							m.procedure_text
                      FROM data.meal_i18n AS mi
                      INNER JOIN data.meal AS m ON mi.id = m.id
                      ${filter ? filter : ''};`;
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
    },
    async createMeal(coachId, name, procedureText, locale, createForCoach) {
        let result;
        return new Promise((resolve, reject) => {
            let query = `CALL data.create_meal(${coachId}, ${mysql.escape(name)}, ${mysql.escape(procedureText)}, ${mysql.escape(locale)}, ${createForCoach});`;
            console.log("Executing query: " + query);
            db.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    result = Object.values(JSON.parse(JSON.stringify(res[0])));
                    resolve(result[0].id);
                }
            });
        });
    },
};
