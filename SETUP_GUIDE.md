# Guia de Setup Completo - Toldo Vela Website

Guia passo a passo para configurar e lançar o website Toldo Vela.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Setup do Backend (API)](#setup-do-backend-api)
3. [Configuração de Integrações](#configuração-de-integrações)
4. [Atualização do Frontend](#atualização-do-frontend)
5. [Assets e Conteúdo](#assets-e-conteúdo)
6. [Testes](#testes)
7. [Deploy](#deploy)
8. [Checklist Final](#checklist-final)

---

## 🔧 Pré-requisitos

### Software Necessário
- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)

### Contas e Acessos
- [ ] Email profissional configurado (Gmail/Outlook/etc)
- [ ] Conta Google (para Analytics e Maps)
- [ ] Conta Meta/Facebook (para Pixel)
- [ ] Domínio registrado (ex: toldovela.com.br)
- [ ] Serviço de hospedagem escolhido

---

## 🖥️ Setup do Backend (API)

### 1. Instalar Dependências

```bash
cd api
npm install
```

### 2. Configurar Email

#### Opção A: Gmail (Recomendado para testes)

1. Acesse [Google Account Security](https://myaccount.google.com/security)
2. Ative "Verificação em 2 etapas"
3. Acesse "Senhas de app"
4. Selecione:
   - App: Email
   - Dispositivo: Outro (servidor)
5. Copie a senha gerada

#### Opção B: Email Corporativo

Consulte seu provedor de email para obter:
- SMTP host
- SMTP port
- Credenciais de autenticação

### 3. Criar Arquivo .env

```bash
cp .env.example .env
```

Edite `.env` e configure:

```env
# Servidor
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://toldovela.com.br

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contato@toldovela.com.br
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Senha de app do Gmail
EMAIL_FROM=Toldo Vela <contato@toldovela.com.br>

# Destinatários
EMAIL_CONTATO=contato@toldovela.com.br
EMAIL_COMERCIAL=comercial@toldovela.com.br
EMAIL_ARQUITETOS=arquitetos@toldovela.com.br

# CORS (adicione todos os domínios)
CORS_ORIGIN=https://toldovela.com.br,https://www.toldovela.com.br
```

### 4. Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000/api/health

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T...",
  "environment": "development",
  "version": "1.0.0"
}
```

### 5. Testar Envio de Email

Use Postman ou cURL:

```bash
curl -X POST http://localhost:3000/api/contato \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "seu-email@example.com",
    "telefone": "(11) 91234-5678",
    "assunto": "Teste de configuração",
    "mensagem": "Esta é uma mensagem de teste"
  }'
```

Verifique se você recebeu:
- ✅ Email de notificação (no email da empresa)
- ✅ Email de confirmação (no email fornecido)

---

## 🔗 Configuração de Integrações

### Google Analytics 4

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Criar propriedade:
   - Nome: Toldo Vela
   - Fuso horário: America/Sao_Paulo
   - Moeda: BRL
3. Criar stream de dados da Web:
   - URL: https://toldovela.com.br
   - Nome: Website Toldo Vela
4. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)
5. Adicione ao arquivo `site/config/analytics.js`:

```javascript
ga4: {
    enabled: true,
    measurementId: 'G-XXXXXXXXXX', // Cole seu ID aqui
    // ...
}
```

### Facebook Pixel

1. Acesse [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Criar Pixel:
   - Nome: Toldo Vela Website
3. Copie o **Pixel ID** (número de 15 dígitos)
4. Adicione ao arquivo `site/config/analytics.js`:

```javascript
facebookPixel: {
    enabled: true,
    pixelId: '123456789012345', // Cole seu Pixel ID aqui
    // ...
}
```

### Google Maps API

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Criar projeto: "Toldo Vela Website"
3. Ativar APIs:
   - Maps JavaScript API
   - Geocoding API (opcional)
4. Criar credenciais:
   - Tipo: API Key
   - Nome: Maps API Key
5. Restrições de segurança:
   - Restrições de aplicativo: Referências HTTP
   - Adicionar: `https://toldovela.com.br/*`
   - Adicionar: `https://www.toldovela.com.br/*`
   - Restrições de API: Maps JavaScript API
6. Copie a **API Key**
7. Adicione ao arquivo `.env` (backend):

```env
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
```

8. Adicione ao arquivo `site/config/analytics.js`:

```javascript
googleMaps: {
    apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXX',
    location: {
        lat: -23.550520, // Substitua pela latitude real
        lng: -46.633308, // Substitua pela longitude real
        address: 'Seu endereço completo aqui'
    },
    // ...
}
```

**Como obter latitude e longitude:**
1. Acesse [Google Maps](https://maps.google.com/)
2. Clique com botão direito no local
3. Clique em "Copiar coordenadas"
4. Use os valores no formato: `-23.550520, -46.633308`

---

## 🎨 Atualização do Frontend

### 1. Incluir Script de Analytics

Adicione no `<head>` de **todas as páginas HTML**:

```html
<!-- Analytics & Tracking -->
<script src="/config/analytics.js"></script>
```

### 2. Atualizar URLs da API

Em **todos os arquivos JavaScript** que fazem chamadas à API:

**Arquivos a atualizar:**
- `site/scripts/contato.js`
- `site/scripts/metodo.js`
- `site/scripts/materiais.js`
- `site/scripts/arquitetos.js`
- `site/scripts/main.js` (se houver formulários)

**Antes (desenvolvimento):**
```javascript
fetch('http://localhost:3000/api/contato', {
```

**Depois (produção):**
```javascript
fetch('https://api.toldovela.com.br/api/contato', {
// OU, se API estiver no mesmo servidor:
fetch('/api/contato', {
```

### 3. Inicializar Google Maps

Na página `contato.html`, certifique-se de que o elemento do mapa existe:

```html
<div id="map" class="contato-mapa__wrapper"></div>
```

E adicione no final da página (antes de `</body>`):

```html
<script>
    // Initialize Google Maps when page loads
    if (typeof initGoogleMaps === 'function') {
        initGoogleMaps('map');
    }
</script>
```

---

## 📦 Assets e Conteúdo

### Imagens Necessárias

Consulte `ASSETS_GUIDE.md` para lista completa. Principais:

#### 1. Portfólio (24+ projetos)
- Formato: JPG (alta qualidade)
- Tamanho: 1200x800px (proporção 3:2)
- Nomeação: `projeto-nome-categoria-thumb.jpg`
- Localização: `site/assets/images/portfolio/`

#### 2. Materiais
- Logos fornecedores (SVG): 3 arquivos
- Amostras de cores: 18 imagens (200x200px)
- Localização: `site/assets/images/materiais/`

#### 3. Equipe
- 4 fotos quadradas (500x500px)
- Fundo neutro, profissional
- Localização: `site/assets/images/equipe/`

#### 4. Certificações
- 6 logos/badges (PNG transparente)
- Tamanho: 200x200px
- Localização: `site/assets/images/certificacoes/`

#### 5. Vídeos
- Hero: MP4, 1920x1080, máx 30s
- Método: MP4, 1920x1080, 2-3min
- Localização: `site/assets/videos/`

### Otimização de Imagens

Use ferramentas online:
- [TinyPNG](https://tinypng.com/) - Compressão
- [Squoosh](https://squoosh.app/) - WebP + otimização
- [ImageOptim](https://imageoptim.com/) - Mac

Target:
- JPG/PNG: < 200KB cada
- WebP: 30-50% menor que JPG
- Vídeos: < 5MB

---

## 🧪 Testes

### Checklist de Testes

#### Funcionalidade
- [ ] Todos os formulários enviam corretamente
- [ ] Emails de notificação chegam
- [ ] Emails de confirmação chegam
- [ ] Validação de campos funciona
- [ ] Rate limiting funciona (testar múltiplos envios)
- [ ] WhatsApp buttons abrem corretamente
- [ ] Links de telefone funcionam
- [ ] Links de email funcionam
- [ ] Navegação entre páginas funciona
- [ ] Filtros do portfólio funcionam
- [ ] Busca do portfólio funciona
- [ ] FAQ accordion funciona
- [ ] Animações rodam suavemente

#### Responsividade
- [ ] Desktop 1920px
- [ ] Desktop 1280px
- [ ] Tablet 768px (landscape e portrait)
- [ ] Mobile 414px (iPhone)
- [ ] Mobile 375px (iPhone SE)
- [ ] Mobile 360px (Android)

#### Performance
- [ ] PageSpeed Score > 85
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

Teste em: [PageSpeed Insights](https://pagespeed.web.dev/)

#### SEO
- [ ] Todas as páginas têm title único
- [ ] Todas as páginas têm meta description
- [ ] Todas as imagens têm alt text
- [ ] Schema.org markup presente
- [ ] Open Graph tags presentes
- [ ] Sitemap.xml criado
- [ ] Robots.txt configurado

#### Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] Leitores de tela funcionam
- [ ] Contraste de cores adequado
- [ ] ARIA labels presentes
- [ ] Focus indicators visíveis

Teste em: [WAVE Tool](https://wave.webaim.org/)

#### Cross-Browser
- [ ] Chrome (desktop + mobile)
- [ ] Firefox
- [ ] Safari (desktop + iOS)
- [ ] Edge

---

## 🚀 Deploy

### Opção 1: Vercel (Recomendado - Fácil)

**Frontend:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd site
vercel --prod
```

**Backend:**
```bash
# Deploy API
cd api
vercel --prod
```

Configure no dashboard:
- Variáveis de ambiente (.env)
- Domínio customizado

**Vantagens:**
- Setup instantâneo
- SSL automático
- CDN global
- Deploy automático no Git push

### Opção 2: Netlify (Alternativa ao Vercel)

1. Conecte repositório GitHub
2. Configure build:
   - Base directory: `site`
   - Publish directory: `site`
3. Adicione variáveis de ambiente
4. Configure domínio customizado

### Opção 3: VPS (Controle Total)

**Requisitos:**
- Ubuntu 20.04+
- 2GB RAM mínimo
- Node.js 18+
- Nginx

**Setup:**
```bash
# Conecte ao servidor
ssh root@seu-servidor.com

# Atualize sistema
apt update && apt upgrade -y

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instale PM2
npm install -g pm2

# Instale Nginx
apt install -y nginx

# Clone repositório
git clone https://github.com/seu-repo/toldo-vela.git /var/www/toldo-vela
cd /var/www/toldo-vela

# Configure API
cd api
npm install --production
cp .env.example .env
nano .env  # Configure variáveis

# Inicie API com PM2
pm2 start server.js --name toldo-vela-api
pm2 save
pm2 startup

# Configure Nginx
nano /etc/nginx/sites-available/toldovela
```

**Configuração Nginx:**
```nginx
# Frontend
server {
    listen 80;
    server_name toldovela.com.br www.toldovela.com.br;
    root /var/www/toldo-vela/site;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache para assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API
server {
    listen 80;
    server_name api.toldovela.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Ativar e SSL:**
```bash
# Ativar site
ln -s /etc/nginx/sites-available/toldovela /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Instalar SSL (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d toldovela.com.br -d www.toldovela.com.br -d api.toldovela.com.br
```

---

## ✅ Checklist Final

### Antes do Lançamento

#### Configuração
- [ ] Backend rodando em produção
- [ ] Variáveis de ambiente configuradas
- [ ] Emails testados e funcionando
- [ ] Analytics configurado (GA4)
- [ ] Facebook Pixel configurado
- [ ] Google Maps funcionando
- [ ] CORS configurado corretamente
- [ ] SSL/HTTPS ativo

#### Conteúdo
- [ ] Todos os textos revisados
- [ ] Imagens otimizadas e carregadas
- [ ] Vídeos otimizados e carregados
- [ ] Informações de contato corretas
- [ ] Links de redes sociais corretos
- [ ] WhatsApp number correto

#### SEO
- [ ] Meta tags em todas as páginas
- [ ] Sitemap.xml criado e submetido
- [ ] Google Search Console configurado
- [ ] robots.txt configurado
- [ ] Schema markup verificado

#### Legal
- [ ] Política de Privacidade criada
- [ ] Termos de Uso criados
- [ ] LGPD compliance verificado
- [ ] Cookie consent (se aplicável)

### Pós-Lançamento

#### Monitoramento
- [ ] Google Analytics configurado e testado
- [ ] Google Search Console verificando indexação
- [ ] Uptime monitoring ativo (UptimeRobot)
- [ ] Error tracking configurado (Sentry - opcional)

#### Marketing
- [ ] Redes sociais atualizadas com novo site
- [ ] Email signature atualizado
- [ ] Google My Business atualizado
- [ ] Anúncio do lançamento preparado

#### Backup
- [ ] Sistema de backup configurado
- [ ] Backup inicial criado
- [ ] Procedimento de restore testado

---

## 📞 Suporte

### Problemas Comuns

**Emails não estão sendo enviados:**
1. Verifique credenciais no `.env`
2. Confirme que porta 587 está aberta
3. Verifique logs do servidor: `pm2 logs`
4. Teste conexão SMTP: `telnet smtp.gmail.com 587`

**Formulários não funcionam:**
1. Verifique CORS no backend
2. Confirme URL da API no frontend
3. Abra DevTools (F12) e verifique console
4. Teste endpoint direto com Postman

**Google Maps não carrega:**
1. Verifique API key no analytics.js
2. Confirme que Maps API está ativada
3. Verifique restrições da API key
4. Abra console e veja erros

**Analytics não rastreia:**
1. Verifique se analytics.js está incluído
2. Confirme Measurement ID correto
3. Use Google Tag Assistant para debug
4. Aguarde 24-48h para dados aparecerem

---

## 📚 Recursos Adicionais

- [Documentação API](api/README.md)
- [Guia de Assets](ASSETS_GUIDE.md)
- [Resumo de Progresso](PROGRESS_SUMMARY.md)
- [Nodemailer Docs](https://nodemailer.com/)
- [Express.js Docs](https://expressjs.com/)
- [Google Analytics Docs](https://developers.google.com/analytics)

---

**🎉 Parabéns! Seu website Toldo Vela está pronto para decolar!**
