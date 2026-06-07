// ... mantém tudo igual da v2.1.1 até iniciarControlesVoz ...

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
        textarea.value += (textarea.value ? '\n\n' : '') + texto;
      } else if (modoVoz === 'paragrafo') {
        if (!texto.endsWith('.')) texto += '.';
        textarea.value += (textarea.value ? '\n\n' : '') + texto;
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

function compartilharWhatsApp() {
  const nota = document.getElementById('notaFinal').textContent || 'N/A';
  const texto = `Segue redação.\n\nNota: ${nota}\n\nEnviado via Laura Mentoria 2.1.2`;
  const numeroDestino = '5531984821901';
  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}