// Initialisation EmailJS
(function() {
    emailjs.init("DLwrbKc57v-V-pj3-");
})();

// Gestion du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const statusElement = document.getElementById('form-status');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    // Pendant l'envoi
    submitButton.disabled = true;
    btnText.textContent = 'Envoi en cours...';
    btnIcon.className = 'fas fa-spinner fa-spin';
    statusElement.textContent = '';
    statusElement.className = '';
    
    // Envoi de l'email
    emailjs.sendForm('service_apjwixr', 'template_3xcoqpy', this)
        .then(function() {
            // Succès
            statusElement.textContent = '✅ Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.';
            statusElement.className = 'form-status-success';
            event.target.reset();
            btnText.textContent = 'Envoyer le message';
            btnIcon.className = 'fas fa-paper-plane';
            submitButton.disabled = false;
            
            // Faire disparaître le message après 5 secondes
            setTimeout(function() {
                statusElement.textContent = '';
                statusElement.className = '';
            }, 5000);
        }, function(error) {
            // Erreur
            statusElement.textContent = '❌ Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.';
            statusElement.className = 'form-status-error';
            btnText.textContent = 'Envoyer le message';
            btnIcon.className = 'fas fa-paper-plane';
            submitButton.disabled = false;
            console.log('Erreur EmailJS:', error);
        });
});