// ========== CONFIGURAÇÃO GOOGLE ==========
const GOOGLE_CLIENT_ID = 'SEU_CLIENT_ID_AQUI'; // Substitua com seu Client ID
let usuarioLogado = null;
let tokenGoogle = null;

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    recuperarUsuario();
    document.getElementById('textoRedacao').addEventListener('input', atualizarContadores);
});

// ========== GOOGLE LOGIN ==========
function loginGoogle() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.querySelector('.btn-google'),
        { theme: 'outline', size: 'large' }
    );
}

function handleCredentialResponse(response) {
    // Decodificar JWT
    const decodedToken = jwt_decode(response.credential);
    usuarioLogado = {
        nome: decodedToken.name,
        email: decodedToken.email,
        foto: decodedToken.picture,
        token: response.credential
    };
    tokenGoogle = response.credential;
    
    // Salvar no localStorage
    localStorage.setItem('usuarioLaura', JSON.stringify(usuarioLogado));
    
    // Atualizar UI
    mostrarUsuario();
}

function recuperarUsuario() {
    const usuario = localStorage.getItem('usuarioLaura');
    if (usuario) {
        usuarioLogado = JSON.parse(usuario);
        mostrarUsuario();
    }
}

function mostrarUsuario() {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userName').textContent = `Bem-vindo, ${usuarioLogado.nome}!`;
    document.getElementById('userImg').src = usuarioLogado.foto;
}

function logoutGoogle() {
    usuarioLogado = null;
    tokenGoogle = null;
    localStorage.removeItem('usuarioLaura');
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

// ========== GERADOR DE TEMAS ==========
const temas = {
    5: [
        "Minha história com a leitura",
        "Um dia especial com minha família",
        "O lugar que mais gosto de ir",
        "Como eu ajudo em casa",
        "Meu melhor amigo e por que nos damos bem"
    ],
    6: [
        "A importância da amizade na escola",
        "Tecnologia e diversão: qual é o limite?",
        "Meu hobby favorito e por que gosto dele",
        "Bullying: um problema que afeta todos nós",
        "Os valores que meus pais me ensinaram"
    ],
    7: [
        "O impacto das redes sociais na adolescência",
        "Como a educação pode transformar vidas",
        "Meio ambiente: responsabilidade de todos",
        "Superando obstáculos e aprendendo com erros",
        "Consumismo: o que realmente precisamos?"
    ],
    8: [
        "Ética na era da Inteligência Artificial",
        "O desafio da leitura crítica no século XXI",
        "Desigualdade social: como podemos agir?",
        "Saúde mental adolescente: por que falar sobre isso?",
        "O papel das universidades na transformação social"
    ],
    9: [
        "Educação financeira: por que começar cedo?",
        "Mobilidade urbana e sustentabilidade",
        "Diversidade e inclusão na sociedade moderna",
        "O futuro do trabalho em um mundo tecnológico",
        "Crises climáticas: responsabilidade individual vs. coletiva"
    ]
};

function sortearTema() {
    const ano = document.getElementById('ano').value;
    const temasAno = temas[ano];
    const temaSorteado = temasAno[Math.floor(Math.random() * temasAno.length)];
    
    const display = document.getElementById('temaDisplay');
    display.innerHTML = `<div class="tema-sorteado"><strong>Tema:</strong> ${temaSorteado}</div>`;
}

// ========== PROCESSAMENTO DE FOTO (OCR) ==========
async function processarFoto() {
    const file = document.getElementById('inputFoto').files[0];
    if (!file) return;
    
    mostrarAviso('⏳ Processando imagem...');
    
    try {
        const worker = await Tesseract.createWorker('por');
        const result = await worker.recognize(file);
        const texto = result.data.text;
        
        document.getElementById('textoRedacao').value = texto;
        atualizarContadores();
        mostrarAviso('✅ Texto extraído com sucesso!');
        
        await worker.terminate();
    } catch (erro) {
        mostrarAviso('❌ Erro ao processar imagem: ' + erro.message);
    }
}

// ========== CONTADORES ==========
function atualizarContadores() {
    const texto = document.getElementById('textoRedacao').value.trim();
    
    // Contar palavras
    const palavras = texto.split(/\s+/).filter(p => p.length > 0).length;
    document.getElementById('contPalavras').textContent = palavras;
    
    // Contar frases (por . ! ?)
    const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0).length;
    document.getElementById('contFrases').textContent = frases;
    
    // Contar parágrafos (por quebra de linha dupla)
    const parafos = texto.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    document.getElementById('contParafos').textContent = parafos;
}

