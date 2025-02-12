const Joi = require("joi");

const registerSchema = Joi.object({
    Username: Joi.string().min(3).max(30).required(),
    Password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    contact: Joi.string().pattern(/^\d{10}$/).required()
});

const validateUser = (data) => registerSchema.validate(data);

module.exports = validateUser; 



