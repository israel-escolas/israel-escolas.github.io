// ============================================
// INTERATIVIDADE PARA PÁGINA INFORMAÇÕES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');
            
            // Fecha todas as outras
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Abre esta
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
    
    // Navegação suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Ativa item do menu de navegação
                document.querySelectorAll('.info-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Destacar seção ativa ao rolar
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.info-section');
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.info-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const correspondingNav = document.querySelector(`.info-nav-item[href="#${sectionId}"]`);
                if (correspondingNav) {
                    correspondingNav.classList.add('active');
                }
            }
        });
    });
});
// Modal para expandir imagem
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do modal
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    
    // Pega todas as imagens dentro de .uniform-image
    const uniformImages = document.querySelectorAll('.uniform-image img');
    
    // Adiciona evento de clique em cada imagem
    uniformImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            
            // Usa o texto da imagem ou do título
            const cardTitle = this.closest('.uniform-card').querySelector('h3');
            captionText.innerHTML = cardTitle ? cardTitle.textContent : this.alt;
            
            // Previne scroll da página
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Fecha modal ao clicar no X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Fecha modal ao clicar fora da imagem
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fecha modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fecha modal ao tocar fora em mobile (touch)
    modal.addEventListener('touchstart', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
// ============================
// CARROSSEL DA ESTRUTURA
// ============================

document.addEventListener('DOMContentLoaded', async () => {
    const estruturaCarousel = document.getElementById('estruturaCarousel');
    const estruturaIndicators = document.getElementById('estruturaIndicators');
    const estruturaPrev = document.getElementById('estruturaPrev');
    const estruturaNext = document.getElementById('estruturaNext');
    const currentSlideSpan = document.getElementById('currentSlide');
    const totalSlidesSpan = document.getElementById('totalSlides');
    
    // Verificar se os elementos existem
    if (!estruturaCarousel) return;
    
    let currentSlide = 0;
    let slides = [];
    let timer;
    
    try {
        // Buscar fotos da escola usando a função já existente
        console.log('Buscando fotos da estrutura...');
        const fotos = await buscarFotosEstrutura();
        
        if (fotos.length === 0) {
            estruturaCarousel.innerHTML = `
                <div class="carousel-loading">
                    <i class="fas fa-camera-slash"></i>
                    <span>Nenhuma foto disponível no momento</span>
                </div>
            `;
            return;
        }
        
        // Limitar a 10 fotos para performance
        const fotosLimitadas = fotos.slice(0, 10);
        
        // Atualizar contador total
        totalSlidesSpan.textContent = fotosLimitadas.length;
        
        // Limpar carregamento
        estruturaCarousel.innerHTML = '';
        estruturaIndicators.innerHTML = '';
        
        // Criar slides
        fotosLimitadas.forEach((foto, index) => {
            // Converter link do Google Drive
            const linksConvertidos = converterLinksDrive(foto.LINK || '');
            const imageUrl = linksConvertidos[0] || 'assets/img/default-school.jpg';
            
            // Criar slide
            const slide = document.createElement('div');
            slide.className = 'estrutura-slide';
            if (index === 0) slide.classList.add('active');
            
            slide.innerHTML = `
                <img src="${imageUrl}" 
                     alt="${foto.DESCRICAO || 'Estrutura da escola'}" 
                     loading="lazy">
                ${foto.DESCRICAO ? `
                <div class="slide-caption">
                    <h3>${foto.TITULO || 'Nossa Estrutura'}</h3>
                    <p>${foto.DESCRICAO}</p>
                </div>
                ` : ''}
            `;
            
            estruturaCarousel.appendChild(slide);
            
            // Criar indicador
            const indicator = document.createElement('div');
            indicator.className = 'estrutura-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            estruturaIndicators.appendChild(indicator);
        });
        
        slides = document.querySelectorAll('.estrutura-slide');
        const indicators = document.querySelectorAll('.estrutura-indicator');
        
        // Função para ir para slide específico
        function goToSlide(index) {
            // Remover classe active de todos os slides
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Adicionar classe active ao slide atual
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Atualizar contador
            currentSlideSpan.textContent = currentSlide + 1;
            
            // Reiniciar timer
            resetTimer();
        }
        
        // Próximo slide
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        }
        
        // Slide anterior
        function prevSlide() {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        }
        
        // Configurar autoplay
        function startAutoPlay() {
            timer = setInterval(nextSlide, 5000);
        }
        
        function resetTimer() {
            clearInterval(timer);
            startAutoPlay();
        }
        
        // Pausar autoplay quando o mouse estiver sobre o carrossel
        estruturaCarousel.addEventListener('mouseenter', () => {
            clearInterval(timer);
        });
        
        estruturaCarousel.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
        
        // Event listeners para os controles
        if (estruturaNext) {
            estruturaNext.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
            });
        }
        
        if (estruturaPrev) {
            estruturaPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
            });
        }
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Navegação por swipe em dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        estruturaCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        estruturaCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe para a esquerda - próximo
                nextSlide();
            }
            
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe para a direita - anterior
                prevSlide();
            }
        }
        
        // Iniciar
        startAutoPlay();
        console.log(`Carrossel de estrutura iniciado com ${slides.length} imagens`);
        
    } catch (error) {
        console.error('Erro ao carregar carrossel da estrutura:', error);
        estruturaCarousel.innerHTML = `
            <div class="carousel-loading">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Erro ao carregar imagens</span>
                <p style="font-size: 0.8rem; margin-top: 10px;">${error.message}</p>
            </div>
        `;
    }
});