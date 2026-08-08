// google.js - PRONPTIA v6.3
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwAFjbqPdEk5rcgQahgsOn35tPXpTIj9vjSIA63LgyYDPj2QOvMB4K-kNGrkqscmYzp/exec";

let usuarioTelefone = localStorage.getItem('promptTelefone') || null;

// FUNÇÃO QUE O HTML VAI CHAMAR PARA SALVAR
function salvarNoGoogleSheets() {
  if (!usuarioTelefone) {
    alert("⚠️ Faça login primeiro!");
    return;
  }

  const dados = {
    data: new Date().toLocaleString("pt-BR"),
    telefone: usuarioTelefone,
    contato: usuarioTelefone,
    loguinho: usuarioTelefone,
    acao: "Diagnostico",
    userAgent: navigator.userAgent,
    solicitacao: document.getElementById('solicitacao').value,
    detalhe: document.getElementById('detalhe').value,
    evitar: document.getElementById('evitar').value,
    classificacao: "Geral (Sem imagem)",
    objetivoImagem: "",
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

// FUNÇÃO PARA FORMATAR TELEFONE (xx) xxxxx-xxxx
function formatarTelefone(valor) {
  valor = valor.replace(/\D/g, "");
  if (valor.length <= 2) return `(${valor}`;
  if (valor.length <= 7) return `(${valor.slice(0,2)}) ${valor.slice(2)}`;
  return `(${valor.slice(0,2)}) ${valor.slice(2,7)}-${valor.slice(7,11)}`;
}

// LOGIN
function fazerLoginPrompt() {
  const telInput = document.getElementById('telefoneInput').value.trim();
  const telefoneLimpo = telInput.replace(/\D/g, "");

  if(telefoneLimpo.length === 11){
    usuarioTelefone = telInput;
    localStorage.setItem('promptTelefone', telInput);
    document.getElementById('login').innerHTML = `<p style="color:#16a34a; font-weight:bold">✅ Logado: ${telInput} <button onclick="fazerLogoutPrompt()">Sair</button></p>`;
  } else {
    alert("Telefone inválido. Use (xx) xxxxx-xxxx")
  }
}

function fazerLogoutPrompt() {
  usuarioTelefone = null;
  localStorage.removeItem('promptTelefone');
  location.reload();
}

// CARREGA LOGIN AO ABRIR
document.addEventListener('DOMContentLoaded', function() {
  if(usuarioTelefone) {
    document.getElementById('login').innerHTML = `<p style="color:#16a34a; font-weight:bold">✅ Logado: ${usuarioTelefone} <button onclick="fazerLogoutPrompt()">Sair</button></p>`;
  } else {
    document.getElementById('login').innerHTML = `
      <input type="text" id="telefoneInput" placeholder="(xx) xxxxx-xxxx" maxlength="15" oninput="this.value = formatarTelefone(this.value)">
      <button class="action-btn" onclick="fazerLoginPrompt()">Fazer Login</button>
    `;
  }
});