// ========== VALIDAÇÕES ==========
function validarRedacao(texto) {
    const validacoes = {
        temTitulo: false,
        numParafos: 0,
        numFrases: 0,
        numPalavras: 0,
        erros: []
    };
    
    const linhas = texto.split('\n').filter(l => l.trim().length > 0);
    
    // Verificar título (primeira linha curta)
    if (linhas.length > 0 && linhas[0].length > 5 && linhas[0].length < 100) {
        validacoes.temTitulo = true;
    }
    
    // Contar parágrafos
    const parafos = texto.split(/\n\n+/).filter(p => p.trim().length > 0);
    validacoes.numParafos = parafos.length;
    
    // Contar frases e palavras
    validacoes.numFrases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0).length;
    validacoes.numPalavras = texto.split(/\s+/).filter(p => p.length > 0).length;
    
    // Validar parágrafos
    parafos.forEach((p, i) => {
        const frasesPara = p.split(/[.!?]+/).filter(f => f.trim().length > 0);
        if (frasesPara.length < 3) {
            validacoes.erros.push(`Parágrafo ${i + 1}: menos de 3 frases`);
        }
    });
    
    return validacoes;
}

// ========== ANÁLISE COMPLETA ==========
function analisarRedacao() {
    const texto = document.getElementById('textoRedacao').value.trim();
    const ano = parseInt(document.getElementById('ano').value);
    
    if (texto.length < 100) {
        mostrarAviso('❌ Texto muito curto. Mínimo 100 caracteres.');
        return;
    }
    
    // Validações
    const validacoes = validarRedacao(texto);
    
    // Verificar se passou nas validações básicas
    if (!validacoes.temTitulo) {
        mostrarAviso('❌ Falta título na redação');
        return;
    }
    if (validacoes.numParafos < 4 || validacoes.numParafos > 5) {
        mostrarAviso(`❌ Deve ter entre 4 e 5 parágrafos. Você tem: ${validacoes.numParafos}`);
        return;
    }
    
    // Analisar erros
    const erros = detectarErros(texto);
    
    // Gerar feedback
    const feedback = gerarFeedback(texto, ano, validacoes, erros);
    
    // Calcular nota
    const nota = calcularNota(validacoes, erros, feedback);
    
    // Mostrar resultados
    mostrarResultados(validacoes, erros, feedback, nota);
}

// ========== DETECTAR ERROS ==========
function detectarErros(texto) {
    const erros = {
        ortografia: [],
        pontuacao: [],
        estrutura: [],
        concordancia: []
    };
    
    // Erros comuns em português
    const regexErros = [
        { regex: /\bpra\b/gi, correcao: 'para', tipo: 'ortografia' },
        { regex: /\btambem\b/gi, correcao: 'também', tipo: 'ortografia' },
        { regex: /\btá\b/gi, correcao: 'está', tipo: 'ortografia' },
        { regex: /\bmais\b\s+\bmais\b/gi, correcao: 'cada vez mais', tipo: 'estrutura' },
        { regex: /[,.]\s*[,.]/, correcao: 'remover pontuação duplicada', tipo: 'pontuacao' }
    ];
    
    regexErros.forEach(item => {
        let match;
        while ((match = item.regex.exec(texto)) !== null) {
            erros[item.tipo].push({
                encontrado: match[0],
                correcao: item.correcao,
                posicao: match.index
            });
        }
    });
    
    return erros;
}

