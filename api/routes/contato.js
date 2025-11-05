/* ========================================
   CONTATO ROUTE
   ======================================== */

const express = require('express');
const router = express.Router();
const { validators, sanitizeData, isSpam } = require('../utils/validators');
const { sendNotificationEmail, sendConfirmationEmail } = require('../utils/mailer');

/**
 * POST /api/contato
 * Process contact form submission
 */
router.post('/', validators.contato, async (req, res) => {
    try {
        // Sanitize input data
        const data = sanitizeData(req.body);

        // Check for spam
        if (isSpam(data)) {
            console.warn('Spam detected in contact form:', data.email);
            // Return success to prevent spam bots from knowing
            return res.json({
                success: true,
                message: 'Mensagem enviada com sucesso!'
            });
        }

        // Send notification email to company
        await sendNotificationEmail('contato', data);

        // Send confirmation email to user
        await sendConfirmationEmail('contato', data);

        // TODO: Save to database if enabled
        // if (process.env.DATABASE_ENABLED === 'true') {
        //     await saveToDatabase('contato', data);
        // }

        // TODO: Send to CRM if enabled
        // if (process.env.RDSTATION_ENABLED === 'true') {
        //     await sendToRDStation('contato', data);
        // }

        // Log success
        console.log('Contact form processed:', {
            email: data.email,
            subject: data.assunto,
            timestamp: new Date().toISOString()
        });

        // Return success response
        res.json({
            success: true,
            message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            redirectUrl: `/obrigado?form=contato&assunto=${encodeURIComponent(data.assunto)}`
        });

    } catch (error) {
        console.error('Error processing contact form:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato via WhatsApp.'
        });
    }
});

module.exports = router;
