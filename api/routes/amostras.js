/* ========================================
   AMOSTRAS ROUTE
   ======================================== */

const express = require('express');
const router = express.Router();
const { validators, sanitizeData, isSpam } = require('../utils/validators');
const { sendNotificationEmail, sendConfirmationEmail } = require('../utils/mailer');

/**
 * POST /api/amostras
 * Process material samples request form submission
 */
router.post('/', validators.amostras, async (req, res) => {
    try {
        // Sanitize input data
        const data = sanitizeData(req.body);

        // Ensure materials is an array
        if (typeof data.materiais === 'string') {
            data.materiais = [data.materiais];
        }

        // Check for spam
        if (isSpam(data)) {
            console.warn('Spam detected in samples form:', data.email);
            return res.json({
                success: true,
                message: 'Solicitação enviada com sucesso!'
            });
        }

        // Send notification email to company
        await sendNotificationEmail('amostras', data);

        // Send confirmation email to user
        await sendConfirmationEmail('amostras', data);

        // TODO: Save to database if enabled
        // TODO: Send to CRM if enabled
        // TODO: Integrate with shipping system

        // Log success
        console.log('Samples form processed:', {
            email: data.email,
            materials: data.materiais,
            city: data.cidade,
            state: data.estado,
            timestamp: new Date().toISOString()
        });

        // Return success response
        res.json({
            success: true,
            message: 'Solicitação de amostras enviada com sucesso! Prepararemos seu kit e entraremos em contato.',
            redirectUrl: '/obrigado?form=material'
        });

    } catch (error) {
        console.error('Error processing samples form:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao enviar solicitação. Por favor, tente novamente ou entre em contato via WhatsApp.'
        });
    }
});

module.exports = router;
