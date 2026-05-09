function addReminder() {
  let start = new Date();
  let end = new Date(start.getTime() + 30*60000); // 30 min
  let event = {
    'summary': 'Exercício Neurociência',
    'start': { 'dateTime': start.toISOString(), 'timeZone': 'America/Sao_Paulo' },
    'end': { 'dateTime': end.toISOString(), 'timeZone': 'America/Sao_Paulo' }
  };
  alert("Lembrete pronto para ser adicionado na sua conta Google Agenda.");
  // Aqui você conecta via API Google Calendar (OAuth2)
}
