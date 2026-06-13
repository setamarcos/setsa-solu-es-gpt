// ============================================
// CONFIGURAÇÃO DA API GEMINI
// IMPORTANTE: COLE SUA CHAVE AQUI ENTRE AS ASPAS
// ============================================


const TEMAS = {
  futebol: { titulo: "ESQUADRÃO IMORTAL", subtitulo: "Temporada 2026 · Rumo ao título", historias: ["Mais que um time, uma irmandade. Este álbum registra a garra, os gols e a resenha do vestiário que nos fez campeões dentro e fora de campo.","Entre treinos na chuva e vitórias no domingo, construímos uma família. Cada rosto aqui suou a camisa e honrou o manto sagrado."], editorial: "O suor de hoje é o troféu de amanhã.", legendas: ["Goleiro Titular","Lateral Direito","Zagueiro","Lateral Esquerdo","Volante","Meio Campo","Meia Atacante","Ponta Direita","Centroavante","Ponta Esquerda","Técnico","Capitão"] },
  escola: { titulo: "MEMÓRIAS DO ENSINO MÉDIO", subtitulo: "Turma 2026 · Uma história que não termina", historias: ["Este álbum guarda os rostos, os sorrisos e as histórias de uma jornada única. Entre provas, risadas no corredor e sonhos compartilhados, construímos memórias que o tempo não apaga.","Cada figurinha aqui representa mais que um colega: representa um capítulo da nossa juventude. Que este registro seja ponte entre o que vivemos e o que ainda vamos viver."], editorial: "Amizades forjadas no recreio duram para toda vida.", legendas: ["Diretora","Coordenador","Prof. Matemática","Prof. Português","Prof. História","Representante","Aluno Destaque","Capitão do Time","Rainha da Turma","Artista da Sala","Músico","Escritor"] },
  igreja: { titulo: "NOSSA COMUNIDADE DE FÉ", subtitulo: "Unidos em propósito e amor", historias: ["Este álbum celebra a família que escolhemos pela fé. Cada rosto aqui representa orações compartilhadas, cultos memoráveis e serviço ao próximo.","Somos um corpo com muitos membros. Este registro honra cada irmão e irmã que caminha conosco na jornada da fé e do amor."], editorial: "Onde dois ou três estão reunidos, ali está o amor.", legendas: ["Pastor","Pastora","Diácono","Diaconisa","Líder de Louvor","Músico","Professor EBD","Coordenador","Intercessor","Recepção","Juventude","Crianças"] },
  casamento: { titulo: "O GRANDE DIA", subtitulo: "Uma história de amor eterno", historias: ["Este álbum eterniza o dia em que duas vidas se tornaram uma. Cada convidado, cada sorriso, cada lágrima de alegria está guardada aqui.","O amor não se explica, se vive. E hoje vivemos o capítulo mais lindo da nossa história, cercados por quem amamos."], editorial: "O amor é a única coisa que cresce quando é dividido.", legendas: ["Noivo","Noiva","Pai do Noivo","Mãe do Noivo","Pai da Noiva","Mãe da Noiva","Padrinho","Madrinha","Daminha","Pajem","Cerimonialista","Fotógrafo"] },
  formatura: { titulo: "VENCEMOS", subtitulo: "Formatura 2026 · O futuro começou", historias: ["Noites em claro, trabalhos em grupo, estágios e sonhos. Chegamos. Este álbum é a prova de que todo esforço vale a pena.","Não foi só um diploma. Foi superação, foi amizade, foi crescimento. Este registro guarda a turma que fez história."], editorial: "O diploma é o começo. O legado é o que fazemos com ele.", legendas: ["Orador","Juramentista","Paraninfo","Homenageado","Destaque Acadêmico","Líder de Turma","Artista","Atleta","Empreendedor","Pesquisador","Voluntário","Sonhador"] },
  empresa: { titulo: "NOSSO TIME", subtitulo: "Quem faz a empresa acontecer", historias: ["Por trás de cada meta batida existe um rosto, uma história, uma dedicação. Este álbum homenageia quem constrói nosso sucesso diariamente.","Resultados são feitos de pessoas. Este registro celebra os talentos que transformam desafios em conquistas."], editorial: "Pessoas certas nos lugares certos movem montanhas.", legendas: ["CEO","Diretor","Gerente","Coordenador","Analista Sênior","Analista Pleno","Analista Júnior","Estagiário","RH","Financeiro","TI","Marketing"] },
  excursao: { titulo: "AVENTURA 2026", subtitulo: "Memórias que viraram história", historias: ["Entre estradas, risadas e descobertas, vivemos dias que não voltam mais. Este álbum guarda cada momento da nossa grande aventura.","Viajar é colecionar momentos. E esta excursão nos deu uma coleção inteira de memórias inesquecíveis."], editorial: "A vida é feita de histórias. E as melhores são vividas juntos.", legendas: ["Guia","Motorista","Coordenador","Fotógrafo","Animador","Cantor do Ônibus","Dorminhoco","Comilão","Aventureiro","Contador de Histórias","DJ","Organizador"] },
  livre: { titulo: "", subtitulo: "", historias: ["",""], editorial: "", legendas: Array.from({length: 12}, (_,i) => "Item " + (i+1)) }
};

