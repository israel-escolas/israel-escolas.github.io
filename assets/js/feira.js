// ============================================
// FEIRA DE CIÊNCIAS 
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializações gerais
    initHamburgerMenu();
    initDropdowns();
    initCountdown();
    initFAQ();
    initScrollAnimations();
    initActiveNavLink();
    initFooterYear();
    initModalOficinas();
    atualizarBotoesOficina();
});
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });
}
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (!toggle) return;
        
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('open');
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('open');
                    }
                });
            }
        });
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('open'));
        }
    });
}

function initCountdown() {
    const targetDate = new Date(2026, 5, 25, 8, 0, 0); 
    
    const diasEl = document.getElementById('dias');
    const horasEl = document.getElementById('horas');
    const minutosEl = document.getElementById('minutos');
    const segundosEl = document.getElementById('segundos');
    
    if (!diasEl || !horasEl || !minutosEl || !segundosEl) return;
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            diasEl.textContent = '00';
            horasEl.textContent = '00';
            minutosEl.textContent = '00';
            segundosEl.textContent = '00';
            return;
        }
        
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);
        
        diasEl.textContent = String(dias).padStart(2, '0');
        horasEl.textContent = String(horas).padStart(2, '0');
        minutosEl.textContent = String(minutos).padStart(2, '0');
        segundosEl.textContent = String(segundos).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', () => {
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    
    if (section) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}
window.scrollToSection = scrollToSection;

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const animatableElements = document.querySelectorAll([
        '.destaque-card',
        '.regulamento-card',
        '.timeline-item',
        '.info-card',
        '.faq-item'
    ].join(', '));
    
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(el);
    });
}

function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');

        link.classList.remove('active');

        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}
function initFooterYear() {
    const yearSpan = document.getElementById('ano-atual');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

const horariosDisponiveis = [
    { id: '08:00', label: '08:00 - 09:00', disponivel: true },
    { id: '09:00', label: '09:00 - 10:00', disponivel: false },
    { id: '10:30', label: '10:30 - 11:30', disponivel: true },
    { id: '14:00', label: '14:00 - 15:00', disponivel: true },
    { id: '15:00', label: '15:00 - 16:00', disponivel: true },
    { id: '16:30', label: '16:30 - 17:30', disponivel: false }
];

function initModalOficinas() {
    const tipoInscricao = document.getElementById('tipo-inscricao');
    const qtdParticipantes = document.getElementById('qtd-participantes');
    const grupoParticipantes = document.getElementById('grupo-participantes');
    const naoEstuda = document.getElementById('nao-estuda');
    const escolaInput = document.getElementById('escola');

    if (tipoInscricao && qtdParticipantes && grupoParticipantes) {
        tipoInscricao.addEventListener('change', function() {
            if (this.value === 'individual') {
                qtdParticipantes.value = '1';
                qtdParticipantes.disabled = true;
                grupoParticipantes.style.opacity = '0.6';
            } else {
                qtdParticipantes.disabled = false;
                grupoParticipantes.style.opacity = '1';
                if (qtdParticipantes.value === '1') {
                    qtdParticipantes.value = '5';
                }
            }
        });
    }

    if (naoEstuda && escolaInput) {
        naoEstuda.addEventListener('change', function() {
            if (this.checked) {
                escolaInput.value = 'Não estuda';
                escolaInput.disabled = true;
                escolaInput.style.opacity = '0.6';
            } else {
                escolaInput.value = '';
                escolaInput.disabled = false;
                escolaInput.style.opacity = '1';
            }
        });
    }

    document.addEventListener('click', function(e) {
        const modalOficina = document.getElementById('modal-oficina');
        const modalConfirmacao = document.getElementById('modal-confirmacao');
        
        if (e.target === modalOficina) {
            fecharModal();
        }
        
        if (e.target === modalConfirmacao) {
            fecharConfirmacao();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
            fecharConfirmacao();
        }
    });
}
function abrirModalOficina() {
    const modal = document.getElementById('modal-oficina');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Previne scroll
        gerarHorarios();
    }
}
function fecharModal() {
    const modal = document.getElementById('modal-oficina');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        limparFormulario();
    }
}
function fecharConfirmacao() {
    const modal = document.getElementById('modal-confirmacao');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
function gerarHorarios() {
    const grid = document.getElementById('horarios-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    horariosDisponiveis.forEach(horario => {
        const option = document.createElement('div');
        option.className = `horario-option ${!horario.disponivel ? 'disabled' : ''}`;
        option.textContent = horario.label;
        
        if (horario.disponivel) {
            option.addEventListener('click', () => selecionarHorario(horario, option));
        }
        
        grid.appendChild(option);
    });
}

