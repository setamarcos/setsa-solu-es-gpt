const URL_SCRIPT = "https://script.google.com/macros/s/SEU_DEPLOY_ID_AQUI/exec";
let usuarioLogado = null;
let tokenGoogle = null;
let temaAtual = "";

const TEMAS_POR_SERIE = {
  "5": ["A importância de cuidar da natureza","Meu animal de estimação ideal","Como usar a internet com responsabilidade","O valor da amizade na escola"],
  "6": ["O impacto das redes sociais nos jovens","A importância da leitura na formação cidadã","Bullying nas escolas: como combater","Esporte e disciplina na vida escolar"],
  "7": ["Desafios da educação no Brasil contemporâneo","O papel da tecnologia na sala de aula","Consumo consciente e meio ambiente","A valorização dos professores"],
  "8": ["Desigualdade social no Brasil","Sustentabilidade e responsabilidade individual","O uso excessivo do celular entre adolescentes","Cultura brasileira e identidade nacional"],
  "9": ["Os impactos da inteligência artificial na sociedade","Saúde mental na adolescência","Democracia e participação cidadã","Fake news e responsabilidade na internet"]
};

document.addEventListener('DOMContentLoaded', () => {
  recuperarUsuario();
  const textarea = document.getElementById('textoRedacao');
  const textoSalvo = localStorage.getItem('laura_texto');
  if (textoSalvo) {
    textarea.value = textoSalvo;
    atualizarContadores();
  }
  textarea.addEventListener('input', () => {
    atualizarContadores();
    localStorage.setItem('laura_texto', textarea.value);
  });
  iniciarControlesVoz();
});

function ativarLogin() {
  document.getElementById('loginBox').style.display = 'flex';
  document.getElementById('btnAtivarLogin').style.display = 'none';
}

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
  document.getElementById('btnAtivarLogin').style.display = 'none';
  document.getElementById('userInfo').style.display = 'flex';
  document.getElementById('userName').textContent = nome;
  document.getElementById('userImg').src = foto;
}

