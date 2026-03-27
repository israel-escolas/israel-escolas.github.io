// news.js - Gerenciador de Notícias com fallback combinado
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
        
        // Configuração do fallback
        this.MIN_NOTICIAS = 4; // Mínimo de notícias desejado
        this.usouFallback = false; // Flag para saber se usou fallback
        
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
            let noticiasOriginais = [];
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.noticias && Array.isArray(data.noticias)) {
                    noticiasOriginais = data.noticias;
                    console.log(`✅ ${noticiasOriginais.length} notícias carregadas do JSON`);
                }
            }
            
            // VERIFICA SE PRECISA DE FALLBACK (menos que o mínimo)
            if (noticiasOriginais.length < this.MIN_NOTICIAS) {
                console.log(`📸 Apenas ${noticiasOriginais.length} notícias encontradas. Buscando fotos da escola para completar...`);
                
                // Busca fotos da escola como fallback
                if (typeof window.buscarFotosEscola === 'function') {
                    const fotosEscola = await window.buscarFotosEscola();
                    
                    if (fotosEscola && fotosEscola.length > 0) {
                        console.log(`✅ Encontradas ${fotosEscola.length} fotos da escola`);
                        
                        // Calcula quantas fotos precisa para atingir o mínimo
                        const faltam = this.MIN_NOTICIAS - noticiasOriginais.length;
                        const fotosNecessarias = Math.min(faltam, fotosEscola.length);
                        
                        // Converte as fotos necessárias em formato de notícia
                        const fotosComoNoticias = fotosEscola.slice(0, fotosNecessarias).map((foto, index) => ({
                            id: `fallback_${index + 1}`,
                            titulo: "📸 Conheça Nossa Escola",
                            conteudo: foto.DESCRICAO || "Venha conhecer as instalações da Escola Estadual Mariana Cavalcanti",
                            imagem: foto.LINK || "assets/img/Escola_Entrada.jpg",
                            data: foto.DATA || new Date().toISOString().split('T')[0],
                            legenda: foto.LEGENDA || "Foto da estrutura escolar",
                            isFallback: true // Marca como conteúdo de fallback
                        }));
                        
                        // COMBINA notícias originais + fotos de fallback
                        this.noticias = [...noticiasOriginais, ...fotosComoNoticias];
                        this.usouFallback = fotosNecessarias > 0;
                        
                        console.log(`🎯 Total: ${this.noticias.length} itens (${noticiasOriginais.length} notícias + ${fotosNecessarias} fotos complementares)`);
                    } else {
                        // Não encontrou fotos, usa só as notícias que tem
                        this.noticias = noticiasOriginais;
                        console.log(`⚠️ Nenhuma foto encontrada, usando apenas ${this.noticias.length} notícias`);
                    }
                } else {
                    console.warn('⚠️ Função buscarFotosEscola não está disponível');
                    this.noticias = noticiasOriginais;
                }
            } else {
                // Tem notícias suficientes, usa só elas
                this.noticias = noticiasOriginais;
                console.log(`✅ ${this.noticias.length} notícias suficientes, sem necessidade de fallback`);
            }
            
            // Renderizar (mesmo que seja vazio)
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
        
        // Se não houver absolutamente nada
        if (this.noticias.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        // Renderizar cada notícia (combinadas)
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
            
            // Adiciona classe especial se for fallback
            const fallbackClass = noticia.isFallback ? 'news-fallback' : '';
            
            slide.innerHTML = `
                <div class="news-card ${fallbackClass}">
                    <div class="news-content">
                        ${noticia.isFallback ? '<span class="fallback-badge">📸 Conheça a Escola</span>' : ''}
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
                        
                    ${!noticia.isFallback && (noticia.link || noticia.id) ? `
                        <a href="${noticia.link ? noticia.link : `informacoes.html?id=${noticia.id}#estrutura`}" 
                        class="view-details-btn" 
                        style="margin-top: 15px;"
                        ${noticia.link ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                            ${noticia.link ? 'Saiba mais' : 'Leia mais'} <i class="fas ${noticia.link ? 'fa-external-link-alt' : 'fa-arrow-right'}"></i>
                        </a>
                    ` : noticia.isFallback ? `
                        <a href="informacoes.html?id=${noticia.id}#estrutura"  class="view-details-btn" style="margin-top: 15px;">
                            Ver galeria completa <i class="fas fa-images"></i>
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

        // Adicionar aviso se usou fallback
        if (this.usouFallback) {
            this.addFallbackNotice();
        }

        // Atualizar indicadores
        this.updateIndicators(this.noticias.length);
        if (this.totalSlidesSpan) this.totalSlidesSpan.textContent = this.noticias.length;
        if (this.currentSlideSpan) this.currentSlideSpan.textContent = '1';
    }

    renderEmptyState() {
        if (!this.carousel) return;
        
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
    }

    addFallbackNotice() {
        // Adiciona um aviso sutil no carrossel indicando que há conteúdo complementar
        const notice = document.createElement('div');
        notice.className = 'fallback-notice';
        notice.innerHTML = `
            <div class="fallback-notice-content">
                <i class="fas fa-info-circle"></i>
                <span>Complementamos com fotos da escola para melhor experiência</span>
            </div>
        `;
        
        // Insere após o carrossel
        const container = document.querySelector('.news-carousel-container');
        if (container && !document.querySelector('.fallback-notice')) {
            container.appendChild(notice);
            
            // Remove após 5 segundos
            setTimeout(() => {
                notice.style.opacity = '0';
                setTimeout(() => notice.remove(), 500);
            }, 5000);
        }
    }

    updateIndicators(totalSlides) {
        if (!this.indicators) return;
        
        this.indicators.innerHTML = '';
        const numSlides = totalSlides || this.noticias.length || 1;
        
        for (let i = 0; i < numSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${i === this.currentSlide ? 'active' : ''}`;
            
            // Adiciona indicador visual se for slide de fallback
            if (this.noticias[i] && this.noticias[i].isFallback) {
                indicator.classList.add('indicator-fallback');
                indicator.setAttribute('aria-label', `Slide ${i + 1} - Conteúdo da galeria da escola`);
            } else {
                indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            }
            
            indicator.dataset.slide = i;
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
        
        // Salvar variáveis para o swipe
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Bind dos métodos de swipe
        this.handleSwipe = this.handleSwipe.bind(this);
    }

    handleSwipe() {
        const slides = document.querySelectorAll('.news-slide');
        if (!slides.length) return;
        
        const swipeThreshold = 50; // pixels mínimos para considerar swipe
        const diffX = this.touchEndX - this.touchStartX;
        
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
        console.log('🚀 NewsManager inicializado com fallback combinado');
    }
});

// Para debug (opcional)
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    window.debugNews = () => {
        console.log('📊 Debug do NewsManager:');
        console.log('- Notícias:', window.newsManager?.noticias);
        console.log('- Slide atual:', window.newsManager?.currentSlide);
        console.log('- AutoPlay:', window.newsManager?.autoPlayInterval ? 'Ativo' : 'Inativo');
        console.log('- Usou fallback:', window.newsManager?.usouFallback);
        console.log('- Mínimo configurado:', window.newsManager?.MIN_NOTICIAS);
    };
}