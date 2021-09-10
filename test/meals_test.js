const assert = require('chai').assert;
const meals = require('../controllers/meals');
const db = require('../database');

let newCoachId, mealNewId, mealName, mealText, locale, resultCreate, resultGet, resultUpdate;
newCoachId = 1000000;
mealName = 'Test name for meal';
mealEditedName = 'Test name for meal - v2 - edited';
mealText = 'Test description for meal';
mealEditedText = 'Test description for meal - v2 - edited';
locale = 'en';

    describe("meals", function () {
        it('Should create meal', async () => {
            resultCreate = await meals.createMeal({ params: { coachId: newCoachId }, payload: { name: mealName, procedureText: mealText, locale: locale } }).then((res) => {
                return res;
            });
            mealNewId = resultCreate.id;
            assert.equal(resultCreate.success, true);
            assert.equal(resultCreate.state, 'New meal was created');
            assert.typeOf(resultCreate.id, 'number');
        });
        it('Should GET coach meals', async () => {
            resultGet = await meals.getCoachMeals({ query: { coachId: newCoachId, locale: locale } }).then((res) => {
              return res;
            });
            assert.typeOf(resultGet, 'object');
            assert.typeOf(resultGet.meals, 'array');
            assert.typeOf(resultGet.meals[0].mealId, 'number');
            assert.typeOf(resultGet.meals[0].locale, 'string');
            assert.typeOf(resultGet.meals[0].name, 'string');
            assert.typeOf(resultGet.meals[0].receipt, 'string');
        });
        it('Should GET all meals', async () => {
            resultGet = await meals.getMeals({ query: {}}).then((res) => {
                return res;
            });
            assert.typeOf(resultGet, 'object');
            assert.typeOf(resultGet.meals, 'array');
            assert.typeOf(resultGet.meals[0].mealId, 'number');
            assert.typeOf(resultGet.meals[0].locale, 'string');
            assert.typeOf(resultGet.meals[0].name, 'string');
            assert.typeOf(resultGet.meals[0].receipt, 'string');
        });
        it('Should EDIT meal', async () => {
            resultUpdate = await meals.updateMeal({ payload: { mealId: mealNewId, name: mealEditedName, procedureText: mealEditedText } }).then((res) => {
              return res;
            });
            assert.equal(resultUpdate.success, true);
            assert.equal(resultUpdate.state, 'The meal was successfully edited');
        });
        it('Should DELETE meal', async () => {
            resultUpdate = await meals.deleteMeal({ payload: { mealId: mealNewId } }).then((res) => {
                return res;
            });
            assert.equal(resultUpdate.success, true);
            assert.equal(resultUpdate.state, 'The meal was successfully deleted');
        });
});