function logoutGoogle() {
  localStorage.removeItem('usuario');
  usuarioLogado = null;
  if (window.google && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
  document.getElementById('userInfo').style.display = 'none';
  document.getElementById('btnAtivarLogin').style.display = 'block';
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

function novaRedacao() {
  if (confirm('Deseja salvar esta redação em PDF antes de limpar?')) {
    exportarPDF();
    setTimeout(() => limparTudo(), 800);
  } else {
    if (confirm('Tem certeza que deseja limpar sem salvar? Esta ação não pode ser desfeita.')) {
      limparTudo();
    }
  }
}

function limparTudo() {
  document.getElementById('textoRedacao').value = '';
  document.getElementById('textoIA').value = '';
  localStorage.removeItem('laura_texto');
  localStorage.removeItem('laura_foto');
  document.getElementById('resultadoAnalise').style.display = 'none';
  atualizarContadores();
  document.getElementById('statusVoz').textContent = '';
  document.getElementById('avisoValidacao').textContent = '';
  document.getElementById('inputFoto').value = '';
}

function salvarFoto() {
  const file = document.getElementById('inputFoto').files[0];
  if (!file) {
    document.getElementById('avisoValidacao').textContent = 'Selecione uma foto primeiro.';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem('laura_foto', e.target.result);
    document.getElementById('avisoValidacao').textContent = 'Foto salva. Agora cole o texto transcrito abaixo.';
    setTimeout(() => document.getElementById('avisoValidacao').textContent = '', 3000);
  };
  reader.readAsDataURL(file);
}

function analisarRedacao() {
  const texto = document.getElementById('textoRedacao').value.trim();
  const ano = document.getElementById('ano').value;
  if (!texto) { alert('Cole ou digite uma redação primeiro.'); return; }
  if (!temaAtual) { alert('Gere um tema primeiro.'); return; }

  const palavras = texto.trim().split(/\s+/).filter(w => w.length > 0);
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0);

  let erros = [];
  let sugestoes = [];
  let sugestoesCorrecao = [];
  let validacoes = [];
  let nota = 10;

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

  const textoBaixo = texto.toLowerCase();
  if (/o sport/.test(textoBaixo)) sugestoesCorrecao.push('“o Sport” → “O esporte”');
  if (/porque mas/.test(textoBaixo)) sugestoesCorrecao.push('“porque mas” → “por que, mas”');
  if (/fulebol/.test(textoBaixo)) sugestoesCorrecao.push('“fulebol” → “futebol”');

  const palavrasTema = temaAtual.toLowerCase().split(' ').filter(w => w.length > 3);
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

  let comentariosHTML = sugestoes.map(s => `<p>${s}</p>`).join('');
  if (sugestoesCorrecao.length > 0) {
    comentariosHTML += '<p><strong>Correções sugeridas:</strong></p>' + sugestoesCorrecao.map(c => `<p>• ${c}</p>`).join('');
  }
  if (!comentariosHTML) comentariosHTML = `<p>${nota >= 8? 'Excelente redação.' : 'Bom trabalho, revise os pontos citados.'}</p>`;
  document.getElementById('comentariosTexto').innerHTML = comentariosHTML;

  document.getElementById('resumoTexto').innerHTML = `<p>Nota final: ${nota}. ${erros.length === 0? 'Sem erros graves.' : `${erros.length} pontos a melhorar.`}</p>`;
}

function exportarPDF() {
  if (typeof window.jspdf === 'undefined') { alert('Aguarde carregar o PDF.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const texto = document.getElementById('textoRedacao').value;
  const nota = document.getElementById('notaFinal').textContent || 'N/A';
  const resumo = document.getElementById('resumoTexto').textContent || 'Faça a análise primeiro';

  let titulo = texto.split('\n')[0].trim();
  if (!titulo) titulo = 'Redacao';
  titulo = titulo.substring(0, 40).trim();
  const ultimoEspaco = titulo.lastIndexOf(' ');
  if (ultimoEspaco > 20) titulo = titulo.substring(0, ultimoEspaco);
  titulo = titulo.replace(/[\\/:*?"<>|]/g, '').trim();
  const data = new Date().toISOString().split('T')[0];
  const nomeArquivo = `${titulo}_${data}.pdf`;

  doc.setFontSize(16);
  doc.text('Laura - Parecer Técnico de Redação', 10, 15);
  doc.setFontSize(12);
  doc.text(`Tema: ${temaAtual}`, 10, 25);
  doc.text(`Nota: ${nota}`, 10, 35);
  doc.text('Redação:', 10, 45);

  const linhas = texto.split('\n');
  let y = 55;
  linhas.forEach(linha => {
    if (y > 270) { doc.addPage(); y = 20; }
    if (linha.trim() === '') {
      y += 5;
    } else {
      doc.text(doc.splitTextToSize(linha, 180), 10, y);
      y += 7;
    }
  });

  doc.text('Resumo:', 10, y + 10);
  doc.text(doc.splitTextToSize(resumo, 180), 10, y + 20);
  doc.save(nomeArquivo);
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
  const nota = document.getElementById('notaFinal').textContent || 'N/A';
  const texto = `Segue redação.\n\nNota: ${nota}\n\nEnviado via Laura Mentoria 2.1.3f`;
  const numeroDestino = '5531984821901';
  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

function iniciarControlesVoz() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusVoz = document.getElementById('statusVoz');
  const textarea = document.getElementById('textoRedacao');
  let modoVoz = null;
  let silenceTimer = null;

  function iniciarVoz(modo) {
    if (!SpeechRecognition) {
      statusVoz.textContent = "Reconhecimento de voz não suportado.";
      return;
    }
    modoVoz = modo;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = false;

    statusVoz.textContent = `Escutando ${modo}... Pause 3s para finalizar.`;

    recognition.onresult = (event) => {
      clearTimeout(silenceTimer);
      let texto = event.results[event.results.length - 1][0].transcript.trim();
      texto = texto.charAt(0).toUpperCase() + texto.slice(1);

      if (modoVoz === 'titulo') {
        textarea.value += (textarea.value? '\n\n' : '') + texto;
      } else if (modoVoz === 'paragrafo') {
        if (!texto.endsWith('.')) texto += '.';
        textarea.value += (textarea.value? '\n\n' : '') + texto;
      }
      textarea.dispatchEvent(new Event('input'));
      localStorage.setItem('laura_texto', textarea.value);

      silenceTimer = setTimeout(() => {
        recognition.stop();
        modoVoz = null;
        statusVoz.textContent = 'Texto inserido.';
      }, 3000);
    };

    recognition.onerror = () => {
      statusVoz.textContent = 'Erro no microfone.';
      modoVoz = null;
      clearTimeout(silenceTimer);
    };

    recognition.start();
  }

  document.getElementById('btnVozTitulo').onclick = () => iniciarVoz('titulo');
  document.getElementById('btnVozParagrafo').onclick = () => iniciarVoz('paragrafo');
}