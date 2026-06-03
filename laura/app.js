const URL_SCRIPT = "https://script.google.com/macros/s/SEU_DEPLOY_ID_AQUI/exec";
let usuarioLogado = null;
let tokenGoogle = null;
let temaAtual = "";

const TEMAS = [
  "O impacto das redes sociais na saúde mental dos jovens",
  "A importância da leitura na formação cidadã",
  "Desafios da educação no Brasil contemporâneo",
  "Sustentabilidade e consumo consciente",
  "O papel da tecnologia na educação",
  "Bullying nas escolas: causas e consequências",
  "A valorização dos professores no Brasil",
  "Meio ambiente e responsabilidade individual"
];

document.addEventListener('DOMContentLoaded', () => {
  recuperarUsuario();
  document.getElementById('textoRedacao').addEventListener('input', atualizarContadores);
});

function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  usuarioLogado = data.email;
  tokenGoogle = response.credential;

  localStorage.setItem('usuario', JSON.stringify({
    nome: data.name,
    email: data.email,
    foto: data.picture
  }));

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
  temaAtual = TEMAS[Math.floor(Math.random() * TEMAS.length)];
  document.getElementById('temaDisplay').innerHTML = `<strong>Tema:</strong> ${temaAtual}`;
}

function processarFoto() {
  const file = document.getElementById('inputFoto').files[0];
  if (!file) return;

  document.getElementById('avisoValidacao').textContent = 'Extraindo texto da imagem... Aguarde';

  Tesseract.recognize(file, 'por', { 
    logger: m => console.log(m),
    tessedit_pageseg_mode: 6
  })
  .then(({ data: { text } }) => {
      document.getElementById('textoRedacao').value = text.trim();
      atualizarContadores();
      document.getElementById('avisoValidacao').textContent = 'Texto extraído. Revise antes de analisar.';
    })
  .catch(() => {
      document.getElementById('avisoValidacao').textContent = 'Erro ao extrair texto. Tente foto com mais luz e nitidez.';
    });
}

function analisarRedacao() {
  const texto = document.getElementById('textoRedacao').value.trim();
  const ano = document.getElementById('ano').value;
  
  if (!texto) {
    alert('Digite ou cole uma redação primeiro.');
    return;
  }
  if (!temaAtual) {
    alert('Gere um tema primeiro.');
    return;
  }

  const palavras = texto.trim().split(/\s+/).filter(w => w.length > 0);
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0);

  let erros = [];
  let validacoes = [];
  let nota = 10;

  // 2.1 Estrutura: parágrafos 3-5, título com tema
  if (paragrafos.length < 3 || paragrafos.length > 5) {
    erros.push(`Estrutura: ${paragrafos.length} parágrafos. O ideal são 3 a 5.`);
    nota -= 2;
  } else {
    validacoes.push(`Estrutura: ${paragrafos.length} parágrafos. Correto.`);
  }

  if (palavras.length < 80) {
    erros.push(`Extensão: ${palavras.length} palavras. Mínimo esperado: 80.`);
    nota -= 1.5;
  } else if (palavras.length > 300) {
    erros.push(`Extensão: ${palavras.length} palavras. Máximo sugerido: 300.`);
    nota -= 0.5;
  } else {
    validacoes.push(`Extensão: ${palavras.length} palavras. Adequado.`);
  }

  // 2.2 Concordância básica
  if (/[a-z] [A-Z]/.test(texto)) {
    erros.push('Concordância: Possível erro de letra maiúscula no meio da frase.');
    nota -= 0.5;
  }
  if (/\s{2,}/.test(texto)) {
    erros.push('Digitação: Espaços duplos encontrados.');
    nota -= 0.3;
  }

  // 2.3 Sentido com o tema
  const palavrasTema = temaAtual.toLowerCase().split(' ');
  const textoBaixo = texto.toLowerCase();
  const aderencia = palavrasTema.filter(p => textoBaixo.includes(p)).length;
  if (aderencia < 2) {
    erros.push('Aderência: O texto se afasta do tema proposto.');
    nota -= 2;
  } else {
    validacoes.push('Aderência: O texto aborda o tema proposto.');
  }

  nota = Math.max(0, nota).toFixed(1);

  // Montar resultado
  document.getElementById('resultadoAnalise').style.display = 'block';
  document.getElementById('notaFinal').textContent = nota;
  document.getElementById('validacoesTexto').innerHTML = validacoes.map(v => `<p>✓ ${v}</p>`).join('');
  document.getElementById('errosTexto').innerHTML = erros.map(e => `<p>✗ ${e}</p>`).join('');
  document.getElementById('analisaEstrutura').innerHTML = `<p>Parágrafos: ${paragrafos.length} | Palavras: ${palavras.length} | Frases: ${frases.length}</p>`;
  document.getElementById('orientacoesTexto').innerHTML = `<p>Nível ${ano}º ano: Atenção à coesão entre parágrafos e uso de conectivos.</p>`;
  document.getElementById('comentariosTexto').innerHTML = `<p>${nota >= 8 ? 'Excelente redação.' : nota >= 6 ? 'Bom trabalho, revise os pontos citados.' : 'Reescreva focando na estrutura e no tema.'}</p>`;
  document.getElementById('resumoTexto').innerHTML = `<p>Nota final: ${nota}. ${erros.length === 0 ? 'Sem erros graves detectados.' : `${erros.length} pontos a melhorar.`}</p>`;
}

function exportarPDF() {
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