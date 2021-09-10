const meal = require('../models/meals');
const locales = require('../models/locale');
const translate = require('@iamtraction/google-translate');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

const checkMealExists = async (mealId) => {
    let exist, meals;
    meals = await meal.getMeals(null, null);
    meals.map(m => {
        if (mealId === m.id) {
            exist = true;
        }
    });
    return exist;
};

module.exports = {
    async addMeal(request, reply) {
        let coachId, mealId;
        coachId = request.params.coachId;
        if (isNaN(request.payload.mealId) || !request.payload.mealId)
            return reply({ error: 'Missing parameter mealId - not sure which to add' });
        mealId = request.payload.mealId;
        try {
            if (await checkMealExists(mealId)) {
                await meal.addCoachMeals(coachId, mealId);
                return { success: true, state: 'The meal was successfully added to the staff meals list' };
            } else {
                return { success: false, state: `Meal wasn't found, please check mealId` };
            }
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        }

    },
    async updateMeal(request, reply) {
        let mealId, name, procedureText;
        if (!request.payload.name && !request.payload.procedureText)
            return { error: `Can't update meal, missing data to update` };
        if (!request.payload.mealId)
            return { error: `Can't update meal, mealId is not defined` };
        mealId = request.payload.mealId;
        name = request.payload.name ? request.payload.name : null;
        procedureText = request.payload.procedureText ? request.payload.procedureText : null;
        try {
            if (await checkMealExists(mealId)) {
                await meal.updateMeal(mealId, name, procedureText);
                return { success: true, state: 'The meal was successfully edited' };
            } else {
                return { success: false, state: `Meal wasn't found, please check mealId` };
            }
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        }

    },
    async deleteMeal(request, reply) {
        let mealId;
        if (!request.payload.mealId)
            return { error: `Can't update meal, mealId is not defined` };
        mealId = request.payload.mealId;
        try {
            if (await checkMealExists(mealId)) {
                await meal.deleteMeal(mealId);
                return { success: true, state: 'The meal was successfully deleted' };
            } else {
                return { success: false, state: `Meal wasn't found, please check mealId` };
            }
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        }

    },
    async createMeal(request, reply) {
        let coachId, name, procedureText, locale, skipExtraCreation = false, defined = false;
        coachId = request.params.coachId;
        if (!request.payload.name || !request.payload.procedureText)
            return reply({ error: 'Missing details of meal, name or procedureText is not provided' });
        name = request.payload.name;
        procedureText = request.payload.procedureText;
        locale = request.payload.locale ? request.payload.locale : null;
        skipExtraCreation = request.payload.skipExtraCreation ? request.payload.skipExtraCreation : false;
        let allLocales = [{ locale: 'en' }, { locale: 'da' }]; // use only two languages: en-US and da-DK 

        // let allLocales = await locales.defineLocales(); // get all posible languages
        if (!locale) { // try to detect provided language from procedure text
            lngDetector.setLanguageType('iso2');
            let detailsLanguage = lngDetector.detect(procedureText, 1);
            if (detailsLanguage.length !== 0) {
                allLocales.map((l) => {
                    if (l.locale === detailsLanguage[0][0].toString()) {
                        defined = true;
                    }
                });
            }
            locale = defined ? detailsLanguage[0][0].toString() : 'en'; // use a default if not defined
        }
        try {
            let mealId = await meal.createMeal(coachId, name, procedureText, locale, true);
            if (!skipExtraCreation) {
                const promises = allLocales.map((l, index) => {
                    if (l.locale !== locale) {
                        return new Promise((resolve) => {
                            setTimeout(async () => {
                                let tName, tProcedureText;
                                await translate(name, { from: locale, to: l.locale }).then(res => {
                                    tName = res.text;
                                });
                                await translate(procedureText, { from: locale, to: l.locale }).then(res => {
                                    tProcedureText = res.text;
                                });
                                if (tName && tProcedureText) {
                                    await meal.createMeal(coachId, tName, tProcedureText, l.locale, false);
                                }
                            }, 5000 * index);
                        });
                    }
                });
                const results = Promise.all(promises);
            }
            if (mealId) {
                return { success: true, state: 'New meal was created', id: mealId };
            } else {
                return { success: false, state: 'Something went wrong' };
            }
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        }

    },
    async getCoachMeals(request, reply) {
        let res = {}, locale, coachId;
        locale = request.query.locale ? request.query.locale.toLowerCase() : null;
        if (isNaN(request.query.coachId) || !request.query.coachId)
            return { error: 'Missing parameter coachId' };
        coachId = request.query.coachId; 
        try {
            let meals = await meal.getCoachMeals(coachId, locale);
            res.meals = meals.map(m => {
                return {
                    mealId: m.id,
                    locale: m.locale,
                    name: m.name,
                    recipe: m.procedure_text
                };
            });
            return res;
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        }
    },
    async getMeals(request, reply) {
        let res = {}, locale, coachId;
        locale = request.query.locale ? request.query.locale.toLowerCase() : null;
        coachId = request.query.coachId ? request.query.coachId : null;
        try {
            let meals = await meal.getMeals(locale, coachId);
            res.meals = meals.map(m => {
                return {
                    mealId: m.id,
                    locale: m.locale,
                    name: m.name,
                    recipe: m.procedure_text
                };
            });
            return res;
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        }
    }

};
