// URL do Web App do Google Apps Script
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbz71lcPsaUo9ktgAIrDvCDl04IDNa91Uem3GmgANH7SFlBXM-oFtQ8COUmCAKRj4PJ35w/exec";

// Variável global para armazenar email do usuário
let usuarioEmail = null;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log("🔄 App inicializando...");
  
  // Verificar se tem email salvo no localStorage
  const emailSalvo = localStorage.getItem('neuroEmail');
  if (emailSalvo) {
    console.log("✅ Email encontrado no localStorage:", emailSalvo);
    usuarioEmail = emailSalvo;
    mostrarLoginSucesso(emailSalvo);
    carregarExercicio();
  } else {
    console.log("❌ Nenhum email salvo. Mostrando formulário de login.");
    mostrarFormularioLogin();
  }
});

// ===== FUNÇÕES DE LOGIN =====

function mostrarFormularioLogin() {
  const loginDiv = document.getElementById('login');
  if (!loginDiv) {
    console.error("❌ Elemento 'login' não encontrado no HTML!");
    return;
  }
  
  loginDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #1c3b57, #2a5a7f); padding: 20px; border-radius: 10px; max-width: 350px; margin: 0 auto; border-left: 4px solid #f39c12; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
      <p style="color: #f39c12; font-weight: bold; font-size: 16px; margin: 0 0 15px 0;">📧 Faça login para começar</p>
      
      <input 
        type="email" 
        id="emailInput" 
        placeholder="seu@email.com" 
        style="width: 100%; padding: 12px; margin-bottom: 12px; border: 2px solid #34495e; border-radius: 6px; background: #0a2a43; color: #fff; font-size: 14px; box-sizing: border-box; transition: border-color 0.3s;"
        onkeypress="if(event.key==='Enter') fazerLogin()"
      >
      
      <button 
        onclick="fazerLogin()" 
        style="width: 100%; padding: 12px; background: #f39c12; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"
        onmouseover="this.style.background='#d35400'; this.style.transform='translateY(-2px)';"
        onmouseout="this.style.background='#f39c12'; this.style.transform='translateY(0)';"
      >
        ✅ Entrar
      </button>
      
      <p id="erroLogin" style="color: #e74c3c; font-size: 12px; margin-top: 10px; display: none;"></p>
    </div>
  `;
  
  // Focar no input automaticamente
  setTimeout(() => {
    const input = document.getElementById('emailInput');
    if (input) input.focus();
  }, 100);
}

function fazerLogin() {
  const emailInput = document.getElementById('emailInput');
  const erroLogin = document.getElementById('erroLogin');
  
  if (!emailInput) {
    console.error("❌ Input de email não encontrado!");
    return;
  }
  
  const email = emailInput.value.trim().toLowerCase();
  
  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    console.error("❌ Email inválido:", email);
    if (erroLogin) {
      erroLogin.textContent = "❌ Digite um email válido!";
      erroLogin.style.display = 'block';
    }
    emailInput.style.borderColor = '#e74c3c';
    return;
  }
  
  console.log("✅ Email válido:", email);
  
  // Salvar email no localStorage
  localStorage.setItem('neuroEmail', email);
  usuarioEmail = email;
  
  // Atualizar UI
  mostrarLoginSucesso(email);
  carregarExercicio();
  
  console.log("✅ Login realizado com sucesso!");
}

function mostrarLoginSucesso(email) {
  const loginDiv = document.getElementById('login');
  if (!loginDiv) return;
  
  loginDiv.innerHTML = `
    <div style="background: linear-gradient(135deg, #27ae60, #229954); padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); max-width: 600px; margin: 0 auto;">
      <p style="color: #fff; font-weight: bold; margin: 0; font-size: 14px;">
        ✅ Logado como: <strong style="color: #fff;">${email}</strong>
      </p>
      <button 
        onclick="fazerLogout()" 
        style="padding: 8px 15px; background: #c0392b; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px; transition: all 0.3s;"
        onmouseover="this.style.background='#a93226'; this.style.transform='translateY(-1px)';"
        onmouseout="this.style.background='#c0392b'; this.style.transform='translateY(0)';"
      >
        🚪 Sair
      </button>
    </div>
  `;
}

function fazerLogout() {
  console.log("🔄 Fazendo logout...");
  usuarioEmail = null;
  localStorage.removeItem('neuroEmail');
  mostrarFormularioLogin();
  document.getElementById('exercise').innerHTML = '';
  document.getElementById('progressChart').innerHTML = '';
  console.log("✅ Logout realizado!");
}

// ===== CARREGAR EXERCÍCIO DO DIA =====

function carregarExercicio() {
  if (!usuarioEmail) {
    console.warn("⚠️ Usuário não autenticado. Não carregando exercício.");
    return;
  }
  
  console.log("📚 Carregando exercício...");
  
  fetch('data.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        throw new Error("data.json está vazio ou inválido");
      }
      
      // Calcular exercício do dia
      let today = new Date().getDate() % data.length;
      let ex = data[today];
      
      console.log("✅ Exercício #" + ex.numero + " carregado:", ex.pergunta);
      
      // Sanitizar strings para evitar problemas com HTML/JavaScript
      const perguntaSafe = ex.pergunta.replace(/"/g, '&quot;').replace(/'/g, "&#39;");
      const respostaSafe = ex.resposta.replace(/"/g, '&quot;').replace(/'/g, "&#39;");
      
      const exerciseDiv = document.getElementById('exercise');
      if (!exerciseDiv) {
        console.error("❌ Elemento 'exercise' não encontrado!");
        return;
      }
      
      exerciseDiv.innerHTML = `
        <div style="background: #1c3b57; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; border-left: 4px solid #f39c12; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
          <h2 style="color: #f39c12; margin-top: 0;">📚 Exercício #${ex.numero}</h2>
          
          <div style="background: #0a2a43; padding: 12px; border-radius: 6px; margin-bottom: 15px;">
            <p style="color: #f39c12; font-weight: bold; margin-top: 0; margin-bottom: 5px;">❓ Pergunta:</p>
            <p style="color: #fff; margin: 0;">${ex.pergunta}</p>
          </div>
          
          <div style="background: #0a2a43; padding: 12px; border-radius: 6px; margin-bottom: 15px;">
            <p style="color: #27ae60; font-weight: bold; margin-top: 0; margin-bottom: 5px;">💡 Resposta Sugerida:</p>
            <p style="color: #fff; margin: 0;">${ex.resposta}</p>
          </div>
          
          <hr style="border: 1px solid #34495e; margin: 20px 0;">
          
          <label for="erro" style="display: block; color: #f39c12; font-weight: bold; margin-bottom: 5px;">❌ Erro (o que você fez errado?):</label>
          <input type="text" id="erro" placeholder="Ex: Procrastinei demais" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 2px solid #34495e; border-radius: 6px; background: #0a2a43; color: #fff; font-size: 14px; box-sizing: border-box;">
          
          <label for="acerto" style="display: block; color: #27ae60; font-weight: bold; margin-bottom: 5px;">✅ Acerto (o que funcionou?):</label>
          <input type="text" id="acerto" placeholder="Ex: Comecei pequeno" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 2px solid #34495e; border-radius: 6px; background: #0a2a43; color: #fff; font-size: 14px; box-sizing: border-box;">
          
          <label for="sugestao" style="display: block; color: #3498db; font-weight: bold; margin-bottom: 5px;">💬 Sugestão (como melhorar?):</label>
          <textarea id="sugestao" placeholder="Ex: Fazer pausas mais frequentes" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 2px solid #34495e; border-radius: 6px; background: #0a2a43; color: #fff; font-size: 14px; box-sizing: border-box; min-height: 80px; font-family: Arial;"></textarea>
          
          <label for="progresso" style="display: block; color: #e74c3c; font-weight: bold; margin-bottom: 5px;">📊 Progresso (1-9):</label>
          <input type="number" id="progresso" min="1" max="9" value="${ex.progresso}" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 2px solid #34495e; border-radius: 6px; background: #0a2a43; color: #fff; font-size: 14px; box-sizing: border-box;">
          
          <button 
            onclick="salvar(${ex.numero}, '${perguntaSafe}', '${respostaSafe}')" 
            style="width: 100%; padding: 15px; background: #f39c12; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"
            onmouseover="this.style.background='#d35400'; this.style.transform='translateY(-2px); this.style.boxShadow='0 4px 8px rgba(0,0,0,0.3)';"
            onmouseout="this.style.background='#f39c12'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.2)';"
          >
            💾 Salvar no Google Sheets
          </button>
        </div>
      `;
      
      // Renderizar gráfico
      renderChart(ex.progresso);
    })
    .catch(error => {
      console.error("❌ Erro ao carregar dados:", error);
      const exerciseDiv = document.getElementById('exercise');
      if (exerciseDiv) {
        exerciseDiv.innerHTML = `<p style="color: #e74c3c; text-align: center; padding: 20px;">❌ Erro ao carregar exercício. Detalhes: ${error.message}</p>`;
      }
    });
}

// ===== GRÁFICO DE PROGRESSO =====

function renderChart(progresso) {
  const canvasContainer = document.getElementById('progressChart');
  if (!canvasContainer) {
    console.error("❌ Canvas não encontrado!");
    return;
  }
  
  // Limpar canvas anterior
  canvasContainer.innerHTML = '<canvas id="myChart"></canvas>';
  
  const ctx = document.getElementById('myChart');
  if (!ctx) {
    console.error("❌ Context do canvas não obtido!");
    return;
  }
  
  // Destruir gráfico anterior se existir
  if (window.progressChart instanceof Chart) {
    window.progressChart.destroy();
  }
  
  window.progressChart = new Chart(ctx.getContext('2d'), {
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
  
  console.log("✅ Gráfico renderizado!");
}

// ===== SALVAR DADOS =====

function salvar(numero, pergunta, resposta) {
  console.log("💾 Iniciando salvamento...");
  
  // Validar campos
  let erro = document.getElementById('erro').value.trim();
  let acerto = document.getElementById('acerto').value.trim();
  let sugestao = document.getElementById('sugestao').value.trim();
  let progresso = document.getElementById('progresso').value;
  
  if (!erro || !acerto || !sugestao || !progresso) {
    alert("⚠️ Preencha todos os campos antes de salvar!");
    console.warn("❌ Campos não preenchidos!");
    return;
  }
  
  // Preparar dados
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
  
  console.log("📤 Enviando payload:", payload);
  
  // Desabilitar botão
  const button = event.target;
  const textOriginal = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '⏳ Enviando...';
  
  // Enviar para Google Sheets
  fetch(SHEETS_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    console.log("✅ Resposta recebida:", data);
    
    if (data.status === 'sucesso') {
      alert("✅ Dados salvos com sucesso no Google Sheets!");
      // Limpar formulário
      document.getElementById('erro').value = '';
      document.getElementById('acerto').value = '';
      document.getElementById('sugestao').value = '';
    } else {
      alert("❌ Erro ao salvar: " + (data.message || "Tente novamente"));
    }
  })
  .catch(error => {
    console.error("❌ Erro na requisição:", error);
    alert("❌ Erro na conexão com Google Sheets.\n\nDetalhes: " + error.message);
  })
  .finally(() => {
    button.disabled = false;
    button.innerHTML = textOriginal;
  });
}
