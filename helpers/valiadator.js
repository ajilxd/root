const joi = require("joi");
const signupSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi
    .string()
    .min(2)
    .required()
    .regex(/^(?=.*[a-zA-Z0-9])(?=.*\d).+$/),
  retypepassword: joi.ref("password"),
  username: joi
    .string()
    .min(3)
    .regex(/^[a-zA-Z]*$/)
    .required(),
});

const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const categorySchema = joi.object({
  categoryname: joi
    .string()
    .min(3)
    .max(10)
    .regex(/^[a-zA-Z\s]*$/)
    .required(),
  status: joi.string().required(),
  description: joi
    .string()
    .min(8)
    .regex(/^[a-zA-Z\s]*$/)
    .required(),
});

const productSchema = joi.object({
  productname: joi
    .string()
    .min(3)
    .regex(/^[a-zA-Z\s]*$/)
    .required(),
  cost: joi
    .string()
    .regex(/^[0-9]*$/)
    .min(1)
    .required(),
  color: joi.string().required(),
  size: joi.string().required(),
  brand: joi.string().min(3),
  description: joi.string().required(),
  price: joi
    .string()
    .regex(/^[0-9]*$/)
    .required(),
  status: joi.string().required(),
  categories: joi.string(),
});

const addressSchema = joi.object({
  name: joi
    .string()
    .min(3)
    .regex(/^[a-zA-Z]*$/)
    .required(),
  type: joi
    .string()
    .min(2)
    .regex(/^[a-zA-Z\s]*$/)
    .required(),
  addressline: joi.string().min(2).required(),
  country: joi
    .string()
    .min(2)
    .regex(/^[a-zA-Z]*$/)
    .required(),
  state: joi.string().min(2).required(),
  city: joi
    .string()
    .min(2)
    .regex(/^[a-zA-Z]*$/)
    .required(),
  zipcode: joi.string().required(),
  mobileno: joi
    .string()
    .regex(/^[0-9]*$/)
    .required(),
});

module.exports = {
  signupSchema,
  signinSchema,
  categorySchema,
  productSchema,
  addressSchema,
};
