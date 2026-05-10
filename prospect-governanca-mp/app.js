const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxreIMR3__OyjMRA4qjzMJTHr6PMTMTDzvo7fdWo1EJJGntaYGBNv_DfMGBmQIl-eeA/exec";

async function salvarCliente() {
    const cliente = document.getElementById("cliente").value;
    const telefone = document.getElementById("telefone").value;
    const tipo = document.getElementById("tipo").value;
    const observacao = document.getElementById("observacao").value;
    const retorno = document.getElementById("retorno").value;

    if (cliente === "") {
        alert("Digite o nome do cliente");
        return;
    }

    document.getElementById("status").innerHTML = "Salvando cliente...";

    const dados = { cliente, telefone, tipo, observacao, retorno };

    try {
        await fetch(URL_SCRIPT, { method: "POST", body: JSON.stringify(dados) });
        document.getElementById("status").innerHTML = "Cliente salvo com sucesso";
        // Limpar campos
        document.querySelectorAll("input, textarea").forEach(i => i.value = "");
    } catch (erro) {
        document.getElementById("status").innerHTML = "Erro de conexão Google";
        console.log(erro);
    }
}

function abrirWhatsapp() {
    const fone = "5531984821901";
    const texto = encodeURI("Olá, gostaria de falar sobre a prospecção.");
    window.open(`https://wa.me/${fone}?text=${texto}`, '_blank');
}