function selecionarHorario(horario, element) {
    document.querySelectorAll('.horario-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    document.getElementById('horario-selecionado').value = horario.id;
}
function limparFormulario() {
    const form = document.getElementById('form-oficina');
    if (form) {
        form.reset();
        document.getElementById('qtd-participantes').value = '1';
        document.querySelectorAll('.horario-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.getElementById('horario-selecionado').value = '';
    }
}

function mostrarErro(mensagem) {
    const alertaAnterior = document.querySelector('.alerta-erro');
    if (alertaAnterior) {
        alertaAnterior.remove();
    }
    const alerta = document.createElement('div');
    alerta.className = 'alerta-erro';
    alerta.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${mensagem}</span>
    `;
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f8d7da;
        color: #721c24;
        padding: 12px 24px;
        border-radius: 8px;
        border: 1px solid #f5c6cb;
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        animation: slideDown 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(alerta);
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => {
                if (alerta.parentNode) {
                    alerta.remove();
                }
            }, 300);
        }
    }, 3000);
}
function mostrarSucesso(mensagem) {
    const alertaAnterior = document.querySelector('.alerta-sucesso');
    if (alertaAnterior) {
        alertaAnterior.remove();
    }
    
    const alerta = document.createElement('div');
    alerta.className = 'alerta-sucesso';
    alerta.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${mensagem}</span>
    `;
    
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #d4edda;
        color: #155724;
        padding: 12px 24px;
        border-radius: 8px;
        border: 1px solid #c3e6cb;
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        animation: slideDown 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => {
                if (alerta.parentNode) {
                    alerta.remove();
                }
            }, 300);
        }
    }, 3000);
}
function mostrarCarregando(mensagem) {
    removerCarregando();
    
    const loader = document.createElement('div');
    loader.className = 'loader-pdf-overlay';
    loader.id = 'loader-pdf';
    loader.innerHTML = `
        <div class="loader-pdf-content">
            <div class="loader-pdf-spinner"></div>
            <p>${mensagem}</p>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function removerCarregando() {
    const loader = document.getElementById('loader-pdf');
    if (loader) {
        loader.remove();
    }
}

function inscreverOficina() {
    const tipoInscricao = document.getElementById('tipo-inscricao')?.value;
    const nome = document.getElementById('nome-responsavel')?.value.trim();
    const escola = document.getElementById('escola')?.value.trim();
    const qtdParticipantes = document.getElementById('qtd-participantes')?.value;
    const oficinaId = document.getElementById('oficina')?.value;
    const horarioId = document.getElementById('horario-selecionado')?.value;
   
    if (!tipoInscricao) {
        mostrarErro('Por favor, selecione o tipo de inscrição.');
        return;
    }
    
    if (!nome) {
        mostrarErro('Por favor, informe seu nome completo.');
        return;
    }
    
    if (!escola) {
        mostrarErro('Por favor, informe a escola.');
        return;
    }
    
    if (!qtdParticipantes || qtdParticipantes < 1) {
        mostrarErro('Por favor, informe a quantidade de participantes.');
        return;
    }
    
    if (!oficinaId) {
        mostrarErro('Por favor, selecione uma oficina.');
        return;
    }
    
    if (!horarioId) {
        mostrarErro('Por favor, selecione um horário.');
        return;
    }
    
    const oficinaSelect = document.getElementById('oficina');
    const oficinaNome = oficinaSelect.options[oficinaSelect.selectedIndex].text;
    
    const horarioOption = horariosDisponiveis.find(h => h.id === horarioId);
    const horarioLabel = horarioOption ? horarioOption.label : horarioId;

    document.getElementById('conf-nome').textContent = nome;
    document.getElementById('conf-escola').textContent = escola;
    document.getElementById('conf-participantes').textContent = qtdParticipantes;
    document.getElementById('conf-oficina').textContent = oficinaNome;
    document.getElementById('conf-horario').textContent = horarioLabel;
    document.getElementById('conf-data').textContent = '25 de Junho de 2026';

    fecharModal();
    
    setTimeout(() => {
        const modalConfirmacao = document.getElementById('modal-confirmacao');
        if (modalConfirmacao) {
            modalConfirmacao.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            const cartao = modalConfirmacao.querySelector('.cartao-confirmacao');
            if (cartao) {
                cartao.scrollTop = 0;
            }
        }
    }, 300);
}

function salvarInscricao() {
    const cartao = document.querySelector('.cartao-confirmacao');
    
    if (!cartao) {
        mostrarErro('Erro ao gerar comprovante. Tente novamente.');
        return;
    }

    if (typeof html2canvas === 'undefined') {
        mostrarErro('Funcionalidade não disponível. Use Ctrl+P para imprimir.');
        setTimeout(() => window.print(), 2000);
        return;
    }

    mostrarCarregando('Gerando comprovante...');
    const botoes = cartao.querySelector('.cartao-actions');
    const botoesDisplayOriginal = botoes ? botoes.style.display : '';
    if (botoes) {
        botoes.style.display = 'none';
    }
    
    html2canvas(cartao, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true
    }).then(canvas => {
        if (botoes) {
            botoes.style.display = botoesDisplayOriginal;
        }
        
        removerCarregando();
        const link = document.createElement('a');
        link.download = 'comprovante-oficina-feira-ciencias-2026.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        mostrarSucesso('Comprovante salvo com sucesso!');
    }).catch(error => {
        if (botoes) {
            botoes.style.display = botoesDisplayOriginal;
        }
        
        removerCarregando();
        console.error('Erro ao gerar comprovante:', error);
        mostrarErro('Erro ao gerar comprovante. Tente usar Ctrl+P para imprimir.');
    });
}
function atualizarBotoesOficina() {
    const botoesOficina = document.querySelectorAll('.science-btn');
    
    // Data de liberação: 16 de junho de 2026 às 00:00
    const dataLiberacao = new Date(2026, 5, 16, 0, 0, 0); // 16/06/2026 00:00
    const agora = new Date();
    
    botoesOficina.forEach(botao => {
        if (agora >= dataLiberacao) {
            // LIBERADO - Habilitar botão
            botao.disabled = false;
            botao.style.cursor = 'pointer';
            botao.style.opacity = '1';
            botao.classList.add('btn-liberado');
            botao.classList.remove('btn-bloqueado');
            botao.title = '✅ Inscrições abertas! Clique para se inscrever';
            
            // Garantir evento de clique
            botao.removeEventListener('click', abrirModalOficina);
            botao.addEventListener('click', abrirModalOficina);
        } else {
            // BLOQUEADO - Manter desabilitado
            botao.disabled = true;
            botao.style.cursor = 'not-allowed';
            botao.style.opacity = '0.6';
            botao.classList.add('btn-bloqueado');
            botao.classList.remove('btn-liberado');
            
            // Calcular tempo restante
            const diffMs = dataLiberacao - agora;
            const diasRestantes = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const horasRestantes = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            let mensagemTooltip = '🔒 Inscrições indisponíveis\n';
            
            if (diasRestantes > 0) {
                mensagemTooltip += `Disponível em ${diasRestantes} dia(s) e ${horasRestantes} hora(s)`;
            } else if (horasRestantes > 0) {
                mensagemTooltip += `Disponível em ${horasRestantes} hora(s)`;
            } else {
                const minutosRestantes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                mensagemTooltip += `Disponível em ${minutosRestantes} minuto(s)`;
            }
            
            mensagemTooltip += '\nA partir de 16/06/2026';
            
            botao.title = mensagemTooltip;
        }
    });
}
setInterval(atualizarBotoesOficina, 60000);

setInterval(atualizarBotoesOficina, 3600000);

const styleAlerta = document.createElement('style');
styleAlerta.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    .loader-pdf-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.2s ease;
    }
    
    .loader-pdf-content {
        background: white;
        padding: 30px 40px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    
    .loader-pdf-content p {
        margin-top: 15px;
        color: #2c3e50;
        font-weight: 600;
        font-size: 0.95rem;
    }
    
    .loader-pdf-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #e0e0e0;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @media print {
        body * {
            visibility: hidden;
        }
        .cartao-confirmacao, .cartao-confirmacao * {
            visibility: visible;
        }
        .cartao-confirmacao {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            box-shadow: none;
            margin: 0;
            padding: 20px;
        }
        .cartao-actions {
            display: none;
        }
        .modal-overlay {
            background: none;
            position: static;
        }
    }
`;
document.head.appendChild(styleAlerta);

window.abrirModalOficina = abrirModalOficina;
window.fecharModal = fecharModal;
window.fecharConfirmacao = fecharConfirmacao;
window.inscreverOficina = inscreverOficina;
window.salvarInscricao = salvarInscricao;