// ========== GERAR FEEDBACK ==========
function gerarFeedback(texto, ano, validacoes, erros) {
    const feedback = {
        positivos: [],
        melhorias: [],
        orientacoes: []
    };
    
    // Análise por série
    const criteriosAno = {
        5: { minPalavras: 300, maxPalavras: 800, conectivos: ['e', 'mas', 'porque'] },
        6: { minPalavras: 400, maxPalavras: 1000, conectivos: ['portanto', 'além disso', 'contudo'] },
        7: { minPalavras: 500, maxPalavras: 1200, conectivos: ['outrossim', 'consequentemente', 'entretanto'] },
        8: { minPalavras: 600, maxPalavras: 1500, conectivos: ['indubitavelmente', 'similarmente', 'precipuamente'] },
        9: { minPalavras: 700, maxPalavras: 1800, conectivos: ['incontestavelmente', 'concomitantemente', 'destarte'] }
    };
    
    const criterio = criteriosAno[ano];
    
    // Pontos positivos
    if (validacoes.numPalavras >= criterio.minPalavras) {
        feedback.positivos.push(`✅ Bom volume de texto (${validacoes.numPalavras} palavras)`);
    }
    if (validacoes.numFrases >= 12) {
        feedback.positivos.push(`✅ Boa quantidade de frases (${validacoes.numFrases})`);
    }
    
    // Melhorias
    if (validacoes.numPalavras < criterio.minPalavras) {
        feedback.melhorias.push(`⚠️ Ampliar o texto para pelo menos ${criterio.minPalavras} palavras`);
    }
    if (erros.ortografia.length > 3) {
        feedback.melhorias.push(`⚠️ Revisar ortografia (${erros.ortografia.length} erros detectados)`);
    }
    
    // Orientações vestibulares
    feedback.orientacoes = [
        `• Use conectivos de transição: ${criterio.conectivos.join(', ')}`,
        `• Mantenha concordância entre sujeito e verbo`,
        `• Varie a estrutura das frases para evitar monotonia`,
        `• Revise pontuação: vírgulas importantes para clareza`,
        `• Desenvolva argumentos com exemplos e explicações`
    ];
    
    return feedback;
}

// ========== CALCULAR NOTA ==========
function calcularNota(validacoes, erros, feedback) {
    let nota = 100;
    
    // Descontos
    if (!validacoes.temTitulo) nota -= 10;
    if (validacoes.numParafos < 4) nota -= 15;
    nota -= Math.min(erros.ortografia.length * 2, 20);
    nota -= Math.min(erros.pontuacao.length, 10);
    
    return Math.max(nota, 0);
}

// ========== MOSTRAR RESULTADOS ==========
function mostrarResultados(validacoes, erros, feedback, nota) {
    const resultBox = document.getElementById('resultadoAnalise');
    
    // Nota
    const notaBadge = document.getElementById('notaFinal');
    const corNota = nota >= 80 ? '#10b981' : nota >= 60 ? '#f59e0b' : '#ef4444';
    notaBadge.innerHTML = `<span style="background: ${corNota}; padding: 10px 20px; border-radius: 25px; color: white; font-weight: bold;">${nota.toFixed(1)}/100</span>`;
    
    // Validações
    document.getElementById('validacoesTexto').innerHTML = `
        <p>✅ Título: ${validacoes.temTitulo ? 'SIM' : 'NÃO'}</p>
        <p>📝 Parágrafos: ${validacoes.numParafos}/5</p>
        <p>📄 Palavras: ${validacoes.numPalavras}</p>
        <p>🗣️ Frases: ${validacoes.numFrases}</p>
    `;
    
    // Análise Estrutural
    document.getElementById('analisaEstrutura').innerHTML = `
        <p>Estrutura: ${validacoes.numParafos >= 4 ? '✅ Bem estruturada' : '❌ Precisa melhorar'}</p>
        <p>Extensão: ${validacoes.numPalavras > 400 ? '✅ Boa' : '⚠️ Curta'}</p>
        <p>Fluidez: ${validacoes.numFrases > 10 ? '✅ Boa' : '⚠️ Pode melhorar'}</p>
    `;
    
    // Erros
    let errosHTML = '';
    if (erros.ortografia.length > 0) {
        errosHTML += `<p><strong>Ortografia:</strong> ${erros.ortografia.map(e => `${e.encontrado} → ${e.correcao}`).join(', ')}</p>`;
    }
    if (erros.pontuacao.length > 0) {
        errosHTML += `<p><strong>Pontuação:</strong> ${erros.pontuacao.length} erro(s) detectado(s)</p>`;
    }
    if (errosHTML === '') errosHTML = '<p>✅ Nenhum erro detectado!</p>';
    document.getElementById('errosTexto').innerHTML = errosHTML;
    
    // Orientações
    document.getElementById('orientacoesTexto').innerHTML = feedback.orientacoes.map(o => `<p>${o}</p>`).join('');
    
    // Comentários
    document.getElementById('comentariosTexto').innerHTML = `
        <p><strong>Pontos positivos:</strong></p>
        <ul>${feedback.positivos.map(p => `<li>${p}</li>`).join('')}</ul>
        <p><strong>Pontos a melhorar:</strong></p>
        <ul>${feedback.melhorias.map(m => `<li>${m}</li>`).join('')}</ul>
    `;
    
    // Resumo
    document.getElementById('resumoTexto').innerHTML = `
        <p><strong>Avaliação Geral:</strong> Redação com estrutura ${nota >= 80 ? 'excelente' : nota >= 60 ? 'boa' : 'precisa melhorar'}.</p>
        <p><strong>Próximos passos:</strong> Foque em ${feedback.melhorias[0] || 'revisar o texto'}.</p>
    `;
    
    resultBox.style.display = 'block';
    document.getElementById('btnZap').style.display = 'block';
}

