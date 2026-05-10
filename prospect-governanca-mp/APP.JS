const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxreIMR3__OyjMRA4qjzMJTHr6PMTMTDzvo7fdWo1EJJGntaYGBNv_DfMGBmQIl-eeA/exec";

async function salvarCliente(){

const dados = {

cliente: document.getElementById("cliente").value,
telefone: document.getElementById("telefone").value,
tipo: document.getElementById("tipo").value,
observacao: document.getElementById("observacao").value,
retorno: document.getElementById("retorno").value

};

document.getElementById("status").innerHTML = "Salvando...";

try{

const resposta = await fetch(URL_SCRIPT,{

method:"POST",

body:JSON.stringify(dados)

});

document.getElementById("status").innerHTML =
"Cliente salvo com sucesso";

document.getElementById("cliente").value = "";
document.getElementById("telefone").value = "";
document.getElementById("observacao").value = "";
document.getElementById("retorno").value = "";

}catch(erro){

document.getElementById("status").innerHTML =
"Erro ao salvar";

}

}