let imagens = Array(12).fill(null);
let nomes = Array(12).fill('');
let paginasGeradas = [];

function initUploadGrid() {
  const qtde = parseInt(document.getElementById('qtde').value);
  const uploadGrid = document.getElementById('uploadGrid');
  uploadGrid.innerHTML = '';
  imagens = Array(qtde).fill(null);
  nomes = Array(qtde).fill('');
  for(let i = 0; i < qtde; i++) {
    const slot = document.createElement('div');
    slot.className = 'upload-slot';
    slot.innerHTML = `<div class="posicao">POSIÇÃO ${i+1}</div><div class="preview"></div><input type="text" placeholder="Nome" data-idx="${i}" value="${nomes[i] || ''}"><div class="file-input"><button>Escolher arquivo</button><input type="file" accept="image/*" data-idx="${i}"></div>`;
    uploadGrid.appendChild(slot);
  }
  bindUploadEvents();
}

function bindUploadEvents() {
  document.querySelectorAll('.upload-slot input[type="file"]').forEach(input => {
    input.onchange = e => {
      const idx = e.target.getAttribute('data-idx');
      const file = e.target.files[0];
      if(!file) return;
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

document.getElementById('tema').addEventListener('change', e => {
  const tema = TEMAS[e.target.value];
  const historiaSelect = document.getElementById('historiaOpcao');
  historiaSelect.innerHTML = '<option value="">Escolha uma história</option>';
  if(!tema) return;
  tema.historias.forEach((h, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Opção ${i+1}: ${h.substring(0,40)}...`;
    historiaSelect.appendChild(opt);
  });
  document.getElementById('titulo').value = tema.titulo;
  document.getElementById('subtitulo').value = tema.subtitulo;
  document.getElementById('editorial').value = tema.editorial;
  const qtde = parseInt(document.getElementById('qtde').value);
  nomes = tema.legendas.slice(0, qtde);
  document.querySelectorAll('.upload-slot input[type="text"]').forEach((input, i) => {
    input.value = nomes[i] || '';
  });
});

document.getElementById('historiaOpcao').addEventListener('change', e => {
  const tema = TEMAS[document.getElementById('tema').value];
  if(tema && e.target.value!== '') {
    document.getElementById('historia').value = tema.historias[e.target.value];
  }
});

document.getElementById('qtde').addEventListener('change', initUploadGrid);
document.getElementById('paleta').addEventListener('change', e => {
  document.documentElement.style.setProperty('--paleta-fundo', e.target.value);
});

initUploadGrid();

// FUNÇÃO IA AUTOMÁTICA
async function gerarComIA() {
  const nome = document.getElementById('nomeLocal').value;
  const local = document.getElementById('cidadeCEP').value;
  const status = document.getElementById('statusIA');

  if(!nome ||!local) {
    alert('Preencha nome e cidade');
    return;
  }

  if(GEMINI_API_KEY === "COLE_SUA_CHAVE_AQUI") {
    alert('Cole sua API Key do Gemini na variável GEMINI_API_KEY no arquivo js/app.js');
    return;
  }

  status.style.display = 'block';
  status.style.color = 'white';
  status.innerText = 'IA montando seu álbum... 5s';

  const prompt = `Você é especialista em álbuns colecionáveis.
Nome: ${nome}
Local: ${local}

Retorne APENAS JSON:
{
  "categoria": "futebol",
  "titulo": "Título em caixa alta",
  "subtitulo": "Subtítulo com ano e frase",
  "historia": "Texto de 3 frases sobre o local, tom emocional",
  "editorial": "Frase de 1 linha",
  "paginas": 16,
  "figurinhas": 96
}

Deduza se é Academia, Arena, Igreja, etc pelo nome. Use tom de periferia/comunidade se for Betim/São Luiz.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        contents: [{parts: [{text: prompt}]}]
      })
    });

    const data = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    const r = JSON.parse(jsonText);

    document.getElementById('titulo').value = r.titulo;
    document.getElementById('subtitulo').value = r.subtitulo;
    document.getElementById('historia').value = r.historia;
    document.getElementById('editorial').value = r.editorial;
    document.getElementById('qtde').value = '12';
    document.getElementById('tema').value = r.categoria || 'futebol';
    document.getElementById('tema').dispatchEvent(new Event('change'));

    status.innerText = 'Pronto! Revise e clique em Gerar Álbum Premium Completo.';
    status.style.color = '#00ff88';

  } catch(e) {
    console.error(e);
    status.innerText = 'Erro na API. Verifique a chave no console.';
    status.style.color = '#ff3d00';
  }
}

function gerarAlbum() {
  const titulo = document.getElementById('titulo').value || "ÁLBUM SEM TÍTULO";
  const subtitulo = document.getElementById('subtitulo').value;
  const historia = document.getElementById('historia').value;
  const editorial = document.getElementById('editorial').value;
  const qtde = parseInt(document.getElementById('qtde').value);
  const layout = document.getElementById('layout').value;
  const paleta = document.getElementById('paleta').value;
  document.documentElement.style.setProperty('--paleta-fundo', paleta);
  const printArea = document.getElementById('print-area');
  printArea.innerHTML = '';
  paginasGeradas = [];

  // CAPA
  const capa = createPage('capa');
  capa.innerHTML = `<div class="selo-capa">EDIÇÃO PREMIUM</div><div class="page-content"><h1>${titulo}</h1><p class="subtitulo">${subtitulo}</p></div>`;
  printArea.appendChild(capa);
  paginasGeradas.push({id: 'capa', nome: 'Capa'});

  // INTRODUÇÃO
  if(historia) {
    const intro = createPage('');
    intro.innerHTML = `<div class="page-content"><h2 style="font-size:1.8rem;margin-bottom:8mm;color:#0B3D91;">Apresentação</h2><div style="font-size:1rem;line-height:1.8;color:#333;white-space:pre-wrap;">${historia}</div></div>`;
    printArea.appendChild(intro);
    paginasGeradas.push({id: 'intro', nome: 'Introdução'});
  }

  // MIOLO
  const totalPaginas = 1;
  for(let p = 0; p < totalPaginas; p++) {
    const miolo = createPage('');
    const gridClass = `grid-${layout}-${qtde}`;
    let figurinhasHTML = '';
    for(let i = 0; i < qtde; i++) {
      const img = imagens[i]? `<img src="${imagens[i]}">` : '';
      const nome = nomes[i] || 'Sem Foto';
      const numPag = `N° ${i+1} - Pág. 1`;
      const rotacao = layout === 'solto'? `transform: rotate(${(Math.random()*4-2).toFixed(1)}deg);` : '';
      const left = layout!== 'alinhado'? `left: ${10 + (i%4)*60}mm;` : '';
      const top = layout!== 'alinhado'? `top: ${20 + Math.floor(i/4)*90}mm;` : '';
      const draggable = layout === 'editavel'? 'draggable="true"' : '';
      figurinhasHTML += `<div class="figurinha-slot" data-idx="${i}" style="${rotacao}${left}${top}" ${draggable}><div class="img-box">${img}</div><div class="tarja-azul"><div class="nome">${nome}</div><div class="numero">${numPag}</div></div></div>`;
    }
    miolo.innerHTML = `<div class="page-content"><div class="miolo-header"><h3>${titulo}</h3><span class="pag-num">Pág. ${p+1}</span></div><div class="${gridClass}">${figurinhasHTML}</div></div>`;
    printArea.appendChild(miolo);
    paginasGeradas.push({id: `miolo${p}`, nome: `Miolo Pág. ${p+1}`});
  }

  // ÍNDICE
  const indice = createPage('');
  let indiceHTML = '<div style="columns:2;column-gap:10mm;">';
  for(let i = 0; i < qtde; i++) {
    const pagina = 1;
    indiceHTML += `<div style="display:flex;justify-content:space-between;margin-bottom:3mm;break-inside:avoid;"><span>${nomes[i] || `Item ${i+1}`}</span><span>pág. ${pagina}</span></div>`;
  }
  indiceHTML += '</div>';
  indice.innerHTML = `<div class="page-content"><h2 style="font-size:1.8rem;margin-bottom:8mm;color:#0B3D91;">Índice de Figurinhas</h2>${indiceHTML}</div>`;
  printArea.appendChild(indice);
  paginasGeradas.push({id: 'indice', nome: 'Índice'});

  // CARTELA
  const cartela = createPage('');
  let cartelaHTML = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;">';
  for(let i = 0; i < qtde; i++) {
    const img = imagens[i]? `<img src="${imagens[i]}" style="width:100%;height:100%;object-fit:contain!important;padding:1mm;background:var(--paleta-fundo);">` : '';
    cartelaHTML += `<div style="aspect-ratio:3/4;border:1px dashed #999;overflow:hidden;">${img}</div>`;
  }
  cartelaHTML += '</div>';
  cartela.innerHTML = `<div class="page-content"><h2 style="text-align:center;margin-bottom:8mm;color:#0B3D91;">Cartela de Figurinhas</h2>${cartelaHTML}</div>`;
  printArea.appendChild(cartela);
  paginasGeradas.push({id: 'cartela', nome: 'Cartela'});

  showPrintSelector();
  if(layout === 'editavel') setTimeout(initDragDrop, 100);
}

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
  document.querySelectorAll('#print-area.page').forEach((page, i) => {
    if(ids.indexOf(paginasGeradas[i].id) === -1) {
      page.classList.add('no-print');
    } else {
      page.classList.remove('no-print');
    }
  });
  setTimeout(() => { window.print(); }, 300);
}

function gerarCartela() {
  document.querySelectorAll('#paginasCheck input').forEach(c => { c.checked = false; });
  const cartelaCheck = document.querySelector('#paginasCheck input[value="cartela"]');
  if(cartelaCheck) cartelaCheck.checked = true;
  imprimirSelecionadas();
}

function initDragDrop() {
  let dragged = null;
  document.querySelectorAll('.grid-editavel.figurinha-slot').forEach(slot => {
    slot.addEventListener('dragstart', e => {
      dragged = e.target.closest('.figurinha-slot');
    });
    slot.addEventListener('dragend', () => {
      dragged = null;
    });
  });
  document.querySelectorAll('.grid-editavel').forEach(grid => {
    grid.addEventListener('dragover', e => {
      e.preventDefault();
    });
    grid.addEventListener('drop', e => {
      e.preventDefault();
      if(dragged) {
        const rect = grid.getBoundingClientRect();
        dragged.style.left = (e.clientX - rect.left - 30) + 'px';
        dragged.style.top = (e.clientY - rect.top - 40) + 'px';
      }
    });
  });
}
