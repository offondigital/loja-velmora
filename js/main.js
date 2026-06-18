/* ============================================
   VELMO BLACK - JAVASCRIPT PRINCIPAL
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== MENU HAMBURGER =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== POP-UP PROMOCIONAL =====
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

    // Abrir popup após 3 segundos
    setTimeout(abrirPopup, 3000);

    // Fechar popup ao clicar fora
    popupOverlay.addEventListener('click', function(e) {
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

    // ===== MÁSCARA DE E-MAIL (validação simples) =====
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validarEmail(this.value)) {
                this.style.borderColor = '#F44336';
                if (!this.nextElementSibling?.classList.contains('erro-msg')) {
                    const msg = document.createElement('span');
                    msg.classList.add('erro-msg');
                    msg.style.cssText = 'color: #F44336; font-size: 12px; display: block; margin-top: 4px;';
                    msg.textContent = 'E-mail inválido';
                    this.parentNode.appendChild(msg);
                }
            } else if (this.value && validarEmail(this.value)) {
                this.style.borderColor = '#E0E0E0';
                const erroMsg = this.parentNode.querySelector('.erro-msg');
                if (erroMsg) erroMsg.remove();
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#999999';
            const erroMsg = this.parentNode.querySelector('.erro-msg');
            if (erroMsg) erroMsg.remove();
        });
    });

    // ===== TOGGLE PREÇO PRODUTOS =====
    window.togglePreco = function(button) {
        const precoInfo = button.nextElementSibling;
        const preco = button.getAttribute('data-preco');
        const parcelas = button.getAttribute('data-parcelas');

        if (precoInfo.style.display === 'none' || precoInfo.style.display === '') {
            precoInfo.style.display = 'block';
            precoInfo.querySelector('.preco-valor').textContent = preco;
            precoInfo.querySelector('.preco-parcelas').textContent = `ou ${parcelas} no cartão`;
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Valor';
        } else {
            precoInfo.style.display = 'none';
            button.innerHTML = '<i class="fas fa-eye"></i> Ver Valor';
        }
    };

    // ===== TOGGLE PREÇO COMBOS =====
    window.togglePrecoCombo = function(button) {
        const precoInfo = button.nextElementSibling;
        const preco = button.getAttribute('data-preco');
        const parcelas = button.getAttribute('data-parcelas');

        if (precoInfo.style.display === 'none' || precoInfo.style.display === '') {
            precoInfo.style.display = 'block';
            precoInfo.querySelector('.combo-preco-valor').textContent = preco;
            precoInfo.querySelector('.combo-preco-parcelas').textContent = `ou ${parcelas} no cartão`;
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Valor';
        } else {
            precoInfo.style.display = 'none';
            button.innerHTML = '<i class="fas fa-eye"></i> Ver Valor';
        }
    };

    // ===== REDIRECIONAR BOTÕES COMPRAR =====
    document.querySelectorAll('.btn-buy[data-link]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const link = this.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            }
        });
    });

    // ===== API CAPTURA DE LEADS =====
    function enviarLeadAPI(dados) {
        const apiEndpoint = 'https://api.exemplo.com/leads'; // Substituir pelo endpoint real

        return fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Lead enviado com sucesso:', data);
            return data;
        })
        .catch(error => {
            console.error('Erro ao enviar lead:', error);
            // Fallback: armazenar localmente
            const leads = JSON.parse(localStorage.getItem('velmo_leads') || '[]');
            leads.push({ ...dados, timestamp: new Date().toISOString() });
            localStorage.setItem('velmo_leads', JSON.stringify(leads));
            return { status: 'armazenado_localmente' };
        });
    }

    // ===== FORMULÁRIO POP-UP =====
    const popupForm = document.getElementById('popup-form');
    if (popupForm) {
        popupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('popup-nome').value.trim();
            const telefone = document.getElementById('popup-telefone').value.trim();
            const email = document.getElementById('popup-email').value.trim();

            if (!nome || !telefone) {
                alert('Por favor, preencha nome e telefone.');
                return;
            }

            const leadData = {
                nome: nome,
                telefone: telefone,
                email: email || '',
                origem: 'popup_promocao',
                fonte: window.location.href
            };

            enviarLeadAPI(leadData).then(() => {
                alert('Cadastro realizado com sucesso! Você receberá seu cupom de desconto.');
                popupForm.reset();
                fecharPopup();
            });
        });
    }

    // ===== FORMULÁRIO CONTATO =====
    const contatoForm = document.getElementById('form-contato');
    if (contatoForm) {
        contatoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('contato-nome').value.trim();
            const telefone = document.getElementById('contato-telefone').value.trim();
            const email = document.getElementById('contato-email').value.trim();
            const mensagem = document.getElementById('contato-mensagem').value.trim();

            if (!nome || !telefone) {
                alert('Por favor, preencha nome e telefone.');
                return;
            }

            const leadData = {
                nome: nome,
                telefone: telefone,
                email: email || '',
                mensagem: mensagem || '',
                origem: 'formulario_contato',
                fonte: window.location.href
            };

            enviarLeadAPI(leadData).then(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                contatoForm.reset();
            });
        });
    }

    // ===== CARREGAR COMBOS DINÂMICOS =====
    const combosData = [
        {
            titulo: 'Combo 1+1 Morango + Tangerina',
            itens: ['1 Velmo Black Morango', '1 Velmo Black Tangerina'],
            preco: 'R$ 245,80',
            parcelas: '12x de R$ 20,48',
            link: 'https://pay.hest.com.br/73452160-081a-439c-a487-3dcdd46ada7c',
            destaque: false
        },
        {
            titulo: 'Combo 1+1 Morango + Caps',
            itens: ['1 Velmo Black Morango', '1 Velmo Black Caps'],
            preco: 'R$ 245,80',
            parcelas: '12x de R$ 20,48',
            link: 'https://pay.hest.com.br/a473b9e2-e409-4caf-a33c-4986745a7669',
            destaque: false
        },
        {
            titulo: 'Combo 1+1 Tangerina + Caps',
            itens: ['1 Velmo Black Tangerina', '1 Velmo Black Caps'],
            preco: 'R$ 245,80',
            parcelas: '12x de R$ 20,48',
            link: 'https://pay.hest.com.br/95a743be-26bb-4fc0-974c-7727a9e7d9e8',
            destaque: false
        },
        {
            titulo: 'Combo 2+2 Morango + Tangerina',
            itens: ['2 Velmo Black Morango', '2 Velmo Black Tangerina'],
            preco: 'R$ 335,70',
            parcelas: '12x de R$ 27,98',
            link: 'https://pay.hest.com.br/dbca2f79-41f0-41a8-92ef-ab96ebed2786',
            destaque: false
        },
        {
            titulo: 'Combo 2+2 Morango + Caps',
            itens: ['2 Velmo Black Morango', '2 Velmo Black Caps'],
            preco: 'R$ 335,70',
            parcelas: '12x de R$ 27,98',
            link: 'https://pay.hest.com.br/bf7887b3-444f-4e98-92b1-efceb5774088',
            destaque: false
        },
        {
            titulo: 'Combo 2+2 Tangerina + Caps',
            itens: ['2 Velmo Black Tangerina', '2 Velmo Black Caps'],
            preco: 'R$ 335,70',
            parcelas: '12x de R$ 27,98',
            link: 'https://pay.hest.com.br/8de2e695-4a60-4eca-a11a-d0a09ec15021',
            destaque: false
        },
        {
            titulo: 'Combo 3+3 Morango + Tangerina',
            itens: ['3 Velmo Black Morango', '3 Velmo Black Tangerina'],
            preco: 'R$ 461,50',
            parcelas: '12x de R$ 38,46',
            link: 'https://pay.hest.com.br/83729bc5-9475-46b7-9779-358943273b5b',
            destaque: true
        },
        {
            titulo: 'Combo 3+3 Morango + Caps',
            itens: ['3 Velmo Black Morango', '3 Velmo Black Caps'],
            preco: 'R$ 461,50',
            parcelas: '12x de R$ 38,46',
            link: 'https://pay.hest.com.br/ddb3637f-2e01-4633-b276-c5e6337521d3',
            destaque: false
        },
        {
            titulo: 'Combo 3+3 Tangerina + Caps',
            itens: ['3 Velmo Black Tangerina', '3 Velmo Black Caps'],
            preco: 'R$ 461,50',
            parcelas: '12x de R$ 38,46',
            link: 'https://pay.hest.com.br/c7a4a09a-93ed-4804-b552-1b6b7104e2c9',
            destaque: false
        },
        {
            titulo: 'Combo 6+6 Morango + Tangerina',
            itens: ['6 Velmo Black Morango', '6 Velmo Black Tangerina'],
            preco: 'R$ 851,80',
            parcelas: '12x de R$ 70,98',
            link: 'https://pay.hest.com.br/111b868b-89f6-43e6-9348-56f045374826',
            destaque: false
        },
        {
            titulo: 'Combo 6+6 Morango + Caps',
            itens: ['6 Velmo Black Morango', '6 Velmo Black Caps'],
            preco: 'R$ 851,80',
            parcelas: '12x de R$ 70,98',
            link: 'https://pay.hest.com.br/67298069-a71d-4168-a2a5-c024dc1e4d7f',
            destaque: false
        },
        {
            titulo: 'Combo 6+6 Tangerina + Caps',
            itens: ['6 Velmo Black Tangerina', '6 Velmo Black Caps'],
            preco: 'R$ 851,80',
            parcelas: '12x de R$ 70,98',
            link: 'https://pay.hest.com.br/fdd2b644-178f-434f-a27c-5ae62548d060',
            destaque: false
        }
    ];

    function carregarCombos() {
        const container = document.getElementById('combos-container');
        if (!container) return;

        let html = '';

        combosData.forEach((combo, index) => {
            const classeDestaque = combo.destaque ? ' destaque' : '';

            html += `
                <div class="combo-card${classeDestaque}">
                    <h3 class="combo-titulo">${combo.titulo}</h3>
                    <ul class="combo-itens">
                        ${combo.itens.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                    </ul>
                    <div class="combo-preco-wrapper">
                        <button class="combo-btn-ver-valor" onclick="togglePrecoCombo(this)" data-preco="${combo.preco}" data-parcelas="${combo.parcelas}">
                            <i class="fas fa-eye"></i> Ver Valor
                        </button>
                        <div class="combo-preco-info" style="display: none;">
                            <span class="combo-preco-valor"></span>
                            <span class="combo-preco-parcelas"></span>
                        </div>
                    </div>
                    <div class="combo-acoes">
                        <a href="#" class="btn btn-buy btn-shine" data-link="${combo.link}">
                            <span>Comprar Agora</span>
                        </a>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Reativar listeners nos botões de comprar
        document.querySelectorAll('.btn-buy[data-link]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const link = this.getAttribute('data-link');
                if (link) {
                    window.open(link, '_blank');
                }
            });
        });
    }

    carregarCombos();

    // ===== LAZY LOAD =====
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===== SMOOTH SCROLL PARA ÂNCORAS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== TRACKING DE EVENTOS =====
    function trackEvent(categoria, acao, rotulo) {
        // Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', acao, {
                'event_category': categoria,
                'event_label': rotulo
            });
        }

        // Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('track', acao, {
                content_category: categoria,
                content_name: rotulo
            });
        }
    }

    // Track cliques nos botões de compra
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', function() {
            const produto = this.closest('.produto-card')?.dataset?.produto || 
                           this.closest('.combo-card')?.querySelector('.combo-titulo')?.textContent || 
                           'Produto Desconhecido';
            trackEvent('Conversão', 'click_comprar', produto);
        });
    });

    // Track envio de formulários
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const formId = this.id || 'formulario_desconhecido';
            trackEvent('Lead', 'formulario_enviado', formId);
        });
    });

});