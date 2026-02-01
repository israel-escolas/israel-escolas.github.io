/**
 * videos.js - Gerenciador de vídeos simples
 * Funciona em PC e Celular
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de vídeos carregado');
    
    // 1. Carregar vídeos do YouTube
    loadYouTubeVideos();
    
    // 2. Configurar toggles
    setupToggles();
    
    // 3. Adicionar interações simples
    setupInteractions();
});

/**
 * Carrega os vídeos do YouTube com parâmetros otimizados
 */
function loadYouTubeVideos() {
    const players = document.querySelectorAll('.youtube-player');
    
    players.forEach(player => {
        const videoId = player.getAttribute('data-id');
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Parâmetros para o iframe
        let params = '?rel=0&modestbranding=1&playsinline=1';
        
        // Parâmetros adicionais para mobile
        if (isMobile) {
            params += '&fs=0'; // Remove botão de tela cheia no mobile
        }
        
        // Criar iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}${params}`;
        iframe.title = 'Vídeo do YouTube';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        
        // Atributos para iOS
        iframe.setAttribute('webkit-playsinline', '');
        iframe.setAttribute('playsinline', '');
        
        // Adicionar iframe ao container
        player.appendChild(iframe);
        
        console.log(`Vídeo ${videoId} carregado`);
    });
}

/**
 * Configura os botões de expandir/recolher
 */
function setupToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        const targetId = button.getAttribute('data-target');
        const target = document.getElementById(targetId);
        const icon = button.querySelector('.toggle-icon');
        const text = button.querySelector('.toggle-text');
        
        if (!target) return;
        
        // Iniciar recolhido
        target.style.display = 'none';
        
        button.addEventListener('click', function() {
            const isHidden = target.style.display === 'none';
            
            if (isHidden) {
                // Mostrar
                target.style.display = 'block';
                target.classList.add('active');
                text.textContent = 'Ocultar informações do vídeo';
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.className = 'fas fa-chevron-up toggle-icon';
                    icon.style.transform = 'rotate(0deg)';
                }, 150);
                
                // Scroll suave
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                // Esconder
                target.style.display = 'none';
                target.classList.remove('active');
                text.textContent = 'Mostrar informações do vídeo';
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.className = 'fas fa-chevron-down toggle-icon';
                    icon.style.transform = 'rotate(0deg)';
                }, 150);
            }
        });
        
        // Efeitos visuais
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Configura interações simples
 */
function setupInteractions() {
    // Tags com hover
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Cards com hover
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        });
    });
    
    // Atividades com clique
    const activities = document.querySelectorAll('.activities li');
    activities.forEach(activity => {
        activity.addEventListener('click', function() {
            const original = this.textContent;
            this.textContent = '✓ Selecionado';
            this.style.color = '#4caf50';
            this.style.fontWeight = 'bold';
            
            setTimeout(() => {
                this.textContent = original;
                this.style.color = '';
                this.style.fontWeight = '';
            }, 1500);
        });
    });
}

/**
 * Função para adicionar novos vídeos facilmente
 */
function addNewVideo(videoData) {
    // videoData deve conter: id, title, badge, description, details, tags, reflection, activities
    console.log('Função para adicionar novo vídeo:', videoData);
    
    // Exemplo de uso:
    // addNewVideo({
    //     id: 'CODIGO_DO_YOUTUBE',
    //     title: 'Título do Vídeo',
    //     badge: 'Gênero',
    //     description: 'Descrição...',
    //     details: { diretor: 'Nome', ano: '2023', duracao: '10min', pais: 'Brasil', formato: 'Tipo' },
    //     tags: ['Tag1', 'Tag2', 'Tag3'],
    //     reflection: 'Pergunta reflexiva?',
    //     activities: ['Atividade 1', 'Atividade 2', 'Atividade 3']
    // });
}

// Função auxiliar para detectar iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Correção para redimensionamento
window.addEventListener('resize', function() {
    // Recalcular tamanho dos iframes se necessário
    document.querySelectorAll('.video-container iframe').forEach(iframe => {
        iframe.style.height = iframe.parentElement.offsetHeight + 'px';
    });
});

// Adicionar classe de carregamento
document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
        document.body.classList.add('videos-loaded');
    }
});