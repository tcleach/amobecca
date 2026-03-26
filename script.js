document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONDITIONAL LOGIC --- //
    const q1Radios = document.querySelectorAll('input[name="attending_for"]');
    const q2Container = document.getElementById('q2-container');
    const q2Inputs = q2Container.querySelectorAll('input[type="radio"]');

    q1Radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (['bride', 'groom', 'both'].includes(e.target.value)) {
                q2Container.classList.add('visible');
                q2Inputs.forEach(i => i.required = true);
            } else {
                q2Container.classList.remove('visible');
                q2Inputs.forEach(i => i.required = false);
            }
        });
    });

    const q4Radios = document.querySelectorAll('input[name="showing_up"]');
    const q5Container = document.getElementById('q5-container');
    const q5Input = q5Container.querySelector('input[type="number"]');
    const q6Container = document.getElementById('q6-container');
    const q6Input = q6Container.querySelector('input[type="number"]');

    q4Radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                q5Container.classList.add('visible');
                q5Input.required = true;
                q6Container.classList.add('visible');
                q6Input.required = true;
            } else {
                q5Container.classList.remove('visible');
                q5Input.required = false;
                q6Container.classList.remove('visible');
                q6Input.required = false;
            }
        });
    });


    // --- DRAG AND DROP (RANKING) LOGIC --- //
    
    // Helper to randomize lists at start
    const randomizeList = (listId) => {
        const ul = document.getElementById(listId);
        for (let i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    };

    // Helper to update the hidden exact order inputs
    const updateRankingInput = (listId, inputId) => {
        const list = document.getElementById(listId);
        const input = document.getElementById(inputId);
        const items = list.querySelectorAll('.ranking-item');
        const order = Array.from(items).map(item => item.getAttribute('data-id'));
        input.value = JSON.stringify(order);
    };

    const initSortable = (listId, inputId) => {
        randomizeList(listId);
        updateRankingInput(listId, inputId);
        new Sortable(document.getElementById(listId), {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: (evt) => {
                updateRankingInput(listId, inputId);
                evt.item.classList.add('interacted');
            },
        });
    };

    initSortable('reception-ranking-list', 'reception-ranking-input');
    initSortable('couple-ranking-list', 'couple-ranking-input');

    
    // --- FORM SUBMISSION --- //
    const form = document.getElementById('survey-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        // Google Web App URL (Updated with new deployment)
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxB4Tm9Gb4B2IHmWxVcbfUh7DJdXFGFf_MQ55TlPu7g2E_zTjrLwFRP5-24cSj9u5t/exec'; 
        
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
            modal.classList.remove('hidden');
        })
        .catch(err => {
            console.error('Submission failed', err);
            alert('There was a network error submitting the RSVP.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    closeModalBtn.addEventListener('click', () => {
        // Attempt to close the tab
        window.close();
        
        // Fallback in case the browser blocks window.close()
        modal.classList.add('hidden');
        form.reset();
        
        // Re-randomize and close conditionals smoothly
        q2Container.classList.remove('visible');
        q5Container.classList.remove('visible');
        q6Container.classList.remove('visible');
        initSortable('reception-ranking-list', 'reception-ranking-input');
        initSortable('couple-ranking-list', 'couple-ranking-input');
    });
});
