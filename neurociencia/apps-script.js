/**
 * PASSO 2: Google Apps Script - Receber dados e calcular automaticamente
 * 
 * Instruções:
 * 1. Abra a planilha: https://docs.google.com/spreadsheets/d/1lnpTsE38DSQT1giAtDZzC7ukGkFY3hHFxqFfkVlt4rQ/
 * 2. Vá em Extensões > Apps Script
 * 3. Cole este código
 * 4. Salve e Execute
 */

// IDs das colunas
const COLS = {
  TIMESTAMP: 0,  // A
  EMAIL: 1,      // B
  NUMERO: 2,     // C
  PERGUNTA: 3,   // D
  RESPOSTA: 4,   // E
  ERRO: 5,       // F
  ACERTO: 6,     // G
  SUGESTAO: 7,   // H
  PROGRESSO: 8,  // I
  NOTA: 9,       // J
  PONTO_MELHORA: 10,  // K
  ANALISE_IA: 11      // L
};

/**
 * Receber dados do frontend e salvar na planilha
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    console.log("📨 Dados recebidos:", data);
    
    // Calcular nota automática
    const nota = calcularNota(data);
    
    // Extrair ponto principal de melhora
    const pontoMelhora = extrairPontoMelhora(data.sugestao);
    
    // Gerar link para análise IA
    const linkIA = gerarLinkIA(data);
    
    // Preparar linha para inserir
    const novaLinha = [
      data.timestamp || new Date().toLocaleString('pt-BR'),
      data.email || '',
      data.numero || '',
      data.pergunta || '',
      data.resposta || '',
      data.erro || '',
      data.acerto || '',
      data.sugestao || '',
      data.progresso || 0,
      nota,           // Coluna J
      pontoMelhora,   // Coluna K
      linkIA          // Coluna L
    ];
    
    // Adicionar linha na planilha
    sheet.appendRow(novaLinha);
    
    console.log("✅ Linha adicionada com sucesso!");
    
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'sucesso',
        nota: nota,
        pontoMelhora: pontoMelhora,
        message: 'Dados salvos com sucesso!'
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error("❌ Erro ao processar:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'erro',
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Calcular nota automática (0-10)
 * Fórmula:
 * - Base: (Progresso / 9) * 5 pontos
 * - Se Erro vazio: +2 pontos
 * - Se Acerto preenchido: +2 pontos
 * - Se Sugestão preenchida: +1 ponto
 */
function calcularNota(data) {
  let nota = 0;
  
  // Progresso (0-5 pontos)
  const progresso = parseInt(data.progresso) || 0;
  nota += (progresso / 9) * 5;
  
  // Erro (0-2 pontos)
  if (!data.erro || data.erro.trim() === '') {
    nota += 0; // Sem erro é negativo, não bonifica
  } else {
    nota += 2; // Reconheceu o erro = crescimento
  }
  
  // Acerto (0-2 pontos)
  if (data.acerto && data.acerto.trim() !== '') {
    nota += 2;
  }
  
  // Sugestão (0-1 ponto)
  if (data.sugestao && data.sugestao.trim() !== '') {
    nota += 1;
  }
  
  // Limitar entre 0-10
  return Math.min(Math.round(nota * 10) / 10, 10);
}

/**
 * Extrair ponto principal de melhora
 * Pega a primeira frase da sugestão
 */
function extrairPontoMelhora(sugestao) {
  if (!sugestao || sugestao.trim() === '') {
    return "Não informado";
  }
  
  // Pegar até primeira vírgula ou ponto
  const firstSentence = sugestao
    .split(/[,.]/) // Dividir por vírgula ou ponto
    [0]            // Pegar primeira parte
    .trim();
  
  return firstSentence.substring(0, 100); // Limitar a 100 caracteres
}

/**
 * Gerar link para análise por IA
 * Codifica os dados em URL para processamento posterior
 */
function gerarLinkIA(data) {
  // URL base para análise IA (configurar com seu endpoint)
  const baseURL = "https://api.seu-dominio.com/analise-ia";
  
  const params = {
    email: encodeURIComponent(data.email),
    numero: data.numero,
    erro: encodeURIComponent(data.erro),
    acerto: encodeURIComponent(data.acerto),
    sugestao: encodeURIComponent(data.sugestao),
    progresso: data.progresso
  };
  
  const queryString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // Por enquanto, retornar um link genérico
  return `=HIPERLINK("https://claude.ai/","🤖 Analisar com IA")`;
}

/**
 * Função para testar (Execute isso para testar)
 */
function testar() {
  const dadosTeste = {
    email: "teste@email.com",
    numero: 1,
    pergunta: "Como começar tarefas difíceis?",
    resposta: "Celebrando pequenas vitórias",
    erro: "Procrastinei demais",
    acerto: "Comecei pequeno",
    sugestao: "Fazer pausas mais frequentes e usar timer",
    progresso: 7,
    timestamp: new Date().toLocaleString('pt-BR')
  };
  
  const resultado = calcularNota(dadosTeste);
  console.log("✅ Teste - Nota calculada:", resultado);
}
