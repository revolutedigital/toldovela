/* ========================================
   PARCERIA ROUTE (B2B - Arquitetos)
   ======================================== */

const express = require('express');
const router = express.Router();
const { validators, sanitizeData, isSpam } = require('../utils/validators');
const { sendNotificationEmail, sendConfirmationEmail } = require('../utils/mailer');

/**
 * POST /api/parceria
 * Process partnership form submission (architects/designers)
 */
router.post('/', validators.parceria, async (req, res) => {
    try {
        // Sanitize input data
        const data = sanitizeData(req.body);

        // Check for spam
        if (isSpam(data)) {
            console.warn('Spam detected in partnership form:', data.email);
            return res.json({
                success: true,
                message: 'Proposta enviada com sucesso!'
            });
        }

        // Send notification email to company (architects team)
        await sendNotificationEmail('parceria', data);

        // Send confirmation email to user
        await sendConfirmationEmail('parceria', data);

        // TODO: Save to database if enabled
        // TODO: Send to CRM if enabled (B2B segment)
        // TODO: Add to architects/partners database

        // Log success
        console.log('Partnership form processed:', {
            email: data.email,
            company: data.empresa,
            registration: `${data.tipo_registro} ${data.registro}`,
            city: data.cidade,
            state: data.estado,
            timestamp: new Date().toISOString()
        });

        // Return success response
        res.json({
            success: true,
            message: 'Proposta de parceria enviada com sucesso! Nossa equipe técnica entrará em contato em breve.',
            redirectUrl: '/obrigado?form=arquiteto'
        });

    } catch (error) {
        console.error('Error processing partnership form:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao enviar proposta. Por favor, tente novamente ou entre em contato via WhatsApp.'
        });
    }
});

module.exports = router;
