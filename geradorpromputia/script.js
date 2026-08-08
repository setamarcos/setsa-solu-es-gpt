// script.js - PRONPTIA v6.3
let reconhecimentoAudio;
let campoGravandoId = null;

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
      campoTarget.value += (campoTarget.value? " : "") + resultadoTexto;
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

// FUNÇÃO "ME AJUDA" SALVA E GERA O PROMPT
function gerarPromptEstruturado() {
  // 1. PRIMEIRO SALVA NA PLANILHA
  if(window.salvarNoGoogleSheets) {
    salvarNoGoogleSheets();
  }

  // 2. DEPOIS GERA O TEXTO NOVO
  let prompt = `O QUE EU ENTENDI DO SEU PEDIDO:\n`;
  prompt += `${document.getElementById('solicitacao').value}\n\n`;
  prompt += `CONTEXTO QUE VOCÊ ME DEU:\n`;
  prompt += `${document.getElementById('detalhe').value}\n\n`;
  prompt += `O QUE VOCÊ PEDIU PRA EU EVITAR:\n`;
  prompt += `${document.getElementById('evitar').value || "Nenhuma restrição"}\n\n`;
  prompt += `O QUE EU TE ENTREGUEI ASSIM:\n`;
  prompt += `Resposta direta, sem enrolação, focada em resolver sua solicitação acima.`;

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