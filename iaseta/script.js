// script.js - Atualizado
let reconhecimentoAudio;
let campoGravandoId = null;
let classificacaoAuto = "Geral (Sem imagem anexada)";

// Relógio dinâmico atualizado a cada segundo
function atualizarRelogioTopo() {
  const agora = new Date();
  const formatado = agora.toLocaleDateString('pt-BR') + ' - ' + agora.toLocaleTimeString('pt-BR');
  const el = document.getElementById('relogio-dinamico');
  if(el) el.innerText = formatado;
}
setInterval(atualizarRelogioTopo, 1000);
window.addEventListener('DOMContentLoaded', atualizarRelogioTopo);

// Máscara de Telefone
function mascaraTelefone(input) {
  let v = input.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d+)/, "($1) $2");
  } else if (v.length > 0) {
    v = v.replace(/^(\d*)/, "($1");
  }
  input.value = v;
}

// Reconhecimento de Voz
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

// Filtros "Evitar"
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

// Gerar Prompt
function gerarPromptEstruturado() {
  let painel = document.getElementById('prompt-final');
  painel.innerText = "";
  painel.style.display = 'none';

  let prompt = `O QUE EU ENTENDI DO SEU PEDIDO:\n`;
  prompt += `### TAREFA PRINCIPAL ###\n`;
  prompt += `${document.getElementById('solicitacao').value}\n\n`;
  prompt += `### CONTEXTO ###\n`;
  prompt += `${document.getElementById('detalhe').value}\n\n`;
  prompt += `O QUE EU TE ENTREGUEI ASSIM:\n`;
  prompt += `### RESTRIÇÕES - O QUE EVITAR ###\n`;
  prompt += `${document.getElementById('evitar').value || "Nenhuma restrição informada."}\n\n`;
  prompt += `### INSTRUÇÃO FINAL ###\n`;
  prompt += `Atue como um especialista sênior ultrapragmático. Vá direto à solução técnica ou prática. Elimine qualquer preâmbulo, validação óbvia ou cortesia robótica. Entregue exatamente o que foi pedido em blocos limpos, organizados e focados em execução imediata via celular.`;

  painel.innerText = prompt;
  painel.style.display = 'block';

  if(window.salvarNoGoogleSheets) {
    window.salvarNoGoogleSheets();
  }
}

function copiarPromptGerado() {
  let texto = document.getElementById('prompt-final').innerText;
  if(!texto) { alert('Clique em "Me ajuda com isso" primeiro!'); return; }
  navigator.clipboard.writeText(texto);
  alert('Prompt copiado!');
}

function executarFeedback(status) {
  let respostaTexto = document.getElementById('resposta_ia').value;
  let relatorioFeedback = `ANÁLISE DE FEEDBACK E CAUSA RAIZ (NÍVEL ALTO):\nStatus da Interação: [${status.toUpperCase()}]\n\nCONTEÚDO ANALISADO DA IA:\n${respostaTexto || "Nenhum texto colado."}`;

  let painel = document.getElementById('prompt-final');
  painel.innerText = relatorioFeedback;
  painel.style.display = 'block';
  window.ultimoFeedbackGerado = relatorioFeedback;

  if(window.enviarFeedbackPlanilha) {
    window.enviarFeedbackPlanilha(status);
  }
}

function copiarRelatorioFeedback() {
  if(!window.ultimoFeedbackGerado) { alert('Gere um feedback clicando em um dos botões de avaliação primeiro.'); return; }
  navigator.clipboard.writeText(window.ultimoFeedbackGerado);
  alert('Relatório de causa raiz copiado!');
}

function gerarRelatorioPDF() {
  window.print();
}