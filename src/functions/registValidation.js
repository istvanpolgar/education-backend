const Joi = require('joi');

const Schema = Joi.object({
    fname: Joi.string().min(3).max(128).required(),
    lname: Joi.string().min(3).max(128).required(),
    email: Joi.string().email().min(8).max(256).required(),
    password: Joi.string().min(3).max(128).required(),
    conf_password: Joi.string().valid(Joi.ref('password')).required(),
    teacher: Joi.boolean()
})

module.exports = Schema;