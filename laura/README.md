# 🎓 Laura - Sistema de Mentoria de Redação v2.0

## 📋 Funcionalidades Implementadas

### ✅ Autenticação
- Login com Google
- Recuperação de sessão
- Logout seguro

### ✅ Captura de Redação
- OCR (Tesseract.js) para extrair texto de fotos do caderno
- Edição manual de texto
- Contadores em tempo real (palavras, frases, parágrafos)

### ✅ Gerador de Temas
- Temas diferentes por série (5º ao 9º ano)
- Sorteio aleatório
- Temas de alto nível com relevância vestibular

### ✅ Validações
- ✓ Deve ter título
- ✓ Entre 4 e 5 parágrafos
- ✓ Mínimo 3 frases por parágrafo
- ✓ Mínimo de palavras por série

### ✅ Análise Completa
- Detecção automática de erros (ortografia, pontuação, estrutura)
- Análise por série (critérios diferentes para 5º-9º)
- Orientações vestibulares
- Cálculo de nota (0-100)
- Feedback estruturado

### ✅ Relatório
- Data e título
- Número de palavras e frases
- Erros encontrados
- Avaliação geral
- Comentários personalizados
- Resumo executivo
- Gráficos de evolução

### ✅ Exportação
- PDF local
- XLS local + Google Drive (seu + usuário)
- Compartilhamento via WhatsApp
- Email de confirmação automático

---

## 🔧 Configuração

### 1. Google OAuth
1. Crie um projeto em Google Cloud Console
2. Configure OAuth 2.0 Client ID
3. Copie o Client ID e cole em `app.js` (variável `GOOGLE_CLIENT_ID`)

### 2. Apps Script
1. Crie um novo Apps Script
2. Cole o conteúdo de `apps-script.gs`
3. Publique como Aplicação Web
4. Copie a URL e atualize em `app.js`

### 3. Estrutura de Dados
Cada redação salva:
```json
{
  "data": "03/06/2026",
  "titulo": "Nome do Título",
  "palavras": 450,
  "frases": 15,
  "parafos": 4,
  "erros": 3,
  "nota": 85.5,
  "avaliacao": "Boa estrutura",
  "comentario": "Melhorar conectivos",
  "resumo": "Redação bem estruturada",
  "email": "usuario@gmail.com"
}
```

---

## 📱 Como Usar

### Passo 1: Login
1. Clique em "Entrar com Google"
2. Autorize e confirme

### Passo 2: Selecionar Série
1. Escolha seu nível acadêmico (5º-9º ano)
2. Clique em "Gerar Tema"

### Passo 3: Capturar Redação
**Opção A - Foto do Caderno:**
1. Tire uma foto clara do seu caderno
2. Upload da imagem
3. Espere o OCR processar

**Opção B - Colar Texto:**
1. Cole diretamente na textarea
2. Edite se necessário

### Passo 4: Análise
1. Clique em "Análise Completa"
2. Sistema valida automaticamente
3. Gera feedback detalhado

### Passo 5: Exportar
- **PDF**: Para impressão ou arquivo pessoal
- **XLS**: Salva no seu drive + drive do professor
- **WhatsApp**: Compartilha com coordenador/professor

---

## 📊 Critérios por Série

### 5º Ano
- Mín. 300 palavras
- Conectivos simples: e, mas, porque
- Foco em clareza

### 6º Ano
- Mín. 400 palavras
- Conectivos: portanto, além disso, contudo
- Introdução, desenvolvimento, conclusão

### 7º Ano
- Mín. 500 palavras
- Conectivos: outrossim, consequentemente, entretanto
- Argumentação simples

### 8º Ano
- Mín. 600 palavras
- Conectivos: indubitavelmente, similarmente
- Argumentação com exemplos

### 9º Ano
- Mín. 700 palavras
- Conectivos: incontestavelmente, concomitantemente
- Argumentação vestibular (ENEM)

---

## 🎯 Erros Detectados

- **Ortografia**: palavras com escrita incorreta
- **Pontuação**: uso incorreto de vírgulas, pontos
- **Estrutura**: problemas na construção de frases
- **Concordância**: sujeito/verbo, nome/adjetivo

---

## 📈 Gráficos

Mostra evolução em:
- Quantidade de palavras
- Quantidade de frases
- Erros corrigidos
- Notas ao longo do tempo

---

## 🔐 Segurança

- OAuth 2.0 com Google
- Dados salvos em Google Drive
- Criptografia de transmissão
- Compartilhamento seletivo por usuário

---

## 📞 Suporte

WhatsApp: (31) 98482-1901
Email: setamarcos@gmail.com

---

## 🚀 Próximas Atualizações

- [ ] App Android nativo
- [ ] App Windows Desktop
- [ ] IA para sugestões de melhorias
- [ ] Comparação de versões (histórico)
- [ ] Turmas virtuais para professores
- [ ] Integração com Classroom
