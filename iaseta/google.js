// google.js - PRONPTIA v6.2
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwAFjbqPdEk5rcgQahgsOn35tPXpTIj9vjSIA63LgyYDPj2QOvMB4K-kNGrkqscmYzp/exec";

let usuarioTelefone = localStorage.getItem('promptTelefone') || null;

function salvarNoGoogleSheets() {
  if (!usuarioTelefone) return;

  const dados = {
    data: new Date().toLocaleString("pt-BR"),
    email: usuarioTelefone,
    contato: usuarioTelefone,
    loguinho: usuarioTelefone.replace(/\D/g, ""),
    acao: "Diagnostico",
    userAgent: navigator.userAgent,
    solicitacao: document.getElementById('solicitacao').value,
    detalhe: document.getElementById('detalhe').value,
    evitar: document.getElementById('evitar').value,
    classificacao: window.classificacaoAuto || "Geral (Sem imagem anexada)",
    objetivoImagem: "",
    promptGerado: document.getElementById('prompt-final')?.innerText || "",
    respostaIA: document.getElementById('resposta_ia')?.value || "",
    statusFeedback: window.ultimoFeedback || ""
  };

  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(dados)
  });
}

function enviarFeedbackPlanilha(status) {
  window.ultimoFeedback = status;
  salvarNoGoogleSheets();
}

function fazerLogin() {
  const inputEl = document.getElementById('input-telefone');
  const telefone = inputEl ? inputEl.value.trim() : "";
  const apenasNumeros = telefone.replace(/\D/g, "");
  
  if (apenasNumeros.length >= 10) {
    usuarioTelefone = telefone;
    localStorage.setItem('promptTelefone', telefone);
    renderizarEstadoLogin();
  } else {
    alert("Digite um número de telefone válido no formato (xx) xxxxx-xxxx");
  }
}

function fazerLogoutPrompt() {
  usuarioTelefone = null;
  localStorage.removeItem('promptTelefone');
  location.reload();
}

function renderizarEstadoLogin() {
  const loginDiv = document.getElementById('login');
  if (!loginDiv) return;

  if (usuarioTelefone) {
    loginDiv.innerHTML = `<p style="color:#16a34a; font-weight:bold; margin:0;">✅ Logado: ${usuarioTelefone} <button type="button" onclick="fazerLogoutPrompt()" style="margin-left:10px; background:#dc2626; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Sair</button></p>`;
  } else {
    loginDiv.innerHTML = `
      <input type="text" id="input-telefone" placeholder="(xx) xxxxx-xxxx" maxlength="15" oninput="mascaraTelefone(this)">
      <button type="button" onclick="fazerLogin()">Fazer Login</button>
    `;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  renderizarEstadoLogin();
});