const URL_SCRIPT =
"https://script.google.com/macros/s/AKfycbxreIMR3__OyjMRA4qjzMJTHr6PMTMTDzvo7fdWo1EJJGntaYGBNv_DfMGBmQIl-eeA/exec";

async function salvarCliente(){

const cliente =
document.getElementById("cliente").value;

const telefone =
document.getElementById("telefone").value;

const tipo =
document.getElementById("tipo").value;

const observacao =
document.getElementById("observacao").value;

const retorno =
document.getElementById("retorno").value;

if(cliente === ""){

alert("Digite nome cliente");
return;

}

document.getElementById("status").innerHTML =
"Salvando cliente...";

const dados = {

cliente,
telefone,
tipo,
observacao,
retorno

};

try{

await fetch(URL_SCRIPT,{

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
"Erro conexão Google";

console.log(erro);

}

}
