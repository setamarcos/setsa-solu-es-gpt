function gerarAlbum() {
  const nome = document.getElementById("nomeLocal").value || "Local Genérico";
  const cidade = document.getElementById("cidade").value || "Cidade";
  const tipo = document.getElementById("tipo").value || "Comunidade";
  const qtde = parseInt(document.getElementById("qtde").value) || 12;
  const paleta = document.getElementById("paleta").value;

  document.body.style.setProperty('--paleta-fundo', paleta);

  const printArea = document.getElementById("print-area");
  printArea.innerHTML = "";

  // Capa
  const capa = createPage("capa", `
    <div class="page-content">
      <h1>${nome.toUpperCase()}</h1>
      <p class="subtitulo">${cidade} · ${tipo}</p>
      <p class="editorial">Uma história dentro e fora das quatro linhas.</p>
    </div>
  `);
  printArea.appendChild(capa);

  // História
  const historia = createPage("historia", `
    <div class="page-content">
      <h2>Nossa História</h2>
      <p>${nome} em ${cidade} é mais que um ${tipo}. 
      É um espaço de convivência, onde gerações se encontram, 
      histórias se cruzam e momentos inesquecíveis acontecem.</p>
    </div>
  `);
  printArea.appendChild(historia);

  // Miolo
  let figurinhasHTML = "";
  for (let i = 0; i < qtde; i++) {
    figurinhasHTML += `
      <div class="figurinha-slot">
        <div class="img-box">[Imagem IA]</div>
        <div class="tarja-azul">
          <div class="nome">Figurinha ${i + 1}</div>
          <div class="numero">N° ${i + 1}</div>
        </div>
      </div>`;
  }

  const miolo = createPage("miolo", `
    <div class="page-content">
      <h3>Nosso Time</h3>
      <div class="grid">${figurinhasHTML}</div>
    </div>
  `);
  printArea.appendChild(miolo);

  // Contracapa
  const contracapa = createPage("contracapa", `
    <div class="page-content">
      <h2>Mensagem Final</h2>
      <p>${nome} — mais que um ${tipo}, um espaço de histórias que continuam sendo escritas todos os dias.</p>
    </div>
  `);
  printArea.appendChild(contracapa);
}

function createPage(classe, conteudo) {
  const page = document.createElement("div");
  page.className = `page ${classe}`;
  page.innerHTML = conteudo;
  return page;
}
