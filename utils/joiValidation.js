const Joi = require('joi');

exports.translateValidation = Joi.object({
  text: Joi.string().required(),

});

exports.translateQueryValidation= Joi.object({
    to: Joi.string().required(),
    from: Joi.string().required(),
})