const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxreIMR3__OyjMRA4qjzMJTHr6PMTMTDzvo7fdWo1EJJGntaYGBNv_DfMGBmQIl-eeA/exec";
const STORAGE_KEY = "prospect_clients";
const SYNC_QUEUE = "sync_queue";

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
    registrarServiceWorker();
    configurarNotificacoes();
});

// ========== SERVICE WORKER (Offline) ==========
async function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('service-worker.js');
            console.log('✅ Service Worker registrado');
        } catch (erro) {
            console.log('Service Worker não disponível');
        }
    }
}

// ========== SALVAR CLIENTE COM VALIDAÇÕES ==========
async function salvarCliente() {
    const cliente = document.getElementById("cliente").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const tipo = document.getElementById("tipo").value;
    const observacao = document.getElementById("observacao").value.trim();
    const retorno = document.getElementById("retorno").value;

    // Validações
    if (!cliente) {
        mostrarStatus("❌ Digite o nome do cliente", "erro");
        return;
    }

    if (!telefone || telefone.length < 10) {
        mostrarStatus("❌ Telefone inválido", "erro");
        return;
    }

    if (!retorno) {
        mostrarStatus("❌ Data de retorno obrigatória", "erro");
        return;
    }

    // Gerar ID único para o cliente
    const clienteId = gerarID();
    const dataAtual = obterDataHora();

    const dados = {
        id: clienteId,
        cliente,
        telefone,
        tipo,
        observacao,
        retorno,
        dataHora: dataAtual,
        status: "novo"
    };

    // Salvar localmente primeiro (offline)
    salvarClienteLocal(dados);

    // Tentar sincronizar com Google
    document.getElementById("status").innerHTML = "⏳ Salvando cliente...";
    document.getElementById("btnSalvar").disabled = true;

    try {
        const resposta = await fetch(URL_SCRIPT, {
            method: "POST",
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            mostrarStatus("✅ Cliente salvo com sucesso!", "sucesso");
            marcarClienteSincronizado(clienteId);
            
            // Limpar campos
            document.querySelectorAll("input, textarea").forEach(i => i.value = "");
            document.getElementById("tipo").value = "CONSTRUTORA";
            
            // Atualizar histórico
            carregarHistorico();
        }
    } catch (erro) {
        mostrarStatus("⚠️ Salvo localmente. Será sincronizado quando online.", "aviso");
        console.log(erro);
    }

    document.getElementById("btnSalvar").disabled = false;
}

// ========== SALVAR CLIENTE LOCALMENTE ==========
function salvarClienteLocal(dados) {
    let clientes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    clientes.push(dados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

// ========== ABRIR WHATSAPP COM PRÉ-PREENCHIMENTO ==========
function abrirWhatsapp() {
    const cliente = document.getElementById("cliente").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const tipo = document.getElementById("tipo").value;
    const observacao = document.getElementById("observacao").value.trim();

    if (!cliente) {
        mostrarStatus("❌ Digite o nome do cliente primeiro", "erro");
        return;
    }

    // Formatar telefone
    const foneFormatado = formatarTelefone(telefone);
    const seuNumero = "5531984821901";

    // Criar mensagem personalizada
    const mensagem = `Olá! 👋

Vim falar sobre a prospecção de *Governança MP* para sua empresa.

📌 *Cliente:* ${cliente}
📁 *Tipo:* ${tipo}
${observacao ? `📝 *Observação:* ${observacao}` : ''}

Podemos conversar agora?

Att. Seta Soluções
(31) 98482-1901`;

    const textoEncoded = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${seuNumero}?text=${textoEncoded}`, '_blank');
}

// ========== HISTÓRICO DE CLIENTES ==========
function carregarHistorico() {
    const clientes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const container = document.getElementById("historico");

    if (!container) return;

    if (clientes.length === 0) {
        container.innerHTML = "<p style='color: #94a3b8; text-align: center;'>Nenhum cliente registrado</p>";
        return;
    }

    // Ordenar por data mais recente
    clientes.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

    let html = "<h3 style='color: #f97316; margin-bottom: 15px;'>📋 Últimos Clientes</h3>";
    
    clientes.slice(0, 10).forEach(cli => {
        const statusClass = cli.status === "sincronizado" ? "sincronizado" : "pendente";
        const statusIcon = cli.status === "sincronizado" ? "✅" : "⏳";

        html += `
            <div class="cliente-item ${statusClass}">
                <div class="cliente-info">
                    <strong>${cli.cliente}</strong>
                    <p>${cli.tipo} • ${cli.telefone}</p>
                    <small>Retorno: ${cli.retorno}</small>
                </div>
                <div class="cliente-actions">
                    <button class="btn-mini" onclick="abrirWhatsappCliente('${cli.telefone}', '${cli.cliente}')">📱 WhatsApp</button>
                    <button class="btn-mini" onclick="deletarCliente('${cli.id}')">🗑️</button>
                </div>
                <span class="status-badge">${statusIcon}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== WHATSAPP PARA CLIENTE DO HISTÓRICO ==========
function abrirWhatsappCliente(telefone, cliente) {
    const seuNumero = "5531984821901";
    const mensagem = `Olá ${cliente}! 👋\n\nVim falar sobre a prospecção de Governança MP.\n\nPodemos conversar agora?\n\nAtt. Seta Soluções`;
    const textoEncoded = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${seuNumero}?text=${textoEncoded}`, '_blank');
}

// ========== DELETAR CLIENTE ==========
function deletarCliente(clienteId) {
    if (!confirm("Deseja deletar este cliente?")) return;
    
    let clientes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    clientes = clientes.filter(c => c.id !== clienteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    carregarHistorico();
    mostrarStatus("🗑️ Cliente deletado", "info");
}

// ========== EXPORTAR PARA EXCEL ==========
function exportarParaExcel() {
    const clientes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    if (clientes.length === 0) {
        mostrarStatus("❌ Nenhum cliente para exportar", "erro");
        return;
    }

    let csv = "DATA,HORA,CLIENTE,TELEFONE,TIPO,OBSERVAÇÃO,RETORNO,STATUS\n";
    
    clientes.forEach(cli => {
        const [data, hora] = cli.dataHora.split(" ");
        csv += `"${data}","${hora}","${cli.cliente}","${cli.telefone}","${cli.tipo}","${cli.observacao}","${cli.retorno}","${cli.status}"\n`;
    });

    // Criar blob e download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${obterData()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarStatus("✅ Arquivo exportado!", "sucesso");
}

// ========== SINCRONIZAR PENDENTES ==========
async function sincronizarPendentes() {
    const clientes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const naoSincronizados = clientes.filter(c => c.status !== "sincronizado");

    if (naoSincronizados.length === 0) {
        mostrarStatus("✅ Tudo sincronizado!", "info");
        return;
    }

    mostrarStatus(`⏳ Sincronizando ${naoSincronizados.length} cliente(s)...`, "info");

    for (let cliente of naoSincronizados) {
        try {
            await fetch(URL_SCRIPT, {
                method: "POST",
                body: JSON.stringify(cliente)
            });
            marcarClienteSincronizado(cliente.id);
        } catch (erro) {
            console.log("Erro ao sincronizar:", erro);
        }
    }

    mostrarStatus("✅ Sincronização concluída!", "sucesso");
    carregarHistorico();
}

// ========== MARCAR COMO SINCRONIZADO ==========
function marcarClienteSincronizado(clienteId) {
    let clientes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    clientes = clientes.map(c => 
        c.id === clienteId ? { ...c, status: "sincronizado" } : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

// ========== NOTIFICAÇÕES ==========
function configurarNotificacoes() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function enviarNotificacao(titulo, opcoes = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(titulo, {
            icon: '📱',
            ...opcoes
        });
    }
}

// ========== UTILITÁRIOS ==========
function gerarID() {
    return `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function obterDataHora() {
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR');
    const hora = agora.toLocaleTimeString('pt-BR');
    return `${data} ${hora}`;
}

function obterData() {
    return new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
}

function formatarTelefone(tel) {
    return tel.replace(/\D/g, '').padStart(11, '55');
}

function mostrarStatus(mensagem, tipo = 'info') {
    const status = document.getElementById("status");
    status.innerHTML = mensagem;
    status.className = `status ${tipo}`;
    
    if (tipo === 'sucesso' || tipo === 'info') {
        setTimeout(() => {
            status.innerHTML = '';
            status.className = '';
        }, 4000);
    }
}

// ========== MONITORAR CONEXÃO ==========
window.addEventListener('online', () => {
    mostrarStatus("✅ Conectado! Sincronizando dados...", "info");
    sincronizarPendentes();
});

window.addEventListener('offline', () => {
    mostrarStatus("⚠️ Modo offline - dados serão sincronizados quando voltar online", "aviso");
});
