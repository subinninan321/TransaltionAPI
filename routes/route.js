const controller = require('../controllers/controller');
const validator = require('../utils/joiValidation');
module.exports = [
  {
    method: 'GET',
    path: '/api/languages',
    handler: controller.getAllLanguages,
  },
  {
    method: 'POST',
    path: '/api/translate',
    handler: controller.translate,
    options: {
      validate: {
        query: validator.translateQueryValidation,
        payload: validator.translateValidation,

        failAction: (req, h, err) => {
          return h
            .response({
              message: err.message,
            })
            .code(400)
            .takeover();
        },
      },
    },
  },
];
