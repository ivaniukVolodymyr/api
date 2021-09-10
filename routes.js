const meals = require('./controllers/meals');
const Joi = require('joi');

module.exports = [
    {
        method: 'GET',
        path: '/api/meals',
        options: {
            handler: meals.getMeals,
            description: 'Get meals list',
            notes: 'Returns an array of meals',
            tags: ['api'],
            validate: {
                query: Joi.object({
                    locale: Joi.string().allow(null, '').valid('en', 'da').optional(),
                    coachId: Joi.number().integer().optional().description('Coach meals will be excluded if provided')
                })

            }
        }
    },
    {
        method: 'GET',
        path: '/api/coachMeals',
        options: {
            handler: meals.getCoachMeals,
            description: 'Get coach meals list',
            notes: 'Returns an array of coach meals',
            tags: ['api'],
            validate: {
                query: Joi.object({
                    locale: Joi.string().allow(null, '').valid('en', 'da').optional(),
                    coachId: Joi.number().integer().required().description('Coach Id')
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/coach/{coachId}/addMeal',
        options: {
            handler: meals.addMeal,
            description: 'Add meal to coach list',
            notes: 'Adding existed meal to coach meals list',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    coachId: Joi.number().integer().required().description('Coach Id')
                }),
                payload: Joi.object({
                    mealId: Joi.number().integer().required().description('Meal Id')
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/coach/{coachId}/createMeal',
        options: {
            handler: meals.createMeal,
            description: 'Creates new meal',
            notes: 'Creating a new meal with name and procedure text',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    coachId: Joi.number().integer().required().description('Coach Id')
                }),
                payload: Joi.object({
                    name: Joi.string().required().description('Meal name'),
                    procedureText: Joi.string().required().description('Meal procedure text'),
                    locale: Joi.string().allow(null, '').valid('en', 'da').optional()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/coach/updateMeal',
        options: {
            handler: meals.updateMeal,
            description: 'Update meal',
            notes: 'Updating meal with new name or procedure text',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mealId: Joi.number().integer().required().description('Meal Id'),
                    name: Joi.string().optional().description('Meal name - if provided then  would be updated'),
                    procedureText: Joi.string().optional().description('Meal procedure text- if provided then would be updated')
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/coach/deleteMeal',
        options: {
            handler: meals.deleteMeal,
            description: 'Delete meal',
            notes: 'Delete all related meal records',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mealId: Joi.number().integer().required().description('Meal Id')
                })
            }
        }
    }
];