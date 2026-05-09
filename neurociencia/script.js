// Carregar exercícios
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    let today = new Date().getDate() % data.length;
    let ex = data[today];
    document.getElementById('exercise').innerHTML =
      `<h2>Exercício ${ex.numero}</h2>
       <p><strong>Pergunta:</strong> ${ex.pergunta}</p>
       <p><strong>Resposta:</strong> ${ex.resposta}</p>
       <p><strong>Erro:</strong> ${ex.erro}</p>
       <p><strong>Acerto:</strong> ${ex.acerto}</p>
       <p><strong>Sugestão:</strong> ${ex.sugestao}</p>`;
    renderChart(ex.progresso);
  });

function renderChart(progresso) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Progresso'],
      datasets: [{
        label: 'Nível (1-9)',
        data: [progresso],
        backgroundColor: '#f39c12'
      }]
    }
  });
}
