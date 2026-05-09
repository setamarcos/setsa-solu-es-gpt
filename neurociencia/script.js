// URL do Web App do Google Apps Script
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz71lcPsaUo9ktgAIrDvCDl04IDNa91Uem3GmgANH7SFlBXM-oFtQ8COUmCAKRj4PJ35w/exec";

// Variável global para armazenar email do usuário
let usuarioEmail = localStorage.getItem('usuarioEmail') || null;

// Inicializar login ao carregar página
document.addEventListener('DOMContentLoaded', function() {
  if (usuarioEmail) {
    mostrarLoginSucesso();
  } else {
    mostrarFormularioLogin();
  }
  carregarExercicio();
});

// Mostrar formulário de login
function mostrarFormularioLogin() {
  const loginDiv = document.getElementById('login');
  loginDiv.innerHTML = `
    <div style="background: #1c3b57; padding: 15px; border-radius: 8px; max-width: 300px;">
      <p style="color: #f39c12; font-weight: bold;">📧 Faça login para começar:</p>
      <input type="email" id="emailInput" placeholder="Seu email..." style="width: 100%; padding: 10px; margin-bottom: 10px; border: none; border-radius: 5px; box-sizing: border-box;">
      <button onclick="fazerLogin()" style="width: 100%; padding: 10px; background: #f39c12; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
        ✅ Entrar
      </button>
    </div>
  `;
}

// Fazer login
function fazerLogin() {
  const email = document.getElementById('emailInput').value.trim();
  
  if (!email || !email.includes('@')) {
    alert('❌ Digite um email válido!');
    return;
  }
  
  usuarioEmail = email;
  localStorage.setItem('usuarioEmail', email);
  mostrarLoginSucesso();
  carregarExercicio();
}

// Mostrar sucesso do login
function mostrarLoginSucesso() {
  const loginDiv = document.getElementById('login');
  loginDiv.innerHTML = `
    <div style="background: #27ae60; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
      <p style="color: #fff; font-weight: bold; margin: 0;">✅ Logado como: <strong>${usuarioEmail}</strong></p>
      <button onclick="fazerLogout()" style="padding: 8px 15px; background: #c0392b; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
        Sair
      </button>
    </div>
  `;
}

// Fazer logout
function fazerLogout() {
  usuarioEmail = null;
  localStorage.removeItem('usuarioEmail');
  mostrarFormularioLogin();
  document.getElementById('exercise').innerHTML = '';
}

// Carregar exercício do dia
function carregarExercicio() {
  if (!usuarioEmail) return;
  
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      let today = new Date().getDate() % data.length;
      let ex = data[today];
      
      // Sanitizar strings para evitar problemas com aspas
      const perguntaSafe = ex.pergunta.replace(/"/g, '&quot;').replace(/'/g, "\\'");
      const respostaSafe = ex.resposta.replace(/"/g, '&quot;').replace(/'/g, "\\'");
      
      document.getElementById('exercise').innerHTML =
        `<div style="background: #1c3b57; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f39c12; margin-top: 0;">📚 Exercício #${ex.numero}</h2>
          <p><strong style="color: #f39c12;">❓ Pergunta:</strong> ${ex.pergunta}</p>
          <p><strong style="color: #27ae60;">💡 Resposta:</strong> ${ex.resposta}</p>
          <hr style="border: 1px solid #34495e;">
          
          <label for="erro" style="display: block; color: #f39c12; font-weight: bold; margin-top: 15px;">❌ Erro (o que você fez errado?):</label>
          <input type="text" id="erro" placeholder="Ex: Procrastinei demais" style="width: 100%; padding: 10px; margin-top: 5px; border-radius: 5px; border: none; box-sizing: border-box;">
          
          <label for="acerto" style="display: block; color: #27ae60; font-weight: bold; margin-top: 15px;">✅ Acerto (o que funcionou?):</label>
          <input type="text" id="acerto" placeholder="Ex: Comecei pequeno" style="width: 100%; padding: 10px; margin-top: 5px; border-radius: 5px; border: none; box-sizing: border-box;">
          
          <label for="sugestao" style="display: block; color: #e74c3c; font-weight: bold; margin-top: 15px;">💬 Sugestão (como melhorar?):</label>
          <textarea id="sugestao" placeholder="Ex: Fazer pausas mais frequentes" style="width: 100%; padding: 10px; margin-top: 5px; border-radius: 5px; border: none; box-sizing: border-box; min-height: 80px; font-family: Arial;"></textarea>
          
          <label for="progresso" style="display: block; color: #3498db; font-weight: bold; margin-top: 15px;">📊 Progresso (1-9):</label>
          <input type="number" id="progresso" min="1" max="9" value="${ex.progresso}" style="width: 100%; padding: 10px; margin-top: 5px; border-radius: 5px; border: none; box-sizing: border-box;">
          
          <button onclick="salvar(${ex.numero}, '${perguntaSafe}', '${respostaSafe}')" style="width: 100%; padding: 15px; margin-top: 20px; background: #f39c12; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px;">
            💾 Salvar no Google Sheets
          </button>
        </div>`;
      
      renderChart(ex.progresso);
    })
    .catch(error => {
      console.error("Erro ao carregar dados:", error);
      document.getElementById('exercise').innerHTML = '<p style="color: #e74c3c;">❌ Erro ao carregar exercício. Verifique o arquivo data.json</p>';
    });
}

// Renderizar gráfico de progresso
function renderChart(progresso) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  
  // Destruir gráfico anterior se existir
  if (window.progressChart) {
    window.progressChart.destroy();
  }
  
  window.progressChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Progresso Atual'],
      datasets: [{
        label: 'Nível (1-9)',
        data: [progresso],
        backgroundColor: '#f39c12',
        borderColor: '#d35400',
        borderWidth: 2,
        borderRadius: 5
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          beginAtZero: true,
          max: 9,
          ticks: {
            color: '#fff',
            font: { size: 12 }
          },
          grid: {
            color: '#34495e'
          }
        },
        y: {
          ticks: {
            color: '#fff',
            font: { size: 12 }
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff',
            font: { size: 12 }
          }
        }
      }
    }
  });
}

// Salvar dados no Google Sheets
function salvar(numero, pergunta, resposta) {
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
  
  // Desabilitar botão durante envio
  const button = event.target;
  button.disabled = true;
  button.innerHTML = '⏳ Enviando...';
  
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
    alert("❌ Erro na conexão com Google Sheets.\nVerifique se a URL está correta.");
  })
  .finally(() => {
    button.disabled = false;
    button.innerHTML = '💾 Salvar no Google Sheets';
  });
}
