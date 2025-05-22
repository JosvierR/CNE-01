document.addEventListener('DOMContentLoaded', () => {
    /* --- Menú móvil --- */
    const menuButton = document.querySelector('.hamburger-btn');
    const nav = document.querySelector('.slim-nav');
    if (menuButton && nav) {
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    /* --- Scroll suave para enlaces internos --- */
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* --- Efecto fade-in al hacer scroll --- */
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    fadeElements.forEach(item => fadeObserver.observe(item));

    /* --- Lógica CORREGIDA para sliders --- */
    document.querySelectorAll('.slider-row').forEach(row => {
        const container = row.querySelector('.slider-row-images');
        const btnPrev = row.querySelector('.arrow-left');
        const btnNext = row.querySelector('.arrow-right');
        if (!container || !btnPrev || !btnNext) return;

        const getScrollAmount = () => {
            const firstItem = container.querySelector('.slide-item');
            return firstItem ? firstItem.offsetWidth * 3 : container.offsetWidth;
        };

        btnPrev.addEventListener('click', () => {
            container.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        btnNext.addEventListener('click', () => {
            container.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });
    });

    /* --- Modal para proyectos --- */
    const modal = document.getElementById('project-modal');
    if (modal) {
        const titleEl = document.getElementById('modal-title');
        const descEl = document.getElementById('modal-description');
        const vid = document.getElementById('modal-video');
        const src = document.getElementById('modal-video-source');
        const locEl = document.getElementById('modal-location');
        const close = modal.querySelector('.close');

        function openModal(item) {
            document.body.classList.add('modal-active');
            titleEl.textContent = item.dataset.title || 'Sin título';
            descEl.textContent = item.dataset.description || 'Sin descripción';
            locEl.textContent = item.dataset.location || 'Sin ubicación';

            if (item.dataset.video) {
                src.src = item.dataset.video;
                vid.load();
                vid.style.display = 'block';
            } else {
                vid.style.display = 'none';
            }
            modal.classList.add('active');
        }

        function closeModal() {
            document.body.classList.remove('modal-active');
            modal.classList.remove('active');
        }

        close.addEventListener('click', closeModal);
        window.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        document.querySelectorAll('.slider-row-images').forEach(container => {
            container.addEventListener('click', e => {
                let el = e.target.closest('.slide-item');
                if (el) openModal(el);
            });
        });
    }

    /* --- Contadores suaves --- */
    const counters = document.querySelectorAll('.counter');
    const countSection = document.querySelector('.hero-counter, .counters-section');
    if (countSection) {
        let started = false;
        new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    counters.forEach(c => {
                        const end = +c.dataset.target || 0;
                        let start = null;
                        function frame(ts) {
                            if (!start) start = ts;
                            const progress = ts - start;
                            const val = Math.min(end, Math.floor((progress / 2000) * end));
                            c.textContent = val;
                            if (val < end) requestAnimationFrame(frame);
                        }
                        requestAnimationFrame(frame);
                    });
                    obs.unobserve(countSection);
                }
            });
        }, { threshold: 0.3 }).observe(countSection);
    }

    /* --- Hero slider --- */
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dots .dot');
        let idx = 0, total = slides.length;

        function show(i) {
            slides.forEach((s, j) => s.classList.toggle('active', j === i));
            dots.forEach((d, j) => d.classList.toggle('active', j === i));
        }

        let iv = setInterval(() => {
            idx = (idx + 1) % total;
            show(idx);
        }, 5000);

        dots.forEach((d, i) => d.addEventListener('click', () => {
            clearInterval(iv);
            idx = i;
            show(i);
            iv = setInterval(() => {
                idx = (idx + 1) % total;
                show(idx);
            }, 5000);
        }));

        const leftA = document.querySelector('.hero-arrow-left');
        const rightA = document.querySelector('.hero-arrow-right');
        if (leftA && rightA) {
            leftA.addEventListener('click', () => {
                clearInterval(iv);
                idx = (idx - 1 + total) % total;
                show(idx);
                iv = setInterval(() => {
                    idx = (idx + 1) % total;
                    show(idx);
                }, 5000);
            });
            rightA.addEventListener('click', () => {
                clearInterval(iv);
                idx = (idx + 1) % total;
                show(idx);
                iv = setInterval(() => {
                    idx = (idx + 1) % total;
                    show(idx);
                }, 5000);
            });
        }
    }

    /* --- Formulario de contacto --- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const params = {
                service_id: 'service_r1yyn21',
                template_id: 'template_qkhrmnq',
                user_id: 'AwfMFTpcQlKMoFh6J',
                template_params: {
                    user_name: this.user_name.value,
                    user_email: this.user_email.value,
                    message: this.message.value
                }
            };

            fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            })
            .then(res => {
                if (res.ok) {
                    alert('Mensaje enviado correctamente.');
                    contactForm.reset();
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            })
            .catch(err => {
                console.error('Error al enviar:', err);
                alert('Error al enviar, inténtalo nuevamente.');
            });
        });
    }

    /* --- Flip cards en sección de proyectos --- */
    document.querySelectorAll('.card-container').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    console.log('✅ app.js cargado correctamente');
});
