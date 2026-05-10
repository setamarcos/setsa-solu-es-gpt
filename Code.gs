function doGet(e){

return ContentService
.createTextOutput("API ONLINE")
.setMimeType(ContentService.MimeType.TEXT);

}

function doPost(e){

try{

const dados =
JSON.parse(e.postData.contents);

const planilha =
SpreadsheetApp.openById(
"1yaDx044uZQqEPrL1dwYlBIdf_5vJtSpmhlpqoCU76r0"
);

const aba =
planilha.getSheetByName("CLIENTES");

const data =
Utilities.formatDate(
new Date(),
"GMT-3",
"dd/MM/yyyy"
);

const hora =
Utilities.formatDate(
new Date(),
"GMT-3",
"HH:mm:ss"
);

aba.appendRow([

data,
hora,
dados.cliente,
dados.telefone,
dados.tipo,
dados.observacao,
dados.retorno

]);

return ContentService
.createTextOutput(
JSON.stringify({
status:"OK"
})
)
.setMimeType(ContentService.MimeType.JSON);

}catch(erro){

return ContentService
.createTextOutput(
JSON.stringify({
status:"ERRO",
mensagem:erro.toString()
})
)
.setMimeType(ContentService.MimeType.JSON);

}

}