// ========== AUXILIARES ==========
function mostrarAviso(msg) {
    const aviso = document.getElementById('avisoValidacao');
    aviso.textContent = msg;
    aviso.style.display = 'block';
}

function atualizarRigor() {
    // Função para futuras customizações por série
}

// ========== EXPORTAR PDF ==========
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const texto = document.getElementById('textoRedacao').value;
    
    doc.setFontSize(16);
    doc.text('Redação - Laura Mentoria Seta', 20, 20);
    
    doc.setFontSize(11);
    doc.text(`Autor: ${usuarioLogado.nome}`, 20, 35);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
    
    doc.setFontSize(12);
    doc.text(texto, 20, 60, { maxWidth: 170, align: 'justify' });
    
    doc.save(`Redacao_${usuarioLogado.nome.replace(' ', '_')}.pdf`);
    mostrarAviso('✅ PDF baixado com sucesso!');
}

// ========== EXPORTAR XLS ==========
function exportarXLS() {
    const texto = document.getElementById('textoRedacao').value;
    const validacoes = validarRedacao(texto);
    const erros = detectarErros(texto);
    
    const dados = [[
        new Date().toLocaleDateString('pt-BR'),
        texto.split('\n')[0], // Título
        validacoes.numPalavras,
        validacoes.numFrases,
        erros.ortografia.length + erros.pontuacao.length,
        'Análise realizada',
        'Resumo da avaliação',
        usuarioLogado.email
    ]];
    
    const ws = XLSX.utils.aoa_to_sheet([
        ['Data', 'Título', 'Palavras', 'Frases', 'Erros', 'Avaliação', 'Comentário', 'Email'],
        ...dados
    ]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Redações');
    XLSX.writeFile(wb, `Redacao_${usuarioLogado.nome.replace(' ', '_')}.xlsx`);
    
    // Salvar no Google Drive também (via Apps Script)
    salvarNoGoogleDrive(dados);
    mostrarAviso('✅ XLS exportado e salvo no Google Drive!');
}

// ========== COMPARTILHAR WHATSAPP ==========
function compartilharWhatsApp() {
    const msg = encodeURIComponent(`Olá! Minha redação foi avaliada pelo Laura Seta:\n\nTítulo: ${document.getElementById('textoRedacao').value.split('\n')[0]}\n\nVocê pode conferir em: https://www.setasolucoes.com.br/laura/`);
    window.open(`https://wa.me/5531984821901?text=${msg}`, '_blank');
}

// ========== SALVAR NO GOOGLE DRIVE (será feito via Apps Script) ==========
function salvarNoGoogleDrive(dados) {
    // Esta função será chamada via Apps Script
    console.log('Salvando no Google Drive...', dados);
}
