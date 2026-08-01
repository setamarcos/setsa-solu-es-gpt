// script.js - PRONPTIA v6.1
let reconhecimentoAudio;
let campoGravandoId = null;
let classificacaoAuto = "Geral (Sem imagem anexada)";

// INICIA RECONHECIMENTO DE VOZ
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechGen = window.SpeechRecognition || window.webkitSpeechRecognition;
  reconhecimentoAudio = new SpeechGen();
  reconhecimentoAudio.continuous = false;
  reconhecimentoAudio.lang = 'pt-BR';

  reconhecimentoAudio.onresult = function(event) {
    if (campoGravandoId) {
      const resultadoTexto = event.results[0][0].transcript;
      const campoTarget = document.getElementById(campoGravandoId);
      campoTarget.value += (campoTarget.value? " " : "") + resultadoTexto;
    }
  };
  reconhecimentoAudio.onend = pararGravacaoUI;
  reconhecimentoAudio.onerror = pararGravacaoUI;
}

// AUDIO
function gerenciarAudio(idCampo, botao) {
  if (!reconhecimentoAudio) {
    alert("O reconhecimento de voz não é suportado neste navegador.");
    return;
  }
  if (campoGravandoId === idCampo) {
    reconhecimentoAudio.stop();
  } else {
    pararGravacaoUI();
    campoGravandoId = idCampo;
    botao.classList.add('gravando');
    botao.innerText = "🛑 Gravando áudio... Toque para parar";
    reconhecimentoAudio.start();
  }
}

function pararGravacaoUI() {
  document.querySelectorAll('.btn-audio').forEach(btn => {
    btn.classList.remove('gravando');
    if(btn.id === 'mic-solicitacao') btn.innerText = "🎤 Gravar Solicitação por Áudio";
    if(btn.id === 'mic-detalhe') btn.innerText = "🎤 Gravar Detalhes por Áudio";
  });
  campoGravandoId = null;
}

// FILTROS "EVITAR"
function toggleFiltro(elemento, texto) {
  elemento.classList.toggle('active');
  const campoEvitar = document.getElementById('evitar');
  if (elemento.classList.contains('active')) {
    campoEvitar.value += (campoEvitar.value? "\n" : "") + texto;
    elemento.innerText = elemento.innerText.replace('⬜', '✅');
  } else {
    campoEvitar.value = campoEvitar.value.replace(texto, "").replace(/^\s*[\r\n]/gm, "").trim();
    elemento.innerText = elemento.innerText.replace('✅', '⬜');
  }
}

// IMAGEM
function processarEClassificarImagem(input) {
  const indicador = document.getElementById('img-status');
  if (input.files && input.files[0]) {
    const arquivo = input.files[0];
    const nomeLimpo = arquivo.name.toLowerCase();

    if (nomeLimpo.includes('screenshot') || nomeLimpo.includes('wa') || /^\d+/.test(nomeLimpo)) {
      classificacaoAuto = "Conversa / Mensagem de Texto Recortada";
      document.getElementById('objetivo_imagem').value = 'conversar';
      indicador.innerHTML = `<span class="status-tag" style="background:#16a34a">💬 Autodetectado: Print de Conversa</span>`;
    } else {
      classificacaoAuto = "Evidência de Sistema / Dados Técnicos";
      document.getElementById('objetivo_imagem').value = 'erro';
      indicador.innerHTML = `<span class="status-tag" style="background:#ca8a04">📊 Autodetectado: Print de Tela</span>`;
    }
  }
}

// GERAR PROMPT EM BLOCOS
function gerarPromptEstruturado() {
  let prompt = `### TAREFA PRINCIPAL ###\n`;
  prompt += `${document.getElementById('solicitacao').value}\n\n`;
  prompt += `### CONTEXTO ###\n`;
  prompt += `${document.getElementById('detalhe').value}\n\n`;
  prompt += `### RESTRIÇÕES - O QUE EVITAR ###\n`;
  prompt += `${document.getElementById('evitar').value || "Nenhuma"}\n\n`;
  prompt += `### MÍDIA ANEXADA ###\n`;
  prompt += `Tipo: ${classificacaoAuto}\n\n`;
  prompt += `### INSTRUÇÃO FINAL ###\n`;
  prompt += `Responda de forma direta, em blocos com títulos. Sem enrolação.`;

  let painel = document.getElementById('prompt-final');
  painel.innerText = prompt;
  painel.style.display = 'block';
}

// COPIAR
function copiarPromptGerado() {
  let texto = document.getElementById('prompt-final').innerText;
  if(!texto) { alert('Clique em "Me ajuda com isso" primeiro!'); return; }
  navigator.clipboard.writeText(texto);
  alert('Prompt copiado!');
}

// PDF
function gerarRelatorioPDF() {
  window.print();
}

// EXPORTAR = SALVAR NA PLANILHA
function exportarDadosPlanilha() {
  salvarNoGoogleSheets(); // chama a função do google.js
}