/* ========================================
   EMAIL UTILITIES
   ======================================== */

const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/**
 * Send email notification to company
 */
const sendNotificationEmail = async (formType, data) => {
    const transporter = createTransporter();

    // Determine recipient based on form type
    let recipient = process.env.EMAIL_CONTATO;
    if (formType === 'parceria') {
        recipient = process.env.EMAIL_ARQUITETOS;
    } else if (formType === 'orcamento') {
        recipient = process.env.EMAIL_COMERCIAL;
    }

    // Build email content based on form type
    const subject = getEmailSubject(formType, data);
    const html = getEmailTemplate(formType, data);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: subject,
        html: html,
        replyTo: data.email
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Notification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending notification email:', error);
        throw error;
    }
};

/**
 * Send confirmation email to user
 */
const sendConfirmationEmail = async (formType, data) => {
    const transporter = createTransporter();

    const subject = getConfirmationSubject(formType);
    const html = getConfirmationTemplate(formType, data);

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: subject,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // Don't throw - confirmation email is not critical
        return { success: false, error: error.message };
    }
};

/**
 * Get email subject based on form type
 */
const getEmailSubject = (formType, data) => {
    switch (formType) {
        case 'contato':
            return `[Site] Novo Contato: ${data.assunto}`;
        case 'orcamento':
            return `[Site] Novo Orçamento - ${data.tipo_projeto || 'N/A'}`;
        case 'amostras':
            return `[Site] Solicitação de Amostras - ${data.nome}`;
        case 'parceria':
            return `[Site] Nova Parceria (Arquiteto) - ${data.nome}`;
        case 'newsletter':
            return `[Site] Nova Inscrição Newsletter`;
        default:
            return '[Site] Nova Mensagem';
    }
};

/**
 * Get confirmation email subject
 */
const getConfirmationSubject = (formType) => {
    switch (formType) {
        case 'contato':
            return 'Recebemos seu contato - Toldo Vela';
        case 'orcamento':
            return 'Recebemos sua solicitação de orçamento - Toldo Vela';
        case 'amostras':
            return 'Recebemos seu pedido de amostras - Toldo Vela';
        case 'parceria':
            return 'Recebemos sua proposta de parceria - Toldo Vela';
        case 'newsletter':
            return 'Bem-vindo à Newsletter Toldo Vela!';
        default:
            return 'Confirmação - Toldo Vela';
    }
};

/**
 * Get notification email template
 */
