# 🚀 Toldo Vela - Quick Start Guide

Guia rápido para colocar o site no ar em produção.

---

## ⚡ Setup Rápido (30 minutos)

### 1. Configurar Backend (10min)

```bash
# 1. Entre na pasta da API
cd api

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env
nano .env
```

**Mínimo necessário no .env:**
```env
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com.br

# Email (Gmail como exemplo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contato@toldovela.com.br
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=Toldo Vela <contato@toldovela.com.br>

EMAIL_CONTATO=contato@toldovela.com.br

CORS_ORIGIN=https://seu-dominio.com.br
```

```bash
# 4. Teste localmente
npm run dev

# Abra: http://localhost:3000/api/health
# Deve retornar: {"status":"ok",...}
```

### 2. Configurar Integrações (10min)

**Arquivo:** `site/config/analytics.js`

```javascript
// 1. Google Analytics 4
ga4: {
    measurementId: 'G-XXXXXXXXXX', // Substitua
}

// 2. Facebook Pixel
facebookPixel: {
    pixelId: '123456789012345', // Substitua
}

// 3. Google Maps
googleMaps: {
    apiKey: 'AIzaSyXXXXXXXXXXXXXX', // Substitua
    location: {
        lat: -23.550520, // Sua latitude
        lng: -46.633308, // Sua longitude
        address: 'Seu endereço completo'
    }
}
```

### 3. Atualizar Frontend (5min)

**Em TODOS os arquivos .js que fazem fetch:**

- `site/scripts/contato.js`
- `site/scripts/metodo.js`
- `site/scripts/materiais.js`
- `site/scripts/arquitetos.js`

**Mudar de:**
```javascript
fetch('http://localhost:3000/api/contato', {
```

**Para:**
```javascript
fetch('https://api.seu-dominio.com.br/api/contato', {
// OU, se API estiver no mesmo servidor:
fetch('/api/contato', {
```

**Adicionar em TODAS as páginas HTML (no `<head>`):**
```html
<script src="/config/analytics.js"></script>
```

### 4. Deploy (5min)

**Opção A - Vercel (Mais Fácil):**

```bash
# Instalar CLI
npm i -g vercel

# Deploy Frontend
cd site
vercel --prod

# Deploy Backend
cd ../api
vercel --prod
```

Configure variáveis de ambiente no dashboard Vercel.

**Opção B - VPS/Servidor:**

Ver `SETUP_GUIDE.md` para instruções completas.

---

## ✅ Checklist Mínimo

### Antes de Lançar

- [ ] Backend rodando e acessível
- [ ] Email configurado e testado (enviar 1 teste)
- [ ] CORS configurado com domínio correto
- [ ] Analytics IDs configurados (GA4, Pixel, Maps)
- [ ] Analytics.js incluído em todas as páginas
- [ ] URLs da API atualizadas no frontend
- [ ] SSL/HTTPS configurado
- [ ] Domínio apontado corretamente
- [ ] Testar 1 formulário end-to-end

### Testes Rápidos

1. **Teste Formulário:**
   - Preencher formulário de contato
   - Enviar
   - Verificar se chegou email na empresa
   - Verificar se chegou confirmação no email informado
   - Verificar redirect para /obrigado

2. **Teste Analytics:**
   - Abrir site
   - Abrir GA4 Real-Time
   - Verificar se apareceu 1 visitante
   - Enviar formulário
   - Verificar se evento apareceu

3. **Teste Maps:**
   - Abrir página /contato
   - Verificar se mapa carregou
   - Verificar se marcador está no lugar certo

---

## 🔥 Deploy Ultra-Rápido (Vercel)

### Frontend + Backend em 5 minutos

```bash
# 1. Login
npx vercel login

# 2. Deploy tudo
cd /caminho/para/TOLDOVELA
npx vercel --prod
```

Quando perguntar:
- **Set up and deploy?** → Yes
- **Which scope?** → Seu usuário
- **Link to existing project?** → No
- **Project name?** → toldo-vela
- **Directory?** → ./site
- **Override settings?** → No

Depois, deploy da API:
```bash
cd api
npx vercel --prod
```

No dashboard Vercel:
1. Adicione variáveis do `.env`
2. Configure domínio customizado
3. Pronto!

---

## 📱 Contatos de Teste

Use estes para testar formulários:

**Formulário de Contato:**
```json
{
  "nome": "João Teste",
  "email": "seu-email@gmail.com",
  "telefone": "(11) 91234-5678",
  "assunto": "Teste de configuração",
  "mensagem": "Teste de envio de formulário"
}
```

**cURL para testar API diretamente:**
```bash
curl -X POST https://api.seu-dominio.com.br/api/contato \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "seu-email@gmail.com",
    "telefone": "(11) 91234-5678",
    "assunto": "Teste",
    "mensagem": "Mensagem de teste do sistema"
  }'
```

---

## 🆘 Problemas Comuns

### ❌ Email não chega

**Causa mais comum:** Senha de app do Gmail incorreta

**Solução:**
1. Vá em https://myaccount.google.com/apppasswords
2. Gere nova senha para "Email"
3. Use essa senha (16 caracteres) no `.env`
4. Reinicie servidor

### ❌ CORS Error

**Erro no console:** `Access-Control-Allow-Origin`

**Solução:**
1. Abra `.env` no backend
2. Adicione: `CORS_ORIGIN=https://seu-dominio.com.br`
3. Reinicie servidor

### ❌ Google Maps não carrega

**Solução:**
1. Verifique se colocou API key em `analytics.js`
2. Verifique se ativou "Maps JavaScript API" no Google Cloud
3. Aguarde 5 minutos (propagação)

### ❌ Analytics não rastreia

**Solução:**
1. Verifique se incluiu `<script src="/config/analytics.js"></script>`
2. Abra DevTools (F12) → Console
3. Deve ver: "✓ Google Analytics 4 initialized"
4. Aguarde 24h para dados aparecerem (Real-Time é instantâneo)

---

## 📞 Suporte

**Documentação completa:**
- Setup detalhado: `SETUP_GUIDE.md`
- API docs: `api/README.md`
- Resumo Fase 2: `FASE2_SUMMARY.md`

**Debug rápido:**
```bash
# Ver logs do backend
pm2 logs toldo-vela-api

# Testar conexão
curl https://seu-dominio.com.br/api/health

# Ver status
pm2 status
```

---

## 🎉 Pronto!

Se todos os checkmarks acima estão ✅, seu site está no ar!

**Próximos passos:**
1. Adicionar conteúdo real (imagens, textos)
2. Monitorar analytics por 1 semana
3. Ajustar SEO baseado em dados
4. Fazer melhorias baseadas em feedback

**Métricas de sucesso (primeiros 30 dias):**
- Taxa de conversão > 3%
- Tempo médio > 2 minutos
- Bounce rate < 50%
- 10+ leads por formulários

---

**Boa sorte com o lançamento! 🚀**
