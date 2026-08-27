document.documentElement.classList.add('js');

function copyEmail(button) {
    const email = button.dataset.email;
    const status = button.nextElementSibling;

    const showStatus = (message) => {
        status.textContent = message;
        window.setTimeout(() => {
            status.textContent = '';
        }, 2500);
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(email)
            .then(() => showStatus('copied'))
            .catch(() => showStatus('copy failed'));
        return;
    }

    const input = document.createElement('textarea');
    input.value = email;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();

    try {
        document.execCommand('copy');
        showStatus('copied');
    } catch (error) {
        showStatus('copy failed');
    }

    document.body.removeChild(input);
}

document.querySelector('.copy-email')?.addEventListener('click', (event) => {
    copyEmail(event.currentTarget);
});

function revealSections() {
    const sections = document.querySelectorAll('#work, #about, #contact');

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sections.forEach((section) => section.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, sectionObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            sectionObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    sections.forEach((section) => {
        section.classList.add('reveal-section');
        observer.observe(section);
    });
}

revealSections();
