# PASSO 2: Estrutura da Planilha + Automação Google Sheets

## 📋 Configurar Planilha Google Sheets

### 1️⃣ Criar Headers (Colunas A-L)

Abra sua planilha e na **linha 1**, crie esses headers:

```
A: Timestamp
B: Email
C: Numero
D: Pergunta
E: Resposta
F: Erro
G: Acerto
H: Sugestao
I: Progresso
J: Nota
K: Ponto_Melhora
L: Analise_IA
```

**Ou copie e cole tudo de uma vez:**
```
Timestamp	Email	Numero	Pergunta	Resposta	Erro	Acerto	Sugestao	Progresso	Nota	Ponto_Melhora	Analise_IA
```

---

### 2️⃣ Configurar Google Apps Script

1. Abra sua planilha
2. Clique em **Extensões** > **Apps Script**
3. Delete o código padrão
4. Cole o código de `apps-script.js`
5. Clique em **Salvar** (Ctrl+S)

---

### 3️⃣ Executar Inicialização

1. Na barra superior, selecione a função **inicializar**
2. Clique em **Executar** ▶️
3. Autorize quando pedir
4. Pronto! Headers foram criados

---

### 4️⃣ Deploy como Web App

1. Clique em **Deploy** (botão azul superior direito)
2. Selecione **"Novo Deploy"** (⚙️)
3. Tipo: **Web app**
4. Configurar:
   - Executar como: **SUA CONTA GOOGLE**
   - Quem tem acesso: **Qualquer pessoa**
5. Clique em **Deploy**
6. **Copie a URL** que aparece
7. Atualize `script.js` com essa URL em:
   ```javascript
   const SHEETS_URL = "COLE_AQUI_A_URL";
   ```

---

## 🤖 Automação - O que Acontece Automaticamente

### **Coluna J: NOTA (0-10)**

Cálculo automático:
- **Progresso (até 4 pontos):** (Progresso/9) × 4
- **Erro preenchido (2 pontos):** Se preencheu o campo
- **Acerto preenchido (2 pontos):** Se preencheu o campo
- **Sugestão qualidade (1 ponto):** Se > 20 caracteres
- **Bônus (1 ponto):** Se todos preenchidos bem

**Exemplo:**
```
Progresso: 7 → 3.1 pontos
Erro: "Procrastinei" → 2 pontos
Acerto: "Comecei pequeno" → 2 pontos
Sugestão: "Fazer pausas frequentes" → 1 ponto
Bônus: ✅ → 1 ponto
────────────────────────────
NOTA TOTAL: 9.1 ⭐
```

---

### **Coluna K: PONTO DE MELHORA**

Extrai automaticamente a **primeira frase** da sugestão:
```
Sugestão: "Fazer pausas mais frequentes. Tomar água. Caminhar um pouco."
Ponto: "Fazer pausas mais frequentes."
```

---

### **Coluna L: ANÁLISE IA**

Link para análise automática (próximo passo):
```
🤖 Analisar
```

---

## ✅ Checklist Final

- [ ] Headers criados (A-L)
- [ ] Apps Script colado e salvo
- [ ] Função `inicializar()` executada
- [ ] Web App deployado
- [ ] URL copiada para `script.js`
- [ ] Testou login no site
- [ ] Preencheu exercício
- [ ] Clicou "Salvar"
- [ ] Dados aparecem na planilha ✅
- [ ] Coluna J mostra nota automática ✅
- [ ] Coluna K mostra ponto de melhora ✅

---

## 🧪 Teste Rápido

1. Acesse: www.setasolucoes.com.br/neurociencia
2. Digite: seu@email.com
3. Preencha tudo (até "Salvar")
4. Vá para a planilha
5. Veja a nova linha aparecer com:
   - ✅ Email
   - ✅ Dados do exercício
   - ✅ **NOTA calculada**
   - ✅ **Ponto de melhora extraído**

---

## 🐛 Troubleshooting

**Problema:** Erro ao clicar "Salvar"
```
Solução:
1. Verifique a URL do Apps Script em script.js
2. Confirme que fez Deploy como "Web app"
3. Verifique permissões (acesso público)
```

**Problema:** Nota não calcula
```
Solução:
1. Execute novamente a função inicializar()
2. Verifique se a planilha tem dados corretos
```

**Problema:** Apps Script dá erro
```
Solução:
1. Abra Apps Script > Execução
2. Veja os logs de erro
3. Me mostre a mensagem de erro
```

---

## ⏭️ Próximo Passo (PASSO 3)

Quando tudo funcionar, vamos integrar **IA (Claude/OpenAI)**:
- Análise automática de respostas
- Feedback personalizado
- Recomendações de melhora
- Dashboard de desempenho

---

**Tudo pronto! Teste e me avisa quando funcionar!** 🚀
