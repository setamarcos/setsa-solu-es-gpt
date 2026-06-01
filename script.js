<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Comercial</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/script.js" defer></script>
</head>
<body>
  <header>
    <img src="img/logo-mp.png" alt="Logo MP" class="logo">
    <h1>Proposta nº <span id="numero"></span>/<span id="ano"></span></h1>
    <p>Contagem, <span id="data"></span></p>
  </header>

  <section>
    <p>À <span id="cliente"></span></p>
    <p>Prezado(a) <span id="destinatario"></span></p>
    <p><strong>Ref.</strong> <span id="referencia"></span></p>
  </section>

  <section>
    <p id="introducao"></p>
    <ul id="normas"></ul>
  </section>

  <section>
    <h2>Escopo dos Serviços</h2>
    <div id="escopo"></div>
  </section>

  <section>
    <h2>Lista de Materiais</h2>
    <table id="materiais"></table>
  </section>

  <section>
    <h2>Valores da Proposta</h2>
    <p>Mão de obra: <span id="valorMaoObra"></span></p>
    <p>Materiais: <span id="valorMaterial"></span></p>
    <p>Prazo: <span id="prazo"></span></p>
    <p>Forma de Pagamento: <span id="formaPagamento"></span></p>
  </section>

  <footer>
    <p>Garantia: <span id="garantia"></span></p>
    <p>Validade: <span id="validade"></span></p>
    <p>Aceite: <span id="aceite"></span></p>
    <p>Assinatura: <span id="responsavel"></span></p>
  </footer>

  <section>
    <button onclick="startVoiceInput()">🎤 Falar</button>
    <button onclick="exportDocx()">📄 Gerar DOCX</button>
    <button onclick="exportPdf()">📕 Gerar PDF</button>
    <button onclick="saveData()">💾 Salvar</button>
    <button onclick="loadXls()">📂 Carregar XLS</button>
    <button onclick="clearForm()">🧹 Limpar</button>
  </section>
</body>
</html>