const getEmailTemplate = (formType, data) => {
    const baseTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1A4D5C, #FF6B35); color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                .field { margin-bottom: 15px; }
                .field label { font-weight: bold; display: block; margin-bottom: 5px; }
                .field value { display: block; padding: 10px; background: white; border-radius: 4px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Toldo Vela</h1>
                    <p>${getEmailSubject(formType, data)}</p>
                </div>
                <div class="content">
                    ${getFormFields(formType, data)}
                </div>
                <div class="footer">
                    <p>Esta mensagem foi enviada através do formulário do site Toldo Vela</p>
                    <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return baseTemplate;
};

/**
 * Get form fields for email
 */
const getFormFields = (formType, data) => {
    let fields = `
        <div class="field">
            <label>Nome:</label>
            <value>${data.nome}</value>
        </div>
        <div class="field">
            <label>Email:</label>
            <value><a href="mailto:${data.email}">${data.email}</a></value>
        </div>
        <div class="field">
            <label>Telefone:</label>
            <value><a href="tel:${data.telefone}">${data.telefone}</a></value>
        </div>
    `;

    switch (formType) {
        case 'contato':
            fields += `
                <div class="field">
                    <label>Assunto:</label>
                    <value>${data.assunto}</value>
                </div>
                <div class="field">
                    <label>Mensagem:</label>
                    <value>${data.mensagem}</value>
                </div>
            `;
            break;

        case 'orcamento':
            fields += `
                ${data.empresa ? `<div class="field"><label>Empresa:</label><value>${data.empresa}</value></div>` : ''}
                <div class="field">
                    <label>Tipo de Projeto:</label>
                    <value>${data.tipo_projeto}</value>
                </div>
                ${data.area ? `<div class="field"><label>Área (m²):</label><value>${data.area}</value></div>` : ''}
                ${data.orcamento ? `<div class="field"><label>Orçamento:</label><value>${data.orcamento}</value></div>` : ''}
                <div class="field">
                    <label>Mensagem:</label>
                    <value>${data.mensagem}</value>
                </div>
            `;
            break;

        case 'amostras':
            fields += `
                ${data.empresa ? `<div class="field"><label>Empresa:</label><value>${data.empresa}</value></div>` : ''}
                <div class="field">
                    <label>CEP:</label>
                    <value>${data.cep}</value>
                </div>
                <div class="field">
                    <label>Endereço:</label>
                    <value>${data.endereco}</value>
                </div>
                <div class="field">
                    <label>Cidade/Estado:</label>
                    <value>${data.cidade} - ${data.estado}</value>
                </div>
                <div class="field">
                    <label>Materiais Solicitados:</label>
                    <value>${Array.isArray(data.materiais) ? data.materiais.join(', ') : data.materiais}</value>
                </div>
            `;
            break;

        case 'parceria':
            fields += `
                <div class="field">
                    <label>Empresa:</label>
                    <value>${data.empresa}</value>
                </div>
                <div class="field">
                    <label>Registro:</label>
                    <value>${data.tipo_registro} ${data.registro}</value>
                </div>
                <div class="field">
                    <label>Cidade/Estado:</label>
                    <value>${data.cidade} - ${data.estado}</value>
                </div>
                ${data.descricao ? `<div class="field"><label>Descrição:</label><value>${data.descricao}</value></div>` : ''}
            `;
            break;

        case 'newsletter':
            fields = `
                <div class="field">
                    <label>Email:</label>
                    <value>${data.email}</value>
                </div>
            `;
            break;
    }

    return fields;
};

/**
 * Get confirmation email template for user
 */
const getConfirmationTemplate = (formType, data) => {
    let message = '';

    switch (formType) {
        case 'contato':
            message = `Recebemos seu contato e nossa equipe retornará em breve, geralmente em até 24 horas úteis.`;
            break;
        case 'orcamento':
            message = `Recebemos sua solicitação de orçamento e nossa equipe comercial entrará em contato em breve com uma proposta personalizada.`;
            break;
        case 'amostras':
            message = `Recebemos seu pedido de amostras e prepararemos seu kit personalizado. Entraremos em contato para confirmar o envio.`;
            break;
        case 'parceria':
            message = `Recebemos sua proposta de parceria! Nossa equipe técnica entrará em contato em breve para apresentar nossas soluções e condições especiais.`;
            break;
        case 'newsletter':
            message = `Obrigado por se inscrever em nossa newsletter! Você receberá nossas novidades, dicas e projetos exclusivos.`;
            break;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1A4D5C, #FF6B35); color: white; padding: 30px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                .cta { text-align: center; margin: 30px 0; }
                .button { display: inline-block; padding: 15px 30px; background: #FF6B35; color: white; text-decoration: none; border-radius: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✓ Recebemos sua mensagem!</h1>
                </div>
                <div class="content">
                    <p>Olá, <strong>${data.nome}</strong>!</p>
                    <p>${message}</p>
                    <p>Enquanto isso, se precisar de algo urgente, entre em contato conosco:</p>
                    <ul>
                        <li>📞 Telefone: (11) 4035-8878</li>
                        <li>📱 WhatsApp: (11) 91262-3834</li>
                        <li>📧 Email: contato@toldovela.com.br</li>
                    </ul>
                    <div class="cta">
                        <a href="https://wa.me/5511912623834" class="button">Falar no WhatsApp</a>
                    </div>
                </div>
                <div class="footer">
                    <p><strong>Toldo Vela</strong> - Coberturas Têxteis de Alta Performance</p>
                    <p>www.toldovela.com.br</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = {
    sendNotificationEmail,
    sendConfirmationEmail
};
