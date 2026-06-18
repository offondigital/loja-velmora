/* ============================================
   VELMO BLACK - JS SITE SEO/BLOG
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== MENU HAMBURGER =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });
    });

    // Dropdown mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // ===== FAQ TOGGLE =====
    window.toggleFAQ = function(button) {
        button.classList.toggle('active');
        const resposta = button.nextElementSibling;
        resposta.classList.toggle('open');
    };

    // ===== POP-UP =====
    const popupOverlay = document.getElementById('popup-overlay');

    function abrirPopup() {
        if (popupOverlay) {
            popupOverlay.classList.add('active');
        }
    }

    window.fecharPopup = function() {
        if (popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    };

    setTimeout(abrirPopup, 4000);

    popupOverlay?.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            fecharPopup();
        }
    });

    // ===== MÁSCARA DE TELEFONE =====
    function aplicarMascaraTelefone(input) {
        input.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);
            
            if (valor.length <= 2) {
                e.target.value = valor ? `(${valor}` : '';
            } else if (valor.length <= 7) {
                e.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
            } else {
                e.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
            }
        });
    }

    document.querySelectorAll('.phone-mask').forEach(input => {
        aplicarMascaraTelefone(input);
    });

    // ===== API DE LEADS =====
    function enviarLeadAPI(dados) {
        const apiEndpoint = 'https://api.exemplo.com/leads';

        return fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Lead enviado:', data);
            return data;
        })
        .catch(error => {
            console.error('Erro API:', error);
            const leads = JSON.parse(localStorage.getItem('velmo_seo_leads') || '[]');
            leads.push({ ...dados, timestamp: new Date().toISOString() });
            localStorage.setItem('velmo_seo_leads', JSON.stringify(leads));
            return { status: 'armazenado_localmente' };
        });
    }

    // ===== FORM POPUP =====
    document.getElementById('popup-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('popup-nome').value.trim();
        const telefone = document.getElementById('popup-telefone').value.trim();
        const email = document.getElementById('popup-email').value.trim();

        if (!nome || !telefone) {
            alert('Por favor, preencha nome e telefone.');
            return;
        }

        enviarLeadAPI({
            nome, telefone,
            email: email || '',
            origem: 'popup_guia_gratuito',
            fonte: window.location.href
        }).then(() => {
            alert('Guia enviado com sucesso! Verifique seu e-mail.');
            this.reset();
            fecharPopup();
        });
    });

    // ===== FORM NEWSLETTER =====
    document.getElementById('newsletter-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('news-nome').value.trim();
        const telefone = document.getElementById('news-telefone').value.trim();
        const email = document.getElementById('news-email').value.trim();

        if (!nome || !telefone) {
            alert('Por favor, preencha nome e telefone.');
            return;
        }

        enviarLeadAPI({
            nome, telefone,
            email: email || '',
            origem: 'newsletter',
            fonte: window.location.href
        }).then(() => {
            alert('Inscrição realizada com sucesso!');
            this.reset();
        });
    });

    // ===== FORM CONTATO =====
    document.getElementById('form-contato')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('contato-nome').value.trim();
        const telefone = document.getElementById('contato-telefone').value.trim();
        const email = document.getElementById('contato-email').value.trim();
        const mensagem = document.getElementById('contato-mensagem').value.trim();

        if (!nome || !telefone) {
            alert('Por favor, preencha nome e telefone.');
            return;
        }

        enviarLeadAPI({
            nome, telefone,
            email: email || '',
            mensagem: mensagem || '',
            origem: 'formulario_contato',
            fonte: window.location.href
        }).then(() => {
            alert('Mensagem enviada! Retornaremos em breve.');
            this.reset();
        });
    });

    // ===== LAZY LOAD =====
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===== TRACKING =====
    function trackEvent(categoria, acao, rotulo) {
        if (typeof gtag === 'function') {
            gtag('event', acao, { event_category: categoria, event_label: rotulo });
        }
        if (typeof fbq === 'function') {
            fbq('track', acao, { content_category: categoria, content_name: rotulo });
        }
    }

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            trackEvent('Lead', 'formulario_enviado', this.id || 'formulario');
        });
    });

    // ===== SEARCH =====
    document.getElementById('search-input')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const termo = this.value.trim().toLowerCase();
            if (termo) {
                const artigos = {
                    'creatina em gummy': 'blog/creatina-em-gummy.html',
                    'creatina gummy': 'blog/creatina-em-gummy.html',
                    'creatina em goma': 'blog/creatina-em-gummy.html',
                    'gummy creatina': 'blog/creatina-em-gummy.html',
                    'creatina serve para que': 'blog/creatina-serve-para-que.html',
                    'para que serve creatina': 'blog/creatina-serve-para-que.html',
                    'o que a creatina faz no corpo': 'blog/o-que-a-creatina-faz-no-corpo.html',
                    'qual a função da creatina': 'blog/o-que-a-creatina-faz-no-corpo.html',
                    'velmo drink': 'blog/velmo-drink.html',
                    'velmo black drink': 'blog/velmo-drink.html',
                    'velmo drink morango': 'blog/velmo-drink.html',
                    'clareador de virilha': 'blog/clareador-de-virilha.html',
                    'clareador vilha': 'blog/clareador-de-virilha.html'
                };
                
                let encontrado = false;
                for (const [chave, url] of Object.entries(artigos)) {
                    if (termo.includes(chave)) {
                        window.location.href = url;
                        encontrado = true;
                        break;
                    }
                }
                if (!encontrado) {
                    alert('Termo não encontrado. Tente: creatina em gummy, para que serve creatina, velmo drink, clareador de virilha');
                }
            }
        }
    });

});
