/* ========================================
   TOLDO VELA - API SERVER
   ======================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const contatoRoutes = require('./routes/contato');
const orcamentoRoutes = require('./routes/orcamento');
const amostrasRoutes = require('./routes/amostras');
const parceriaRoutes = require('./routes/parceria');
const newsletterRoutes = require('./routes/newsletter');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

/* ========================================
   MIDDLEWARE CONFIGURATION
   ======================================== */

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for form submissions
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 submissions per 15 minutes
    message: 'Limite de envios atingido. Por favor, aguarde alguns minutos antes de tentar novamente.',
});

/* ========================================
   ROUTES
   ======================================== */

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});

// Form endpoints
app.use('/api/contato', formLimiter, contatoRoutes);
app.use('/api/orcamento', formLimiter, orcamentoRoutes);
app.use('/api/amostras', formLimiter, amostrasRoutes);
app.use('/api/parceria', formLimiter, parceriaRoutes);
app.use('/api/newsletter', newsletterRoutes); // Different rate limit for newsletter

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Validation errors
    if (err.type === 'validation') {
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors: err.errors
        });
    }

    // Rate limit errors
    if (err.status === 429) {
        return res.status(429).json({
            success: false,
            message: 'Muitas requisições. Por favor, tente novamente mais tarde.'
        });
    }

    // Generic error
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

/* ========================================
   START SERVER
   ======================================== */

app.listen(PORT, () => {
    console.log('========================================');
    console.log('   TOLDO VELA API SERVER');
    console.log('========================================');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server running on port: ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log('========================================');
    console.log('Available endpoints:');
    console.log('  POST /api/contato     - Formulário de contato');
    console.log('  POST /api/orcamento   - Formulário de orçamento');
    console.log('  POST /api/amostras    - Solicitação de amostras');
    console.log('  POST /api/parceria    - Formulário de parceria');
    console.log('  POST /api/newsletter  - Cadastro newsletter');
    console.log('========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
    });
});

module.exports = app;
