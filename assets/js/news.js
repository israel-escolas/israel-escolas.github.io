// news.js - Gerenciador de Notícias
class NewsManager {
    constructor() {
        this.noticias = [];
        this.currentSlide = 0;
        this.carousel = document.getElementById('newsCarousel');
        this.indicators = document.getElementById('newsIndicators');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.autoPlayInterval = null;
        this.isTransitioning = false;
        
        // Verificar se elementos existem antes de inicializar
        if (!this.carousel) {
            console.warn('⚠️ Carrossel de notícias não encontrado no DOM');
            return;
        }
        
        this.init();
    }

    async init() {
        await this.loadNews();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    async loadNews() {
        try {
            // Tenta carregar do arquivo JSON primeiro
            const response = await fetch('assets/txt/news.json');
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.noticias && Array.isArray(data.noticias)) {
                    this.noticias = data.noticias;
                    console.log(`✅ ${this.noticias.length} notícias carregadas do JSON`);
                }
            }
            
            // SE NÃO HOUVER NOTÍCIAS, BUSCAR FOTOS DA ESCOLA COMO FALLBACK
            if (this.noticias.length === 0) {
                console.log("📸 Nenhuma notícia encontrada, buscando fotos da escola como fallback...");
                
                // Verifica se a função global existe
                if (typeof window.buscarFotosEscola === 'function') {
                    const fotosEscola = await window.buscarFotosEscola();
                    
                    if (fotosEscola && fotosEscola.length > 0) {
                        console.log(`✅ Encontradas ${fotosEscola.length} fotos da escola para usar como notícias`);
                        
                        // Converter fotos em formato de notícia
                        this.noticias = fotosEscola.map((foto, index) => ({
                            id: index + 1,
                            titulo: "Escola Estadual Mariana Cavalcanti",
                            conteudo: foto.DESCRICAO || "Conheça as instalações da nossa escola",
                            imagem: foto.LINK || "assets/img/Escola_Entrada.jpg",
                            data: foto.DATA || new Date().toISOString().split('T')[0],
                            legenda: foto.LEGENDA || "Foto da estrutura escolar"
                        }));
                    } else {
                        console.log('⚠️ Nenhuma foto encontrada na planilha');
                    }
                } else {
                    console.warn('⚠️ Função buscarFotosEscola não está disponível');
                }
            }
            
            // Renderizar (mesmo que seja com fotos ou vazio)
            this.renderNews();
            
        } catch (error) {
            console.error('❌ Erro ao carregar notícias:', error);
            this.showError('Erro ao carregar notícias. Tente novamente mais tarde.');
        }
    }

    renderNews() {
        if (!this.carousel) return;

        // Limpar carrossel existente
        this.carousel.innerHTML = '';
        
        // Se ainda não houver notícias (nem fotos)
        if (this.noticias.length === 0) {
            this.carousel.innerHTML = `
                <div class="news-slide active">
                    <div class="news-card">
                        <div class="news-content">
                            <h2>📰 Nenhuma notícia disponível</h2>
                            <p>Em breve teremos novidades para compartilhar com você!</p>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 15px;">
                                <i class="fas fa-school"></i> Escola Estadual Mariana Cavalcanti
                            </p>
                        </div>
                        <img src="assets/img/Escola_Entrada.jpg" 
                             alt="Escola Mariana Cavalcanti" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Escola+Mariana+Cavalcanti'"
                             loading="lazy">
                    </div>
                </div>
            `;
            
            // Atualizar indicadores vazios
            this.updateIndicators(1);
            if (this.totalSlidesSpan) this.totalSlidesSpan.textContent = '1';
            if (this.currentSlideSpan) this.currentSlideSpan.textContent = '1';
            return;
        }
        
        // Renderizar cada notícia (ou foto convertida)
        this.noticias.forEach((noticia, index) => {
            const slide = document.createElement('div');
            slide.className = `news-slide ${index === 0 ? 'active' : ''}`;
            
            // Converter link da imagem se necessário
            let imagemUrl = noticia.imagem;
            
            // Tenta converter usando a função global
            if (typeof window.converterLinksDrive === 'function') {
                const urlsConvertidas = window.converterLinksDrive(noticia.imagem);
                if (urlsConvertidas && urlsConvertidas.length > 0) {
                    imagemUrl = urlsConvertidas[0];
                }
            }
            
            // Fallback se a imagem estiver vazia
            if (!imagemUrl || imagemUrl.trim() === '') {
                imagemUrl = 'assets/img/Escola_Entrada.jpg';
            }
            
            // Formatar data
            const dataFormatada = this.formatDate(noticia.data);
            
            slide.innerHTML = `
                <div class="news-card">
                    <div class="news-content">
                        <h2>${this.escapeHtml(noticia.titulo)}</h2>
                        <p>${this.escapeHtml(noticia.conteudo)}</p>
                        
                        <div class="news-meta">
                            <small class="news-date">
                                <i class="far fa-calendar-alt"></i> 
                                ${dataFormatada}
                            </small>
                            
                            ${noticia.legenda ? `
                                <small class="news-caption">
                                    <i class="fas fa-camera"></i> 
                                    ${this.escapeHtml(noticia.legenda)}
                                </small>
                            ` : ''}
                        </div>
                        
                    ${noticia.id ? `
                            <a href="informacoes.html?id=${noticia.id}#estrutura" class="view-details-btn" style="margin-top: 15px;">
                                Leia mais <i class="fas fa-arrow-right"></i>
                            </a>
                    ` : ''}
                    </div>
                    <div class="news-image">
                        <img src="${imagemUrl}" 
                             alt="${this.escapeHtml(noticia.titulo)}" 
                             onerror="this.onerror=null; this.src='assets/img/Escola_Entrada.jpg';"
                             loading="lazy">
                    </div>
                </div>
            `;
            
            this.carousel.appendChild(slide);
        });

        // Atualizar indicadores
        this.updateIndicators(this.noticias.length);
        if (this.totalSlidesSpan) this.totalSlidesSpan.textContent = this.noticias.length;
        if (this.currentSlideSpan) this.currentSlideSpan.textContent = '1';
    }

    updateIndicators(totalSlides) {
        if (!this.indicators) return;
        
        this.indicators.innerHTML = '';
        const numSlides = totalSlides || this.noticias.length || 1;
        
        for (let i = 0; i < numSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${i === this.currentSlide ? 'active' : ''}`;
            indicator.dataset.slide = i;
            indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            
            indicator.addEventListener('click', () => this.goToSlide(i));
            
            this.indicators.appendChild(indicator);
        }
    }

    updateCounter() {
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide + 1;
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Data não informada';
        
        try {
            // Se já estiver formatado, retorna
            if (typeof dateString === 'string' && dateString.includes('/')) {
                return dateString;
            }
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        
        const slides = document.querySelectorAll('.news-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!slides.length) return;
        
        // Validar índice
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        this.isTransitioning = true;
        
        // Remover active de todos os slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Adicionar active ao slide atual
        slides[index].classList.add('active');
        
        // Atualizar indicadores
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
        this.updateCounter();
        
        // Liberar transição após animação
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    nextSlide() {
        const slides = document.querySelectorAll('.news-slide');
        if (!slides.length) return;
        
        const nextIndex = (this.currentSlide + 1) % slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const slides = document.querySelectorAll('.news-slide');
        if (!slides.length) return;
        
        const prevIndex = (this.currentSlide - 1 + slides.length) % slides.length;
        this.goToSlide(prevIndex);
    }

    setupEventListeners() {
        // Botões de navegação
        const nextBtn = document.querySelector('.news-next');
        const prevBtn = document.querySelector('.news-prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
                this.resetAutoPlay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
                this.resetAutoPlay();
            });
        }

        // Controles por teclado (só se o carrossel estiver visível)
        document.addEventListener('keydown', (e) => {
            // Verifica se o carrossel está visível na tela
            const carouselContainer = document.querySelector('.news-carousel-container');
            if (!carouselContainer) return;
            
            const rect = carouselContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                    this.resetAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoPlay();
                }
            }
        });

        // Pausar no hover
        const container = document.querySelector('.news-carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Pausar quando a aba não está visível (economia de recursos)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
        
        // Touch events para mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (this.carousel) {
            this.carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }
    }

    handleSwipe() {
        const slides = document.querySelectorAll('.news-slide');
        if (!slides.length) return;
        
        const swipeThreshold = 50; // pixels mínimos para considerar swipe
        const diffX = touchEndX - touchStartX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe para direita (anterior)
                this.prevSlide();
            } else {
                // Swipe para esquerda (próximo)
                this.nextSlide();
            }
            this.resetAutoPlay();
        }
    }

    startAutoPlay() {
        // Não iniciar se tiver 1 ou nenhum slide
        const slides = document.querySelectorAll('.news-slide');
        if (slides.length <= 1) return;
        
        this.stopAutoPlay();
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000); // 6 segundos
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    showError(message) {
        if (!this.carousel) return;
        
        this.carousel.innerHTML = `
            <div class="news-slide active">
                <div class="news-card">
                    <div class="news-content">
                        <h2>😕 Ops! Algo deu errado</h2>
                        <p>${this.escapeHtml(message)}</p>
                        <button onclick="window.location.reload()" class="retry-btn">
                            <i class="fas fa-redo"></i> Tentar novamente
                        </button>
                    </div>
                    <img src="assets/img/Escola_Entrada.jpg" 
                         alt="Escola Mariana Cavalcanti" 
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Erro'"
                         loading="lazy">
                </div>
            </div>
        `;
        
        // Atualizar indicadores
        this.updateIndicators(1);
        if (this.totalSlidesSpan) this.totalSlidesSpan.textContent = '1';
        if (this.currentSlideSpan) this.currentSlideSpan.textContent = '1';
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se já existe uma instância
    if (!window.newsManager) {
        window.newsManager = new NewsManager();
        console.log('🚀 NewsManager inicializado com fallback para fotos da escola');
    }
});

// Para debug (opcional)
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    window.debugNews = () => {
        console.log('📊 Debug do NewsManager:');
        console.log('- Notícias:', window.newsManager?.noticias);
        console.log('- Slide atual:', window.newsManager?.currentSlide);
        console.log('- AutoPlay:', window.newsManager?.autoPlayInterval ? 'Ativo' : 'Inativo');
    };
}