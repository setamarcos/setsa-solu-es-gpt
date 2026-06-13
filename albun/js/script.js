// Função: Gera conteúdo com IA do Gemini
// Objetivo: Mandar título/história pro Gemini e retornar sugestões de subtítulo + texto
async function gerarComIA() {
  
  // 1. VALIDAÇÃO: Checa se a chave foi trocada
  if(GEMINI_API_KEY === "AQ.Ab8RN6LjHAWOlkyT1mKiCT6p2-3Luakrza_UxwoWJxktCumP-gI") {
    alert("Cole sua chave no arquivo js/app.js primeiro!");
    return;
  }

  // 2. CAPTURA DADOS: Pega valores dos inputs, com fallback se vazio
  const titulo = document.getElementById('titulo').value || "Meu Álbum";
  const historia = document.getElementById('historia').value || "Sem história";
  
  // 3. UI: Remove resultado anterior se existir, pra não duplicar
  const resultadoAntigo = document.getElementById('resultado-ia');
  if(resultadoAntigo) {
    resultadoAntigo.remove();
  }
  
  // 4. UI: Cria div de carregamento
  const resultado = document.createElement('div');
  resultado.id = 'resultado-ia'; // ID pra poder remover depois
  resultado.innerHTML = '⏳ Gerando com IA...';
  resultado.className = 'resultado-ia'; // Usa classe CSS em vez de style inline
  document.querySelector('.container').appendChild(resultado);

  try {
    // 5. API CALL: Faz requisição pro Gemini 1.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Crie um subtítulo criativo e 3 frases de história para um álbum chamado "${titulo}". A história base é: ${historia}`
            }]
          }]
        })
      }
    );
    
    // 6. TRATAMENTO: Converte resposta pra JSON
    const data = await response.json();
    
    // 7. VALIDAÇÃO: Checa se veio candidato válido
    if(data.candidates && data.candidates[0] && data.candidates[0].content) {
      const texto = data.candidates[0].content.parts[0].text;
      resultado.innerHTML = `<h3>✨ IA Gerou:</h3><pre>${texto}</pre>`;
    } else if(data.error) {
      // 8. ERRO DA API: Se Google retornar erro
      resultado.innerHTML = `<p style="color:red">Erro da API: ${data.error.message}</p>`;
    } else {
      resultado.innerHTML = `<p style="color:red">Erro: Resposta vazia da IA</p>`;
    }
    
  } catch(e) {
    // 9. ERRO DE REDE: Se falhar conexão ou CORS
    resultado.innerHTML = `<p style="color:red">Erro: ${e.message}. Verifica se a chave está correta e se o domínio está liberado.</p>`;
  }
}