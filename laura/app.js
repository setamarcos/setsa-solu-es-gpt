const URL_SCRIPT = "https://script.google.com/macros/s/SEU_DEPLOY_ID_AQUI/exec";
let usuarioLogado = null;
let tokenGoogle = null;
let temaAtual = "";

const TEMAS_POR_SERIE = {
  "5": [
    "A importância de cuidar da natureza",
    "Meu animal de estimação ideal",
    "Como usar a internet com responsabilidade",
    "O valor da amizade na escola"
  ],
  "6": [
    "O impacto das redes sociais nos jovens",
    "A importância da leitura na formação cidadã",
    "Bullying nas escolas: como combater",
    "Esporte e disciplina na vida escolar"
  ],
  "7": [
    "Desafios da educação no Brasil contemporâneo",
    "O papel da tecnologia na sala de aula",
    "Consumo consciente e meio ambiente",
    "A valorização dos professores"
  ],
  "8": [
    "Desigualdade social no Brasil",
    "Sustentabilidade e responsabilidade individual",
    "O uso excessivo do celular entre adolescentes",
    "Cultura brasileira e identidade nacional"
  ],
  "9": [
    "Os impactos da inteligência artificial na sociedade",
    "Saúde mental na adolescência",
    "Democracia e participação cidadã",
    "Fake news e responsabilidade na internet"
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  recuperarUsuario();
  document.getElementById('textoRedacao').addEventListener('input', atualizarContadores);
});

function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  usuarioLogado = data.email;
  tokenGoogle = response.credential;
  localStorage.setItem('usuario', JSON.stringify({nome: data.name, email: data.email, foto: data.picture}));
  mostrarUsuario(data.name, data.picture);
}

function recuperarUsuario() {
  const usuarioSalvo = localStorage.getItem('usuario');
  if (usuarioSalvo) {
    const user = JSON.parse(usuarioSalvo);
    usuarioLogado = user.email;
    mostrarUsuario(user.nome, user.foto);
  }
}

function mostrarUsuario(nome, foto) {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('userInfo').style.display = 'flex';
  document.getElementById('userName').textContent = nome;
  document.getElementById('userImg').src = foto;
  document.getElementById('mainContent').style.display = 'block';
}

function logoutGoogle() {
  localStorage.removeItem('usuario');
  usuarioLogado = null;
  document.getElementById('loginBox').style.display = 'block';
  document.getElementById('userInfo').style.display = 'none';
  document.getElementById('mainContent').style.display = 'none';
}

function atualizarContadores() {
  const texto = document.getElementById('textoRedacao').value;
  const palavras = texto.trim().split(/\s+/).filter(w => w.length > 0);
  const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0);
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  document.getElementById('contPalavras').textContent = palavras.length;
  document.getElementById('contFrases').textContent = frases.length;
  document.getElementById('contParafos').textContent = paragrafos.length;
}

function sortearTema() {
  const ano = document.getElementById('ano').value;
  const lista = TEMAS_POR_SERIE[ano];
  temaAtual = lista[Math.floor(Math.random() * lista.length)];
  const el = document.getElementById('temaDisplay');
  el.innerHTML = `<strong>Tema:</strong> ${temaAtual}`;
  el.style.display = 'block';
}

function processarFoto() {
  const file = document.getElementById('inputFoto').files[0];
  if (!file) return;
  document.getElementById('avisoValidacao').textContent = 'Extraindo texto... Aguarde 10s';

  Tesseract.recognize(file, 'por', {
    logger: m => console.log(m),
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ0123456789.,;:!?()-\'" \n',
    tessedit_pageseg_mode: 6
  })
 .then(({ data: { text } }) => {
      const textoLimpo = text.replace(/[^\wÀ-ÿ\s.,;:!?()\n-]/g, '').trim();
      document.getElementById('textoRedacao').value = textoLimpo;
      atualizarContadores();
      document.getElementById('avisoValidacao').textContent = textoLimpo.length < 20?
        'Texto muito curto. Tente foto mais nítida e com boa luz.' :
        'Texto extraído. Revise antes de analisar.';
    })
 .catch(() => {
      document.getElementById('avisoValidacao').textContent = 'Erro ao extrair. Foto precisa estar legível e sem reflexo.';
    });
}

