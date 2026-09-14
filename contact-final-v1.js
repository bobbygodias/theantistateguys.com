(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    const subject = `Contato pelo site — ${name || 'Bobby Dias & The Anti-State Guys'}`;
    const body = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      '',
      'Mensagem:',
      message
    ].join('\n');

    const mailto = `mailto:theantistateguys@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (status) status.textContent = 'Abrindo seu aplicativo de e-mail…';
    window.location.href = mailto;
  });
})();
