/**
 * SISTEMA NEUROCIÊNCIA - EXERCÍCIO DIÁRIO
 * Backend: Gestão de Planilhas Individuais e Controle Mestre
 */

const PASTA_USUARIOS_ID = "1mD3FiD5UfyZE2CPrcd9lKMMiW-bfPhgL"; 
const PLANILHA_MESTRE_ID = "1-E2SdTqkXuaV4LBRwFnWTVtc-yS6B-e3LZiK7lMDvhs";
const PLANILHA_MODELO_ID = "1lnpTsE38DSQT1giAtDZzC7ukGkFY3hHFxqFfkVlt4rQ";

function doGet(e) {
  const email = e.parameter.email;
  
  // LOG de Debug para o Console do Apps Script
  console.log("Tentativa de login: " + email);

  if (!email || email.trim() === "") {
    return ContentService.createTextOutput(JSON.stringify({
      status: "erro",
      mensagem: "Email não fornecido."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const resultado = processarUsuario(email.toLowerCase().trim());
  
  return ContentService.createTextOutput(JSON.stringify(resultado))
    .setMimeType(ContentService.MimeType.JSON);
}

function processarUsuario(email) {
  const ssMestre = SpreadsheetApp.openById(PLANILHA_MESTRE_ID).getSheetByName("Página1");
  const dados = ssMestre.getDataRange().getValues();
  
  // 1. Verificar se o usuário já existe na base mestre
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0].toString().toLowerCase() === email) {
      return {
        status: "sucesso",
        novo: false,
        url: dados[i][1],
        mensagem: "Login realizado com sucesso!"
      };
    }
  }

  try {
    // 2. Se for novo, criar a planilha individual baseada no MODELO (Colunas A-L)
    const pastaDestino = DriveApp.getFolderById(PASTA_USUARIOS_ID);
    const arquivoModelo = DriveApp.getFileById(PLANILHA_MODELO_ID);
    
    // Cria a cópia e renomeia
    const novaCopia = arquivoModelo.makeCopy("Neuro - " + email, pastaDestino);
    
    // Dá permissão ao usuário
    novaCopia.addEditor(email);
    
    const urlIndividual = novaCopia.getUrl();

    // 3. Registrar na Planilha Mestre
    ssMestre.appendRow([email, urlIndividual, new Date()]);

    return {
      status: "sucesso",
      novo: true,
      url: urlIndividual,
      mensagem: "Perfil criado! Sua jornada em Neurociência começa agora."
    };

  } catch (erro) {
    console.error("Erro no processamento: " + erro.message);
    return {
      status: "erro",
      mensagem: "Erro ao criar perfil: " + erro.message
    };
  }
}