function analisarRedacao() {
  const texto = document.getElementById('textoRedacao').value.trim();
  const ano = document.getElementById('ano').value;
  if (!texto) { alert('Digite ou cole uma redação primeiro.'); return; }
  if (!temaAtual) { alert('Gere um tema primeiro.'); return; }

  const palavras = texto.trim().split(/\s+/).filter(w => w.length > 0);
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0);

  let erros = [];
  let sugestoes = [];
  let validacoes = [];
  let nota = 10;

  // Rigor por série
  const minPalavras = ano <= 6? 80 : 120;
  const maxPalavras = ano <= 6? 200 : 300;

  if (paragrafos.length < 3 || paragrafos.length > 5) {
    erros.push(`Estrutura: ${paragrafos.length} parágrafos. O exigido são 3 a 5.`);
    nota -= 2;
  } else {
    validacoes.push(`Estrutura: ${paragrafos.length} parágrafos. Correto.`);
  }

  if (palavras.length < minPalavras) {
    erros.push(`Extensão: ${palavras.length} palavras. Mínimo para ${ano}º ano: ${minPalavras}.`);
    nota -= 1.5;
  } else if (palavras.length > maxPalavras) {
    erros.push(`Extensão: ${palavras.length} palavras. Máximo sugerido: ${maxPalavras}.`);
    nota -= 0.5;
  } else {
    validacoes.push(`Extensão: ${palavras.length} palavras. Adequado para ${ano}º ano.`);
  }

  if (/[a-z] [A-Z]/.test(texto)) {
    erros.push('Concordância: Letra maiúscula no meio da frase.');
    nota -= 0.5;
  }
  if (/\s{2,}/.test(texto)) {
    erros.push('Digitação: Espaços duplos encontrados.');
    nota -= 0.3;
  }

  const palavrasTema = temaAtual.toLowerCase().split(' ').filter(w => w.length > 3);
  const textoBaixo = texto.toLowerCase();
  const aderencia = palavrasTema.filter(p => textoBaixo.includes(p)).length;
  if (aderencia < 2) {
    erros.push('Aderência: O texto se afasta do tema proposto. Releia o tema e reescreva a introdução.');
    nota -= 2;
  } else {
    validacoes.push('Aderência: O texto aborda o tema proposto.');
  }

  if (nota < 7) {
    sugestoes.push('Sugestão: Reescreva a introdução conectando diretamente ao tema. Use conectivos: portanto, assim, além disso.');
  }
  if (paragrafos.length === 1) {
    sugestoes.push('Sugestão: Divida o texto em introdução, desenvolvimento e conclusão.');
  }

  nota = Math.max(0, nota).toFixed(1);

  document.getElementById('resultadoAnalise').style.display = 'block';
  document.getElementById('notaFinal').textContent = nota;
  document.getElementById('validacoesTexto').innerHTML = validacoes.map(v => `<p>✓ ${v}</p>`).join('') || '<p>Nenhuma validação.</p>';
  document.getElementById('errosTexto').innerHTML = erros.map(e => `<p>✗ ${e}</p>`).join('') || '<p>Nenhum erro grave.</p>';
  document.getElementById('analisaEstrutura').innerHTML = `<p>Parágrafos: ${paragrafos.length} | Palavras: ${palavras.length} | Frases: ${frases.length}</p>`;
  document.getElementById('orientacoesTexto').innerHTML = `<p>Nível ${ano}º ano: Foque em coesão, pontuação e ortografia.</p>`;
  document.getElementById('comentariosTexto').innerHTML = sugestoes.map(s => `<p>${s}</p>`).join('') || `<p>${nota >= 8? 'Excelente redação.' : 'Bom trabalho, revise os pontos citados.'}</p>`;
  document.getElementById('resumoTexto').innerHTML = `<p>Nota final: ${nota}. ${erros.length === 0? 'Sem erros graves.' : `${erros.length} pontos a melhorar.`}</p>`;
}

function exportarPDF() {
  if (typeof window.jspdf === 'undefined') { alert('Aguarde carregar o PDF.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const texto = document.getElementById('textoRedacao').value;
  const nota = document.getElementById('notaFinal').textContent || 'N/A';
  const resumo = document.getElementById('resumoTexto').textContent || 'Faça a análise primeiro';

  doc.setFontSize(16);
  doc.text('Laura - Parecer Técnico de Redação', 10, 15);
  doc.setFontSize(12);
  doc.text(`Tema: ${temaAtual}`, 10, 25);
  doc.text(`Nota: ${nota}`, 10, 35);
  doc.text('Redação:', 10, 45);
  doc.text(doc.splitTextToSize(texto, 180), 10, 55);
  doc.text('Resumo:', 10, 200);
  doc.text(doc.splitTextToSize(resumo, 180), 10, 210);
  doc.save('parecer-laura.pdf');
}

function exportarXLS() {
  if (typeof window.XLSX === 'undefined') { alert('Aguarde carregar o XLS.'); return; }
  const texto = document.getElementById('textoRedacao').value;
  const nota = document.getElementById('notaFinal').textContent || 'N/A';

  const dados = [
    ['Campo', 'Valor'],
    ['Tema', temaAtual],
    ['Nota', nota],
    ['Palavras', document.getElementById('contPalavras').textContent],
    ['Parágrafos', document.getElementById('contParafos').textContent],
    ['Redação', texto]
  ];

  const ws = XLSX.utils.aoa_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Parecer');
  XLSX.writeFile(wb, 'parecer-laura.xlsx');
}

function compartilharWhatsApp() {
  alert('Função WhatsApp em desenvolvimento');
}

function atualizarRigor() {}