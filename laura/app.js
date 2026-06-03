const URL_SCRIPT = "https://script.google.com/macros/s/SEU_DEPLOY_ID_AQUI/exec";
let usuarioLogado = null;
let tokenGoogle = null;

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
  const temas = [
    "O impacto das redes sociais na saúde mental dos jovens",
    "A importância da leitura na formação cidadã",
    "Desafios da educação no Brasil contemporâneo",
    "Sustentabilidade e consumo consciente",
    "O papel da tecnologia na educação"
  ];
  const tema = temas[Math.floor(Math.random() * temas.length)];
  document.getElementById('temaDisplay').innerHTML = `<strong>Tema:</strong> ${tema}`;
}

function processarFoto() {
  const file = document.getElementById('inputFoto').files[0];
  if (!file) return;

  document.getElementById('avisoValidacao').textContent = 'Extraindo texto da imagem...';

  Tesseract.recognize(file, 'por', { logger: m => console.log(m) })
   .then(({ data: { text } }) => {
      document.getElementById('textoRedacao').value = text;
      atualizarContadores();
      document.getElementById('avisoValidacao').textContent = '';
    })
   .catch(() => {
      document.getElementById('avisoValidacao').textContent = 'Erro ao extrair texto. Tente novamente.';
    });
}

function analisarRedacao() {
  const texto = document.getElementById('textoRedacao').value.trim();
  if (!texto) {
    alert('Digite ou cole uma redação primeiro.');
    return;
  }

  document.getElementById('resultadoAnalise').style.display = 'block';
  document.getElementById('notaFinal').textContent = '8.5';
  document.getElementById('resumoTexto').textContent = 'Redação bem estruturada com boa argumentação. Atenção à concordância verbal e coesão entre parágrafos.';
}

function exportarPDF() {
  alert('Função PDF em desenvolvimento');
}

function exportarXLS() {
  alert('Função XLS em desenvolvimento');
}

function compartilharWhatsApp() {
  alert('Função WhatsApp em desenvolvimento');
}

function atualizarRigor() {}