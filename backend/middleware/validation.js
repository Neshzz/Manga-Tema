const { body } = require('express-validator');
const Joi = require('joi');

const mangaValidation = [
    body('title').notEmpty().trim().withMessage('Título é obrigatório'),
    body('description').notEmpty().trim().withMessage('Descrição é obrigatória'),
    body('author').notEmpty().trim().withMessage('Autor é obrigatório'),
    body('genre').isArray().withMessage('Gênero deve ser um array')
];

exports.mangaSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  author: Joi.string().min(3).max(50).required(),
  genre: Joi.array().items(Joi.string().valid(
    'Shonen', 'Shojo', 'Seinen', 'Josei', 'Mecha', 'Isekai'
  )).min(1).required(),
  status: Joi.string().valid('Ongoing', 'Completed', 'Hiatus').required()
});

module.exports = {
    mangaValidation
}; 