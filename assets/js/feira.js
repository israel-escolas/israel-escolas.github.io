// ============================================
// FEIRA DE CIÊNCIAS - SCRIPT PRINCIPAL
// Versão LIMPA - Apenas funções gerais
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initDropdowns();
    initCountdown();
    initFAQ();
    initScrollAnimations();
    initActiveNavLink();
    initFooterYear();
});

// ============================================
// MENU HAMBURGER
// ============================================
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

// ============================================
// DROPDOWNS
// ============================================
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
                    if (other !== dropdown) other.classList.remove('open');
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

// ============================================
// COUNTDOWN
// ============================================
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
        
        diasEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
        horasEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        minutosEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        segundosEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// FAQ
// ============================================
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });
}

// ============================================
// SCROLL SUAVE
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        window.scrollTo({
            top: section.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20,
            behavior: 'smooth'
        });
    }
}
window.scrollToSection = scrollToSection;

// ============================================
// ANIMAÇÕES DE SCROLL
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.destaque-card, .regulamento-card, .timeline-item, .info-card, .faq-item, .modelo-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(el);
    });
}

// ============================================
// LINK ATIVO NO MENU
// ============================================
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
}

// ============================================
// ANO NO FOOTER
// ============================================
function initFooterYear() {
    const yearSpan = document.getElementById('ano-atual');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// ============================================
// ALERTAS (compartilhados)
// ============================================
function mostrarErro(mensagem) {
    const alertaAnterior = document.querySelector('.alerta-erro');
    if (alertaAnterior) alertaAnterior.remove();
    
    const alerta = document.createElement('div');
    alerta.className = 'alerta-erro';
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${mensagem}</span>`;
    
    Object.assign(alerta.style, {
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        background: '#f8d7da', color: '#721c24', padding: '12px 24px', borderRadius: '8px',
        border: '1px solid #f5c6cb', zIndex: '2000', display: 'flex', alignItems: 'center',
        gap: '10px', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    });
    
    document.body.appendChild(alerta);
    setTimeout(() => {
        if (alerta.parentNode) alerta.remove();
    }, 3000);
}

function mostrarSucesso(mensagem) {
    const alertaAnterior = document.querySelector('.alerta-sucesso');
    if (alertaAnterior) alertaAnterior.remove();
    
    const alerta = document.createElement('div');
    alerta.className = 'alerta-sucesso';
    alerta.setAttribute('role', 'status');
    alerta.innerHTML = `<i class="fas fa-check-circle"></i><span>${mensagem}</span>`;
    
    Object.assign(alerta.style, {
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        background: '#d4edda', color: '#155724', padding: '12px 24px', borderRadius: '8px',
        border: '1px solid #c3e6cb', zIndex: '2000', display: 'flex', alignItems: 'center',
        gap: '10px', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    });
    
    document.body.appendChild(alerta);
    setTimeout(() => {
        if (alerta.parentNode) alerta.remove();
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
    if (loader) loader.remove();
}

// ============================================
// PREVIEW DE DOCUMENTOS
// ============================================
function previewDocumento(url, titulo) {
    const modal = document.getElementById('modal-preview');
    if (!modal) return;
    document.getElementById('preview-titulo').innerHTML = `<i class="fas fa-file-alt"></i> ${titulo}`;
    document.getElementById('preview-download-link').href = url;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function fecharPreview() {
    const modal = document.getElementById('modal-preview');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// ============================================
// EXPORTAR
// ============================================
window.scrollToSection = scrollToSection;
window.previewDocumento = previewDocumento;
window.fecharPreview = fecharPreview;
window.mostrarErro = mostrarErro;
window.mostrarSucesso = mostrarSucesso;
window.mostrarCarregando = mostrarCarregando;
window.removerCarregando = removerCarregando;