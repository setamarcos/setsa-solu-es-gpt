# 🚀 Prospecção e Governança MP - Automação v1.1

## 📋 Documentação Técnica

### ✅ O que foi implementado:

#### **Web (Responsivo)**
- ✅ Formulário inteligente com validações
- ✅ Histórico local de clientes (IndexedDB/LocalStorage)
- ✅ WhatsApp pré-preenchido com dados do cliente
- ✅ Sincronização automática com Google Sheets
- ✅ Modo offline - salva local e sincroniza quando online
- ✅ Exportar clientes em CSV/XLS
- ✅ Notificações do navegador
- ✅ Status online/offline em tempo real

#### **Google Sheets Integration**
- ✅ Apps Script que recebe dados do formulário
- ✅ Salva em planilha com timestamp
- ✅ Envia email de notificação
- ✅ Funções para ler dados (API)
- ✅ Atualização de status dos prospects

---

## 🔧 Configuração

### 1. **Atualizar URL do Apps Script**

Você precisa publicar seu Apps Script como API Web:

1. Abra seu Google Apps Script: https://script.google.com
2. Cole o conteúdo de `apps-script.gs`
3. Clique em **Implementar → Nuevo implementación → Aplicación web**
4. Autorize e copie a URL gerada
5. Cole em `app.js` na variável `URL_SCRIPT`

### 2. **Estrutura da Google Sheet**

Sua planilha deve ter uma aba chamada **"CLIENTES"** com colunas:

```
A: Data
B: Hora
C: ID (gerado automaticamente)
D: Cliente
E: Telefone
F: Tipo
G: Observação
H: Retorno
I: Status
J: Origem
```

---

## 📱 Como Usar

### **Web (www.setasolucoes.com.br/prospect-governanca-mp/)**

1. Preencha o formulário
2. Clique em **SALVAR CLIENTE**
3. Dados salvam localmente + sincronizam com Google Sheets
4. Clique em **FALAR NO WHATSAPP** - abre conversa com dados pré-preenchidos
5. Clique em **EXPORTAR XLS** - baixa CSV dos clientes
6. Histórico mostra últimos 10 clientes com status ✅ ou ⏳

### **Modo Offline**
- Sem internet? Sem problema! Salva localmente
- Quando conectar, clique **SINCRONIZAR** para enviar ao Google

---

## 🤖 Integração WhatsApp

O botão abre WhatsApp automático com:
- Link: `https://wa.me/5531984821901`
- Mensagem pré-preenchida com dados do cliente
- Seu número: `31 98482-1901`

---

## 📊 Dados Salvos

Cada prospect salva:
```json
{
  "id": "prospect_1717384000000_abc123",
  "cliente": "Nome da Empresa",
  "telefone": "(31) 98482-1901",
  "tipo": "CONSTRUTORA",
  "observacao": "Interesse em governança",
  "retorno": "2026-06-10",
  "dataHora": "03/06/2026 14:30:45",
  "status": "novo"
}
```

---

## 🔄 Sincronização

### Local → Google Sheets
```
Automática: Ao salvar com internet
Manual: Botão SINCRONIZAR
Automática offline: Quando reconectar
```

### Google Sheets → Local
```
Lê automaticamente via Apps Script
Função: lerClientes() - GET /api/clientes
```

---

## 📲 Android App (Próximo)

Será criado com:
- ✅ Acesso offline-first
- ✅ Sincronização automática
- ✅ Notificações push de retorno
- ✅ Um-click WhatsApp
- ✅ QR Code para compartilhar contato

---

## 🖥️ Windows Desktop App (Próximo)

Com Electron:
- ✅ App nativo para Windows
- ✅ Monitora Google Sheets
- ✅ Notificações de novo prospect
- ✅ Botão 1-click chamar WhatsApp
- ✅ Sincronização automática

---

## 🔐 Segurança

- Apps Script usa autenticação OAuth do Google
- LocalStorage armazena dados localmente
- IDs únicos para rastrear prospects
- CORS habilitado para requisições cross-origin

---

## 📞 Suporte

WhatsApp: (31) 98482-1901
Email: setamarcos@gmail.com

---

## 📝 Changelog v1.1

- ✅ Adicionado Service Worker (offline)
- ✅ Histórico local de clientes
- ✅ Exportar para XLS/CSV
- ✅ Status online/offline
- ✅ Sincronização em background
- ✅ Validações melhoradas
- ✅ Notificações push
- ✅ WhatsApp integrado
- ✅ Apps Script melhorado com email
