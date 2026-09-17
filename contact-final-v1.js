(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const note = form.querySelector('.contact-form-note');
  if (!submitBtn) return;

  if (note) {
    note.textContent = 'A mensagem será enviada diretamente para a banda por este formulário.';
  }

  const WEB3FORMS_ACCESS_KEY = 'b162f3c3-d2f9-41c3-843e-1bd793be5822';

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'ENVIANDO...';
    submitBtn.disabled = true;
    if (status) status.textContent = 'Enviando sua mensagem para a banda…';

    try {
      const formData = new FormData(form);
      formData.set('access_key', WEB3FORMS_ACCESS_KEY);

      const name = String(formData.get('name') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      if (!subject) {
        formData.set(
          'subject',
          `Contato pelo site — ${name || 'Bobby Dias & The Anti-State Guys'}`
        );
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Falha no envio da mensagem.');
      }

      if (status) status.textContent = 'Mensagem enviada com sucesso para a banda.';
      form.reset();
    } catch (error) {
      console.error('Falha ao enviar formulário de contato:', error);
      if (status) {
        status.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
})();
