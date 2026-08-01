// google.js - PRONPTIA v6.1
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwAFjbqPdEk5rcgQahgsOn35tPXpTIj9vjSIA63LgyYDPj2QOvMB4K-kNGrkqscmYzp/exec";

let usuarioEmail = localStorage.getItem('promptEmail') || null;

// FUNÇÃO QUE O HTML VAI CHAMAR PARA SALVAR
function salvarNoGoogleSheets() {
  if (!usuarioEmail) {
    alert("⚠️ Faça login primeiro!");
    return;
  }

  const dados = {
    data: new Date().toLocaleString("pt-BR"),
    email: usuarioEmail,
    contato: usuarioEmail,
    loguinho: usuarioEmail.split("@")[0],
    acao: "Diagnostico",
    userAgent: navigator.userAgent,
    solicitacao: document.getElementById('solicitacao').value,
    detalhe: document.getElementById('detalhe').value,
    evitar: document.getElementById('evitar').value,
    classificacao: window.classificacaoAuto || "Geral (Sem imagem anexada)",
    objetivoImagem: document.getElementById('objetivo_imagem')?.value || "",
    promptGerado: document.getElementById('prompt-final')?.innerText || "",
    respostaIA: document.getElementById('resposta_ia')?.value || "",
    statusFeedback: window.ultimoFeedback || ""
  };

  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(dados)
  }).then(() => alert("✅ Salvo na Planilha Mestre! Verifique a aba 'dados master' e sua aba pessoal."));
}

// FUNÇÃO QUE O HTML VAI CHAMAR PARA FEEDBACK
function enviarFeedbackPlanilha(status) {
  window.ultimoFeedback = status;
  salvarNoGoogleSheets();
}

// LOGIN
function fazerLoginPrompt() {
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  if(email.includes('@')){
    usuarioEmail = email;
    localStorage.setItem('promptEmail', email);
    document.getElementById('login').innerHTML = `<p style="color:#16a34a; font-weight:bold">✅ Logado: ${email} <button onclick="fazerLogoutPrompt()">Sair</button></p>`;
  } else {
    alert("Email inválido")
  }
}

function fazerLogoutPrompt() {
  usuarioEmail = null;
  localStorage.removeItem('promptEmail');
  location.reload();
}

// CARREGA LOGIN AO ABRIR
document.addEventListener('DOMContentLoaded', function() {
  if(usuarioEmail) {
    document.getElementById('login').innerHTML = `<p style="color:#16a34a; font-weight:bold">✅ Logado: ${usuarioEmail} <button onclick="fazerLogoutPrompt()">Sair</button></p>`;
  } else {
    document.getElementById('login').innerHTML = `<input type="email" id="emailInput" placeholder="Digite seu email para login"><button class="action-btn" onclick="fazerLoginPrompt()">Entrar</button>`;
  }
});