document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Iconos Lucide (SVG)
    lucide.createIcons();

    // 2. Cursor Personalizado (Solo para pantallas grandes - Premium feel)
    const cursor = document.getElementById('custom-cursor');
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    
    if (isDesktop) {
        cursor.style.display = 'block';
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Efecto hover sobre botones y enlaces
        const interactables = document.querySelectorAll('a, button, input, select, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.5)');
            el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }

    // 3. Navbar Scroll (Glassmorphism on scroll) y Barra de Progreso
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Navbar shadow/bg
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progreso de scroll
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollPx / winHeightPx) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // 4. Menú Móvil
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        const isVisible = mobileMenu.style.display === 'block';
        mobileMenu.style.display = isVisible ? 'none' : 'block';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
        });
    });

    // 5. Animaciones Fade-Up con Intersection Observer (High Performance)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Solo anima una vez para no distraer
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Se revela cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px" 
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Envío real del formulario a Formspree
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.textContent = 'Enviando...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: { Accept: 'application/json' },
                    body: new FormData(form)
                });

                if (response.ok) {
                    form.reset();
                    form.classList.add('hidden');
                    if (formSuccess) {
                        formSuccess.classList.remove('hidden');
                    }
                    lucide.createIcons();
                } else {
                    throw new Error('No se pudo enviar el formulario');
                }
            } catch (error) {
                submitBtn.textContent = 'Intentar de nuevo';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                alert('No se pudo enviar el formulario. Intenta nuevamente o escríbenos por WhatsApp.');
            }
        });
    }
});
