let tempoRestante = 180;
const timerElement = document.getElementById('timer');

// Cronômetro de 3 minutos
const cronometro = setInterval(() => {
    if (tempoRestante <= 0) {
        clearInterval(cronometro);
        document.getElementById('btn-salvar').disabled = true;
        document.getElementById('timer-box').style.background = "#475569";
    } else {
        tempoRestante--;
        const min = Math.floor(tempoRestante / 60);
        const seg = tempoRestante % 60;
        timerElement.innerText = `${min}:${seg < 10 ? '0' : ''}${seg}`;
    }
}, 1000);

document.getElementById('data-atual').innerText = new Date().toLocaleDateString('pt-BR');

function salvarDados() {
    const dados = {
        data: new Date().toLocaleDateString('pt-BR'),
        familia: document.getElementById('familia').value || 0,
        sono: document.getElementById('sono').value || 0,
        produtiva: document.getElementById('produtiva').value || 0,
        improdutiva: document.getElementById('improdutiva').value || 0,
        financeiro: (document.getElementById('financeiro_in').value || 0) - (document.getElementById('financeiro_out').value || 0),
        diario: document.getElementById('diario_obra').value
    };

    // Salva com chave única por data para garantir imutabilidade
    const chave = "Gov_" + new Date().toISOString().split('T')[0];
    localStorage.setItem(chave, JSON.stringify(dados));

    exibirResumo(dados);
}

function exibirResumo(dados) {
    clearInterval(cronometro);
    document.getElementById('diario').classList.add('hidden');
    document.getElementById('relatorio').classList.remove('hidden');
    
    const container = document.getElementById('dados-visualizacao');
    container.innerHTML = `
        <div style="text-align: left; line-height: 1.6;">
            <p><strong>🏠 Família:</strong> ${dados.familia}h</p>
            <p><strong>😴 Sono:</strong> Nota ${dados.sono}</p>
            <p><strong>✅ Produtiva:</strong> ${dados.produtiva}h</p>
            <p><strong>❌ Improdutiva:</strong> ${dados.improdutiva}h</p>
            <p><strong>💰 Saldo:</strong> R$ ${dados.financeiro}</p>
            <p><strong>📝 Diário:</strong> ${dados.diario || 'Vazio'}</p>
        </div>
    `;
}