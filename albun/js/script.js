// === CONFIGURAÇÕES DE TEMAS ===
const TEMAS = {
  futebol: {
    titulo: "CRAQUES DA BOLA",
    subtitulo: "Escola de Futebol · Turma 2026",
    historia: "Na Escola de Futebol Craques da Bola, vivemos grandes emoções em campo. Cada treino foi uma lição, cada jogo, uma aventura! Celebramos nossas vitórias, nossa amizade e o espírito de equipe que nos une.",
    editorial: "O trabalho em equipe transforma sonhos em conquistas.",
    legendas: ["Goleiro", "Zagueiro", "Lateral", "Meio Campo", "Atacante", "Técnico", "Capitão", "Treinador", "Artilheiro", "Craque", "Revelação", "Torcedor"]
  },
  escola: {
    titulo: "MEMÓRIAS DO ENSINO MÉDIO",
    subtitulo: "Turma 2026 · Uma história que não termina",
    historia: "Entre provas, risadas e sonhos, construímos memórias que o tempo não apaga.",
    editorial: "Amizades forjadas no recreio duram para toda vida.",
    legendas: ["Diretora", "Professor", "Aluno Destaque", "Artista", "Atleta", "Líder", "Representante", "Rainha da Turma", "Músico", "Escritor", "Capitão", "Sonhador"]
  }
};

// === VARIÁVEIS ===
let imagens = Array(12).fill(null);
let nomes = Array(12).fill('');
let paginasGeradas = [];

// === INICIALIZAÇÃO ===
function initUploadGrid() {
  const qtde = parseInt(document.getElementById('qtde').value);
  const uploadGrid = document.getElementById('uploadGrid');
  uploadGrid.innerHTML = '';
  imagens = Array(qtde).fill(null);
  nomes = Array(qtde).fill('');

  for (let i = 0; i < qtde; i++) {
    const slot = document.createElement('div');
    slot.className = 'upload-slot';
    slot.innerHTML = `
      <div class="posicao">POSIÇÃO ${i + 1}</div>
      <div class="preview"></div>
      <input type="text" placeholder="Nome" data-idx="${i}">
      <div class="file-input">
        <button>Escolher arquivo</button>
        <input type="file" accept="image/*" data-idx="${i}">
      </div>`;
    uploadGrid.appendChild(slot);
  }
  bindUploadEvents();
}

// === EVENTOS DE UPLOAD ===
function bindUploadEvents() {
  document.querySelectorAll('.upload-slot input[type="file"]').forEach(input => {
    input.onchange = e => {
      const idx = e.target.getAttribute('data-idx');
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        imagens[idx] = ev.target.result;
        const slot = e.target.closest('.upload-slot');
        slot.classList.add('filled');
        slot.querySelector('.preview').innerHTML = `<img src="${ev.target.result}">`;
      };
      reader.readAsDataURL(file);
    };
  });

  document.querySelectorAll('.upload-slot input[type="text"]').forEach(input => {
    input.oninput = e => {
      nomes[e.target.getAttribute('data-idx')] = e.target.value;
    };
  });
}

// === GERAR ÁLBUM ===
function gerarAlbum() {
  const temaSelecionado = document.getElementById('tema').value;
  const tema = TEMAS[temaSelecionado];
  const qtde = parseInt(document.getElementById('qtde').value);
  const printArea = document.getElementById('print-area');
  printArea.innerHTML = '';
  paginasGeradas = [];

  // Capa
  const capa = createPage('capa');
  capa.innerHTML = `
    <div class="page-content">
      <h1>${tema.titulo}</h1>
      <p class="subtitulo">${tema.subtitulo}</p>
      <p class="editorial">${tema.editorial}</p>
    </div>`;
  printArea.appendChild(capa);
  paginasGeradas.push({ id: 'capa', nome: 'Capa' });

  // História
  const intro = createPage('intro');
  intro.innerHTML = `
    <div class="page-content">
      <h2>Nossa História</h2>
      <p>${tema.historia}</p>
    </div>`;
  printArea.appendChild(intro);
  paginasGeradas.push({ id: 'intro', nome: 'Introdução' });

  // Miolo
  const miolo = createPage('miolo');
  let figurinhasHTML = '';
  for (let i = 0; i < qtde; i++) {
    const img = imagens[i] ? `<img src="${imagens[i]}">` : '';
    const nome = nomes[i] || tema.legendas[i] || 'Sem Nome';
    figurinhasHTML += `
      <div class="figurinha-slot">
        <div class="img-box">${img}</div>
        <div class="tarja-azul">
          <div class="nome">${nome}</div>
          <div class="numero">N° ${i + 1}</div>
        </div>
      </div>`;
  }
  miolo.innerHTML = `<div class="page-content"><h3>Nosso Time</h3><div class="grid">${figurinhasHTML}</div></div>`;
  printArea.appendChild(miolo);
  paginasGeradas.push({ id: 'miolo', nome: 'Miolo' });

  showPrintSelector();
}

// === FUNÇÕES AUXILIARES ===
function createPage(classe) {
  const page = document.createElement('div');
  page.className = `page ${classe}`;
  return page;
}

function showPrintSelector() {
  const selector = document.getElementById('printSelector');
  const checkDiv = document.getElementById('paginasCheck');
  checkDiv.innerHTML = '';
  paginasGeradas.forEach(p => {
    checkDiv.innerHTML += `<label><input type="checkbox" value="${p.id}" checked> ${p.nome}</label>`;
  });
  selector.style.display = 'block';
}

function imprimirSelecionadas() {
  const checks = document.querySelectorAll('#paginasCheck input:checked');
  const ids = Array.from(checks).map(c => c.value);
  document.querySelectorAll('.page').forEach((page, i) => {
    if (ids.indexOf(paginasGeradas[i].id) === -1) {
      page.classList.add('no-print');
    } else {
      page.classList.remove('no-print');
    }
  });
  setTimeout(() => { window.print(); }, 300);
}

// === INICIALIZAÇÃO AUTOMÁTICA ===
initUploadGrid();