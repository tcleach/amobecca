document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('survey-form');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0Ow6nJ8Ye5APXgKCq3DZDTsnbqng26FJ8XpEDvo4JcHRsFw356ghR38TqxT3Lz7r3/exec';
    const REGISTRY_URL = 'https://www.amazon.com/wedding/share/caleblovesbecca';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            // Redirect to registry upon successful RSVP
            window.location.href = REGISTRY_URL;
        })
        .catch(err => {
            console.error('Submission failed', err);
            alert('There was a network error submitting your RSVP. Please try again.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
});
