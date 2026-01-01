// Funções da Página de Contato

// Formulário de Contato
document.addEventListener('DOMContentLoaded', function() {
    // Formulário de contato
    const formContato = document.getElementById('formContato');
    
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            if (!nome || !mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de email simples
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Aqui você pode adicionar o código para enviar o formulário
            // Por enquanto, só mostra o modal de confirmação
            mostrarModalConfirmacao();
            
            // Limpar formulário
            formContato.reset();
        });
    }
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = '(' + value;
                } else if (value.length <= 7) {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
                } else if (value.length <= 11) {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7);
                } else {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // FAQ Accordion
    const faqPerguntas = document.querySelectorAll('.faq-pergunta');
    
    faqPerguntas.forEach(pergunta => {
        pergunta.addEventListener('click', function() {
            const faqItem = this.parentElement;
            
            // Fecha outros itens
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Alterna o item atual
            faqItem.classList.toggle('active');
        });
    });
    
    // Botão Fale Conosco no footer
    const footerBtn = document.querySelector('.footer-btn');
    if (footerBtn) {
        footerBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Foca no formulário
            const form = document.getElementById('formContato');
            if (form) {
                setTimeout(() => {
                    document.getElementById('nome').focus();
                }, 500);
            }
        });
    }
});

// Função para mostrar modal de confirmação
function mostrarModalConfirmacao() {
    const modal = document.getElementById('modalConfirmacao');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar modal
function fecharModal() {
    const modal = document.getElementById('modalConfirmacao');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Fechar modal ao clicar fora ou pressionar ESC
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalConfirmacao');
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                fecharModal();
            }
        });
    }
});