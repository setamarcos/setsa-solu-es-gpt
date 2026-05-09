// URL do Web App do Google Apps Script
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz71lcPsaUo9ktgAIrDvCDl04IDNa91Uem3GmgANH7SFlBXM-oFtQ8COUmCAKRj4PJ35w/exec";

// Variável global para armazenar email do usuário
let usuarioEmail = null;

// Login com Google OAuth
function handleCredentialResponse(response) {
  try {
    // Decodificar o JWT do Google
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const data = JSON.parse(jsonPayload);
    usuarioEmail = data.email;
    
    document.getElementById("login").innerHTML =
      `<p style="color: #27ae60; font-weight: bold;">✅ Logado como: ${data.email}</p>`;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    document.getElementById("login").innerHTML = 
      `<p style="color: #e74c3c;">Erro ao fazer login. Tente novamente.</p>`;
  }
}

// Função para fazer logout
function fazerLogout() {
  usuarioEmail = null;
  document.getElementById("login").innerHTML = 
    `<div id="g_id_onload" data-client_id="SEU_CLIENT_ID_AQUI" data-callback="handleCredentialResponse"></div>
     <div class="g_id_signin" data-type="standard"></div>`;
}

// Carregar exercício do dia
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    let today = new Date().getDate() % data.length;
    let ex = data[today];
    
    document.getElementById('exercise').innerHTML =
      `<h2>📚 Exercício #${ex.numero}</h2>
       <p><strong>❓ Pergunta:</strong> ${ex.pergunta}</p>
       <p><strong>💡 Resposta:</strong> ${ex.resposta}</p>
       <hr>
       <label for="erro">❌ Erro (o que você fez errado?):</label>
       <input type="text" id="erro" placeholder="Ex: Procrastinei demais">
       
       <label for="acerto">✅ Acerto (o que funcionou?):</label>
       <input type="text" id="acerto" placeholder="Ex: Comecei pequeno">
       
       <label for="sugestao">💬 Sugestão (como melhorar?):</label>
       <textarea id="sugestao" placeholder="Ex: Fazer pausas mais frequentes"></textarea>
       
       <label for="progresso">📊 Progresso (1-9):</label>
       <input type="number" id="progresso" min="1" max="9" value="${ex.progresso}">
       
       <button onclick="salvar(${ex.numero}, '${ex.pergunta.replace(/'/g, "\\'")}', '${ex.resposta.replace(/'/g, "\\'")}')" style="width: 100%; margin-top: 20px;">
         💾 Salvar no Google Sheets
       </button>`;
    
    renderChart(ex.progresso);
  })
  .catch(error => console.error("Erro ao carregar dados:", error));

function renderChart(progresso) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  
  // Destruir gráfico anterior se existir
  if (window.progressChart) {
    window.progressChart.destroy();
  }
  
  window.progressChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Nível de Progresso'],
      datasets: [{
        label: 'Progresso (1-9)',
        data: [progresso],
        backgroundColor: ['#f39c12'],
        borderColor: '#d35400',
        borderWidth: 2,
        borderRadius: 5
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          max: 9,
          ticks: {
            color: '#fff'
          },
          grid: {
            color: '#34495e'
          }
        },
        y: {
          ticks: {
            color: '#fff'
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });
}

function salvar(numero, pergunta, resposta) {
  // Validar login
  if (!usuarioEmail) {
    alert("⚠️ Você precisa fazer login com Google antes de salvar!");
    return;
  }
  
  // Validar campos
  let erro = document.getElementById('erro').value.trim();
  let acerto = document.getElementById('acerto').value.trim();
  let sugestao = document.getElementById('sugestao').value.trim();
  let progresso = document.getElementById('progresso').value;
  
  if (!erro || !acerto || !sugestao || !progresso) {
    alert("⚠️ Preencha todos os campos antes de salvar!");
    return;
  }
  
  // Preparar dados para enviar
  let payload = {
    email: usuarioEmail,
    numero: numero,
    pergunta: pergunta,
    resposta: resposta,
    erro: erro,
    acerto: acerto,
    sugestao: sugestao,
    progresso: progresso,
    timestamp: new Date().toLocaleString('pt-BR')
  };
  
  // Enviar para Google Sheets via Apps Script
  fetch(SHEETS_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'sucesso') {
      alert("✅ Dados salvos com sucesso no Google Sheets!");
      // Limpar formulário
      document.getElementById('erro').value = '';
      document.getElementById('acerto').value = '';
      document.getElementById('sugestao').value = '';
      document.getElementById('progresso').value = '';
    } else {
      alert("❌ Erro ao salvar: " + (data.message || "Tente novamente"));
    }
  })
  .catch(error => {
    console.error("Erro:", error);
    alert("❌ Erro na conexão com Google Sheets. Verifique a URL do Apps Script.");
  });
}

// Carregar o botão de login do Google quando a página abrir
window.onload = function() {
  if (window.google && window.google.accounts) {
    google.accounts.id.initialize({
      client_id: "SEU_CLIENT_ID_AQUI"
    });
    google.accounts.id.renderButton(
      document.getElementById('login'),
      { 
        theme: 'dark', 
        size: 'large',
        text: 'signin_with'
      }
    );
  }
};
