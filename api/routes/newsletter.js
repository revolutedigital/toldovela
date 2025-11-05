/* ========================================
   NEWSLETTER ROUTE
   ======================================== */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { validators, sanitizeData, isSpam } = require('../utils/validators');
const { sendNotificationEmail, sendConfirmationEmail } = require('../utils/mailer');

// Specific rate limit for newsletter (more relaxed)
const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 signups per hour per IP
    message: 'Limite de inscrições atingido. Por favor, tente novamente mais tarde.',
});

/**
 * POST /api/newsletter
 * Process newsletter signup
 */
router.post('/', newsletterLimiter, validators.newsletter, async (req, res) => {
    try {
        // Sanitize input data
        const data = sanitizeData(req.body);

        // Add page context if provided
        if (req.body.page) {
            data.page = req.body.page;
        }

        // Check for spam
        if (isSpam(data)) {
            console.warn('Spam detected in newsletter signup:', data.email);
            return res.json({
                success: true,
                message: 'Inscrição realizada com sucesso!'
            });
        }

        // Send notification email to company
        await sendNotificationEmail('newsletter', data);

        // Send confirmation email to user
        await sendConfirmationEmail('newsletter', data);

        // TODO: Save to database/mailing list if enabled
        // TODO: Add to Mailchimp/SendGrid/etc if enabled
        // TODO: Send to CRM if enabled

        // Log success
        console.log('Newsletter signup processed:', {
            email: data.email,
            page: data.page || 'unknown',
            timestamp: new Date().toISOString()
        });

        // Return success response
        res.json({
            success: true,
            message: 'Obrigado por se inscrever! Você receberá nossas novidades em breve.'
        });

    } catch (error) {
        console.error('Error processing newsletter signup:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao processar inscrição. Por favor, tente novamente.'
        });
    }
});

/**
 * GET /api/newsletter/unsubscribe/:email
 * Unsubscribe from newsletter
 */
router.get('/unsubscribe/:email', async (req, res) => {
    try {
        const email = req.params.email;

        // TODO: Remove from database/mailing list
        // TODO: Remove from CRM newsletter segment

        console.log('Newsletter unsubscribe:', {
            email: email,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Você foi removido da nossa lista de emails.'
        });

    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error);

        res.status(500).json({
            success: false,
            message: 'Erro ao processar sua solicitação.'
        });
    }
});

module.exports = router;
