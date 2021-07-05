const Joi = require('joi');

const Schema = Joi.object({
    email: Joi.string().email().min(8).max(256).required(),
    password: Joi.string().min(3).max(128).required()
})

module.exports = Schema;