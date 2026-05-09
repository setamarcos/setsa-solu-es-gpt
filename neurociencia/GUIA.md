# Neurociência v1.1 - Base Completa Otimizada

Exercícios diários baseados em neurociência comportamental.

## 📂 Estrutura

```
neurociencia/
├── index.html       (Interface principal)
├── script.js        (Lógica do app)
├── style.css        (Design responsivo)
├── data.json        (20 exercícios)
└── .htaccess        (Acesso via /neurociencia)
```

## 🚀 Instalação Rápida

### 1. Configurar Acesso via `/neurociencia`

Crie arquivo `.htaccess` na pasta `neurociencia/`:

```apache
<IfModule mod_dir.c>
    DirectoryIndex index.html
</IfModule>

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /neurociencia/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>
```

**Resultado:** Acesse via `www.setasolucoes.com.br/neurociencia`

---

### 2. Configurar Google Sheets

**Planilha:** https://docs.google.com/spreadsheets/d/1lnpTsE38DSQT1giAtDZzC7ukGkFY3hHFxqFfkVlt4rQ/

Colunas obrigatórias:
- A: Timestamp
- B: Email
- C-I: Dados do exercício
- J: Nota (fórmula)
- K: Ponto_Melhora
- L: Analise_IA

---

### 3. Google Apps Script (Já Configurado)

Web App URL: https://script.google.com/macros/s/AKfycbz71lcPsaUo9ktgAIrDvCDl04IDNa91Uem3GmgANH7SFlBXM-oFtQ8COUmCAKRj4PJ35w/exec

---

## ✅ Como Funciona

1. **Login:** Digite email (sem OAuth complicado)
2. **Exercício:** Um por dia, automático por data
3. **Preenchimento:** Erro, Acerto, Sugestão, Progresso
4. **Salvamento:** Automático para Google Sheets
5. **Análise:** Nota, pontos de melhora, recomendações IA

---

## 📱 Suporta

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Todos os navegadores modernos

---

## 🔍 Troubleshooting

**Problema:** Erro ao login
- Abra console (F12)
- Veja os logs
- Verifique email válido

**Problema:** Dados não salvam
- Verifique SHEETS_URL em script.js
- Confirme permissões do Google Apps Script
- Teste conexão de internet

---

## 🤖 Próximas Fases

- [x] PASSO 1: Login Robusto ✅
- [ ] PASSO 2: Planilha com Automação
- [ ] PASSO 3: Integração com IA (Claude/GPT)
- [ ] PASSO 4: Dashboard de Desempenho

---

Criado com ❤️ por setamarcos
