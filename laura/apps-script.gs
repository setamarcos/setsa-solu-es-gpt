// Apps Script para Laura - Salvamento em Google Drive

function doGet() {
  return HtmlService.createHtmlOutput("API Laura ativa");
}

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    
    // Criar pasta do usuário se não existir
    const pastaUsuario = criarPastaUsuario(dados.email);
    
    // Salvar arquivo XLS
    const nomeArquivo = `Redacao_${dados.titulo.replace(/\s+/g, '_')}_${new Date().getTime()}`;
    salvarXLS(pastaUsuario, nomeArquivo, dados);
    
    // Enviar email de confirmação
    MailApp.sendEmail(
      dados.email,
      "✅ Sua redação foi salva - Laura Mentoria Seta",
      `Título: ${dados.titulo}\nPalavras: ${dados.palavras}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nAcesse seu histórico em: https://www.setasolucoes.com.br/laura/`
    );
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        arquivo: nomeArquivo,
        pasta: pastaUsuario.getId()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: erro.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function criarPastaUsuario(email) {
  const pastaRaiz = DriveApp.getFoldersByName("Laura Redações").hasNext() 
    ? DriveApp.getFoldersByName("Laura Redações").next() 
    : DriveApp.createFolder("Laura Redações");
  
  const nomePasta = email.split('@')[0];
  try {
    return pastaRaiz.getFoldersByName(nomePasta).next();
  } catch (e) {
    return pastaRaiz.createFolder(nomePasta);
  }
}

function salvarXLS(pasta, nomeArquivo, dados) {
  const ss = SpreadsheetApp.create(nomeArquivo);
  const sheet = ss.getActiveSheet();
  
  // Headers
  sheet.appendRow([
    'Data',
    'Título',
    'Palavras',
    'Frases',
    'Parágrafos',
    'Erros',
    'Nota',
    'Avaliação',
    'Comentário',
    'Resumo'
  ]);
  
  // Dados
  sheet.appendRow([
    new Date().toLocaleDateString('pt-BR'),
    dados.titulo,
    dados.palavras,
    dados.frases,
    dados.parafos,
    dados.erros,
    dados.nota,
    dados.avaliacao,
    dados.comentario,
    dados.resumo
  ]);
  
  // Formatar
  sheet.autoResizeColumns(1, 10);
  
  // Mover para pasta do usuário
  const arquivo = DriveApp.getFileById(ss.getId());
  pasta.addFile(arquivo);
  DriveApp.getRootFolder().removeFile(arquivo);
  
  // Compartilhar com usuário
  arquivo.addEditor(dados.email);
}

function lerRedacoesUsuario(email) {
  try {
    const pastaRaiz = DriveApp.getFoldersByName("Laura Redações").next();
    const nomePasta = email.split('@')[0];
    const pasta = pastaRaiz.getFoldersByName(nomePasta).next();
    
    const arquivos = pasta.getFilesByType(MimeType.GOOGLE_SHEETS);
    const redacoes = [];
    
    while (arquivos.hasNext()) {
      const arquivo = arquivos.next();
      redacoes.push({
        nome: arquivo.getName(),
        id: arquivo.getId(),
        dataCriacao: arquivo.getDateCreated()
      });
    }
    
    return redacoes;
  } catch (e) {
    return [];
  }
}