# Toldo Vela - Backend API

Backend API para gerenciamento de formulários e integrações do website Toldo Vela.

## 📋 Funcionalidades

- ✅ Processamento de formulários (contato, orçamento, amostras, parceria, newsletter)
- ✅ Validação de dados completa
- ✅ Envio de emails automáticos (notificações + confirmações)
- ✅ Proteção contra spam
- ✅ Rate limiting
- ✅ Segurança com Helmet
- ✅ CORS configurável
- ✅ Logs estruturados
- ⏳ Integração com CRM (RD Station/HubSpot) - TODO
- ⏳ Armazenamento em banco de dados - TODO

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd api
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Email (exemplo com Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contato@toldovela.com.br
EMAIL_PASSWORD=sua_senha_de_app_aqui
EMAIL_FROM=Toldo Vela <contato@toldovela.com.br>

# Recipients
EMAIL_CONTATO=contato@toldovela.com.br
EMAIL_COMERCIAL=comercial@toldovela.com.br
EMAIL_ARQUITETOS=arquitetos@toldovela.com.br
```

### 3. Configurar Email (Gmail)

Se usar Gmail, você precisa criar uma **senha de app**:

1. Acesse [Google Account Security](https://myaccount.google.com/security)
2. Ative a verificação em 2 etapas
3. Vá em "Senhas de app"
4. Gere uma senha para "Email"
5. Use essa senha no `EMAIL_PASSWORD`

### 4. Iniciar servidor

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

## 📡 Endpoints

### Health Check
```http
GET /api/health
```

Retorna status do servidor.

### Formulário de Contato
```http
POST /api/contato
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 91234-5678",
  "assunto": "Orçamento para cobertura",
  "mensagem": "Gostaria de um orçamento para..."
}
```

### Solicitação de Orçamento
```http
POST /api/orcamento
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 91234-5678",
  "empresa": "Empresa XYZ" (opcional),
  "tipo_projeto": "residencial",
  "area": "120" (opcional),
  "orcamento": "30k-50k" (opcional),
  "mensagem": "Projeto de cobertura para área de lazer"
}
```

### Solicitação de Amostras
```http
POST /api/amostras
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 91234-5678",
  "empresa": "Empresa XYZ" (opcional),
  "cep": "01310-100",
  "endereco": "Av. Paulista, 1000",
  "cidade": "São Paulo",
  "estado": "SP",
  "materiais": ["gale-pacific", "serge-ferrari"]
}
```

### Proposta de Parceria (Arquitetos)
```http
POST /api/parceria
Content-Type: application/json

{
  "nome": "Arq. João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 91234-5678",
  "empresa": "Silva Arquitetura",
  "tipo_registro": "CAU",
  "registro": "A12345-6",
  "cidade": "São Paulo",
  "estado": "SP",
  "descricao": "Escritório especializado em..." (opcional)
}
```

### Newsletter
```http
POST /api/newsletter
Content-Type: application/json

{
  "email": "joao@example.com",
  "page": "/metodo" (opcional)
}
```

## 🔒 Segurança

### Rate Limiting

- **Forms gerais:** 5 submissões a cada 15 minutos por IP
- **Newsletter:** 3 inscrições por hora por IP
- **API geral:** 100 requisições a cada 15 minutos por IP

### Validação

Todos os formulários possuem validação completa:
- Email válido
- Telefone no formato brasileiro
- Campos obrigatórios
- Tamanhos mínimos/máximos
- Sanitização de HTML
- Detecção de spam

### Headers de Segurança

Helmet configurado com:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## 📧 Configuração de Email

### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxx
```

### Amazon SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=AKIAXXXXXXX
EMAIL_PASSWORD=BxxxxxxxxxxxxxxxxxxxxX
```

## 🔗 Integração com Frontend

Atualize os arquivos JavaScript do frontend para apontar para a API:

```javascript
// Exemplo: site/scripts/contato.js

fetch('http://localhost:3000/api/contato', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    if (result.success) {
        window.location.href = result.redirectUrl;
    } else {
        alert(result.message);
    }
});
```

## 🚀 Deploy

### Opção 1: Heroku

```bash
# Login
heroku login

# Criar app
heroku create toldo-vela-api

# Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_USER=contato@toldovela.com.br
# ... outras variáveis

# Deploy
git push heroku main
```

### Opção 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Adicione as variáveis de ambiente no dashboard da Vercel.

### Opção 3: VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repo
git clone https://github.com/seu-repo/toldo-vela.git
cd toldo-vela/api

# Install dependencies
npm install --production

# Configure .env
nano .env

# Start with PM2
pm2 start server.js --name toldo-vela-api
pm2 save
pm2 startup
```

### Configurar Nginx (VPS)

```nginx
server {
    listen 80;
    server_name api.toldovela.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test
```

## 📊 Monitoramento

### Logs

Os logs são escritos no console. Em produção, configure um serviço de logging:

- **Heroku:** Use Papertrail ou Loggly
- **Vercel:** Logs automáticos no dashboard
- **VPS:** Use PM2 logs ou Winston

### Health Check

Configure monitoramento da rota `/api/health`:

- **UptimeRobot:** Gratuito para até 50 monitores
- **Pingdom:** Monitoramento profissional
- **New Relic:** APM completo

## 🔧 Próximas Implementações

- [ ] Integração com banco de dados (PostgreSQL/MySQL)
- [ ] Integração com RD Station
- [ ] Integração com HubSpot
- [ ] Sistema de filas para emails (Bull/Redis)
- [ ] Webhooks para notificações
- [ ] Dashboard admin para visualizar leads
- [ ] Testes unitários e de integração
- [ ] CI/CD com GitHub Actions

## 📞 Suporte

Para dúvidas sobre a API:
- Verifique os logs do servidor
- Teste os endpoints com Postman/Insomnia
- Verifique as configurações de email
- Consulte a documentação do Nodemailer

## 📝 Licença

MIT
