/* ========================================
   VALIDATION UTILITIES
   ======================================== */

const { body, validationResult } = require('express-validator');

/**
 * Validation middleware wrapper
 */
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({
            field: err.path,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors: extractedErrors,
        });
    };
};

/**
 * Common validation rules
 */
const rules = {
    // Name validation
    name: body('nome')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Nome deve conter apenas letras'),

    // Email validation
    email: body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    // Phone validation (Brazilian format)
    phone: body('telefone')
        .trim()
        .notEmpty().withMessage('Telefone é obrigatório')
        .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/).withMessage('Telefone inválido. Use o formato (11) 91234-5678'),

    // Optional phone
    phoneOptional: body('telefone')
        .optional()
        .trim()
        .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/).withMessage('Telefone inválido. Use o formato (11) 91234-5678'),

    // Message validation
    message: body('mensagem')
        .trim()
        .notEmpty().withMessage('Mensagem é obrigatória')
        .isLength({ min: 10, max: 1000 }).withMessage('Mensagem deve ter entre 10 e 1000 caracteres'),

    // Subject validation
    subject: body('assunto')
        .trim()
        .notEmpty().withMessage('Assunto é obrigatório')
        .isLength({ min: 3, max: 100 }).withMessage('Assunto deve ter entre 3 e 100 caracteres'),

    // Company validation
    company: body('empresa')
        .trim()
        .notEmpty().withMessage('Empresa é obrigatória')
        .isLength({ min: 2, max: 100 }).withMessage('Empresa deve ter entre 2 e 100 caracteres'),

    // Optional company
    companyOptional: body('empresa')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Empresa deve ter entre 2 e 100 caracteres'),

    // CEP validation (Brazilian postal code)
    cep: body('cep')
        .trim()
        .notEmpty().withMessage('CEP é obrigatório')
        .matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido. Use o formato 12345-678'),

    // Address validation
    address: body('endereco')
        .trim()
        .notEmpty().withMessage('Endereço é obrigatório')
        .isLength({ min: 5, max: 200 }).withMessage('Endereço deve ter entre 5 e 200 caracteres'),

    // City validation
    city: body('cidade')
        .trim()
        .notEmpty().withMessage('Cidade é obrigatória')
        .isLength({ min: 2, max: 100 }).withMessage('Cidade deve ter entre 2 e 100 caracteres'),

    // State validation
    state: body('estado')
        .trim()
        .notEmpty().withMessage('Estado é obrigatório')
        .isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres (ex: SP)'),

    // CAU/CREA validation
    registration: body('registro')
        .trim()
        .notEmpty().withMessage('Número de registro é obrigatório')
        .isLength({ min: 3, max: 50 }).withMessage('Registro deve ter entre 3 e 50 caracteres'),

    // Project type validation
    projectType: body('tipo_projeto')
        .trim()
        .notEmpty().withMessage('Tipo de projeto é obrigatório')
        .isIn(['residencial', 'comercial', 'corporativo', 'esportivo', 'publico', 'outro'])
        .withMessage('Tipo de projeto inválido'),

    // Area validation
    area: body('area')
        .optional()
        .trim()
        .matches(/^\d+$/).withMessage('Área deve ser um número'),

    // Budget validation
    budget: body('orcamento')
        .optional()
        .trim()
        .isIn(['ate-10k', '10k-30k', '30k-50k', '50k-100k', 'acima-100k', 'a-definir'])
        .withMessage('Faixa de orçamento inválida'),

    // Materials validation (checkboxes)
    materials: body('materiais')
        .optional()
        .isArray().withMessage('Materiais deve ser um array'),

    // Description validation
    description: body('descricao')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),

    // Privacy consent
    consent: body('consentimento')
        .notEmpty().withMessage('É necessário aceitar os termos de privacidade')
        .isBoolean().withMessage('Consentimento inválido')
        .equals('true').withMessage('É necessário aceitar os termos de privacidade')
};

/**
 * Specific validation sets for each form
 */
const validators = {
    // Contact form
    contato: validate([
        rules.name,
        rules.email,
        rules.phone,
        rules.subject,
        rules.message
    ]),

    // Quote form (home/método)
    orcamento: validate([
        rules.name,
        rules.email,
        rules.phone,
        rules.companyOptional,
        rules.projectType,
        rules.area,
        rules.budget,
        rules.message
    ]),

    // Samples form (materiais)
    amostras: validate([
        rules.name,
        rules.email,
        rules.phone,
        rules.companyOptional,
        rules.cep,
        rules.address,
        rules.city,
        rules.state,
        rules.materials,
        body('materiais').notEmpty().withMessage('Selecione pelo menos um material')
    ]),

    // Partnership form (arquitetos)
    parceria: validate([
        rules.name,
        rules.email,
        rules.phone,
        rules.company,
        rules.registration,
        body('tipo_registro')
            .trim()
            .notEmpty().withMessage('Tipo de registro é obrigatório')
            .isIn(['CAU', 'CREA']).withMessage('Tipo de registro inválido'),
        rules.city,
        rules.state,
        rules.description
    ]),

    // Newsletter
    newsletter: validate([
        body('email')
            .trim()
            .notEmpty().withMessage('Email é obrigatório')
            .isEmail().withMessage('Email inválido')
            .normalizeEmail()
    ])
};

/**
 * Sanitize input data
 */
const sanitizeData = (data) => {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            // Remove HTML tags
            sanitized[key] = value.replace(/<[^>]*>/g, '');
            // Trim whitespace
            sanitized[key] = sanitized[key].trim();
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

/**
 * Check for spam patterns
 */
const isSpam = (data) => {
    const spamPatterns = [
        /viagra/i,
        /cialis/i,
        /casino/i,
        /lottery/i,
        /\bsex\b/i,
        /xxx/i,
        /porn/i,
        /click here/i,
        /buy now/i,
        /<script>/i,
        /javascript:/i,
        /<iframe>/i
    ];

    const text = JSON.stringify(data).toLowerCase();

    return spamPatterns.some(pattern => pattern.test(text));
};

module.exports = {
    validate,
    rules,
    validators,
    sanitizeData,
    isSpam
};
