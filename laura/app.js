// ========== CONFIGURAÇÃO GOOGLE ==========
const GOOGLE_CLIENT_ID = "1097002227710-uqa72og3t9t6lena1gdpakrm7f0vob78.apps.googleusercontent.com"; 
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtzGrjioyzpO4oaQGsNiI-ibJPOAk29ZF-j8N6PJtlYteWEIg0gGwCfHx_t2l-5dgoAg/exec";

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
    const decodedToken = jwt_decode(response.credential);
    usuarioLogado = {
        nome: decodedToken.name,
        email: decodedToken.email,
        foto: decodedToken.picture,
        token: response.credential
    };
    tokenGoogle = response.credential;
    localStorage.setItem('usuarioLaura', JSON.stringify(usuarioLogado));
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

// ========== SALVAR NO GOOGLE DRIVE ==========
function salvarNoGoogleDrive(dados) {
    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(dados),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(retorno => {
        mostrarAviso("✅ " + retorno.mensagem);
    })
    .catch(err => {
        mostrarAviso("❌ Erro ao salvar: " + err);
    });
}
