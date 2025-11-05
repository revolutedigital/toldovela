/* ========================================
   ORÇAMENTO ROUTE
   ======================================== */

const express = require('express');
const router = express.Router();
const { validators, sanitizeData, isSpam } = require('../utils/validators');
const { sendNotificationEmail, sendConfirmationEmail } = require('../utils/mailer');

/**
 * POST /api/orcamento
 * Process quote/budget request form submission
 */
router.post('/', validators.orcamento, async (req, res) => {
    try {
        // Sanitize input data
        const data = sanitizeData(req.body);

        // Check for spam
        if (isSpam(data)) {
            console.warn('Spam detected in quote form:', data.email);
            return res.json({
                success: true,
                message: 'Solicitação enviada com sucesso!'
            });
        }

        // Send notification email to company
        await sendNotificationEmail('orcamento', data);

        // Send confirmation email to user
        await sendConfirmationEmail('orcamento', data);

        // TODO: Save to database if enabled
        // TODO: Send to CRM if enabled (high priority lead)

        // Log success
        console.log('Quote form processed:', {
            email: data.email,
            project_type: data.tipo_projeto,
            budget: data.orcamento,
            timestamp: new Date().toISOString()
        });

        // Return success response
        res.json({
            success: true,
            message: 'Solicitação de orçamento enviada com sucesso! Nossa equipe entrará em contato em breve.',
            redirectUrl: '/obrigado?form=orcamento'
        });

    } catch (error) {
        console.error('Error processing quote form:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao enviar solicitação. Por favor, tente novamente ou entre em contato via WhatsApp.'
        });
    }
});

module.exports = router;
