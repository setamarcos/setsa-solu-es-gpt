const SEGMENTOS = {
  academia: {
    historia: "Fundada para transformar vidas pelo esporte, cada treino é mais que exercício: é amizade e superação.",
    editorial: "Na academia, cada suor é vitória.",
    categorias: ["Fundadores","Treinadores","Alunos Destaque","Eventos","Comunidade"]
  },
  igreja: {
    historia: "Esta igreja é mais que paredes: é fé, oração e comunidade que se fortalece a cada encontro.",
    editorial: "Onde dois ou três estão reunidos, ali está o amor.",
    categorias: ["Pastores","Líderes","Juventude","Famílias","Eventos"]
  },
  escola: {
    historia: "Entre provas, risadas e sonhos, construímos memórias que o tempo não apaga.",
    editorial: "Amizades forjadas no recreio duram para toda vida.",
    categorias: ["Direção","Professores","Alunos Destaque","Eventos","Comunidade Escolar"]
  },
  empresa: {
    historia: "Mais que negócios, esta empresa é feita de pessoas, conquistas e histórias de superação.",
    editorial: "O trabalho em equipe transforma sonhos em conquistas.",
    categorias: ["Fundadores","Equipe","Projetos","Clientes","Comunidade"]
  },
  bar: {
    historia: "Este bar é palco de encontros, risadas e histórias que se repetem a cada noite.",
    editorial: "Mais que bebidas, servimos memórias.",
    categorias: ["Fundadores","Equipe","Clientes","Eventos","Comunidade"]
  },
  livre: {
    historia: "Este espaço é livre para contar qualquer história que emocione e inspire.",
    editorial: "Cada grupo tem sua própria jornada.",
    categorias: ["Fundadores","Equipe","Momentos","Eventos","Comunidade"]
  }
};

function gerarAlbum() {
  const segmento = document.getElementById("segmento").value;
  const regiao = document.getElementById("regiao").value;
  const nome = document.getElementById("nomeLocal").value || "Local Genérico";
  const cidade = document.getElementById("cidade").value || "Cidade";
  const tempo = document.getElementById("tempo").value || "Tempo não informado";

  const dados = SEGMENTOS[segmento];
  const printArea = document.getElementById("print-area");
  printArea.innerHTML = "";

  // Capa
  printArea.appendChild(createPage("capa", `
    <h1>${nome.toUpperCase()}</h1>
    <p>${cidade} · ${segmento} · ${tempo}</p>
    <p><em>${dados.editorial}</em></p>
  `));

  // História
  printArea.appendChild(createPage("historia", `
    <h2>Nossa História</h2>
    <p>${dados.historia}</p>
    <p>Localizado na região ${regiao}, ${nome} é símbolo de convivência e superação.</p>
  `));

  // Editorial
  printArea.appendChild(createPage("editorial", `
    <h2>Editorial</h2>
    <p>${dados.editorial}</p>
  `));

  // Índice
  const indiceHTML = dados.categories?.map((c,i)=>`<li>${i+1}. ${c}</li>`).join("");
  printArea.appendChild(createPage("indice", `
    <h2>Índice</h2>
    <ul>${indiceHTML}</ul>
  `));

  // Miolo
  printArea.appendChild(createPage("miolo", `
    <h3>Nosso Time</h3>
    <p>48 figurinhas · 12 páginas · 8 pacotes · 3 raras</p>
  `));

  // Contracapa
  printArea.appendChild(createPage("contracapa", `
    <h2>Mensagem Final</h2>
    <p>${nome} — mais que um ${segmento}, um espaço de histórias que continuam sendo escritas todos os dias.</p>
  `));
}

function createPage(classe, conteudo) {
  const page = document.createElement("div");
  page.className = `page ${classe}`;
  page.innerHTML = conteudo;
  return page;
}
