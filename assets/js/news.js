// news.js 
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
        
        this.MIN_NOTICIAS = 6;
        this.usouFallback = false;
        
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
            console.log('📰 Buscando notícias da planilha...');
            
            let noticiasOriginais = [];
            
            if (typeof window.fetchData === 'function') {
                try {
                    const dadosPlanilha = await window.fetchData('NEWS', 'news');
                    
                    if (dadosPlanilha && Array.isArray(dadosPlanilha)) {
                        noticiasOriginais = dadosPlanilha
                            .filter(item => item.titulo && item.titulo.trim() !== '')
                            .map((item, index) => ({
                                id: index + 1,
                                titulo: item.titulo || 'Notícia sem título',
                                conteudo: item.conteudo || 'Conteúdo não disponível',
                                imagem: item.imagem || '',
                                data: item.data || new Date().toISOString().split('T')[0],
                                legenda: item.legenda || '',
                                link: item.link || ''
                            }));
                        
                        console.log(`✅ ${noticiasOriginais.length} notícias carregadas da planilha NEWS`);
                    } else {
                        console.warn('⚠️ Nenhuma notícia encontrada na planilha');
                        noticiasOriginais = [];
                    }
                } catch (planilhaError) {
                    console.error('❌ Erro ao buscar da planilha:', planilhaError);
                    console.log('🔄 Tentando fallback para news.json...');
                    noticiasOriginais = await this.loadFromJson();
                }
            } else {
                console.warn('⚠️ Função fetchData não encontrada, tentando JSON...');
                noticiasOriginais = await this.loadFromJson();
            }

            noticiasOriginais = this.filtrarNoticiasRecentes(noticiasOriginais);

            if (noticiasOriginais.length < this.MIN_NOTICIAS) {
                console.log(`📸 Apenas ${noticiasOriginais.length} notícias. Buscando fotos da escola...`);
                
                if (typeof window.buscarFotosEscola === 'function') {
                    const fotosEscola = await window.buscarFotosEscola();
                    
                    if (fotosEscola && fotosEscola.length > 0) {
                        const faltam = this.MIN_NOTICIAS - noticiasOriginais.length;
                        const fotosNecessarias = Math.min(faltam, fotosEscola.length);
                        
                        const fotosComoNoticias = fotosEscola.slice(0, fotosNecessarias).map((foto, index) => ({
                            id: `fallback_${index + 1}`,
                            titulo: "📸 Conheça Nossa Escola",
                            conteudo: foto.DESCRICAO || "Venha conhecer as instalações da Escola Estadual Mariana Cavalcanti",
                            imagem: foto.LINK || "assets/img/Escola_Entrada.jpg",
                            data: foto.DATA || new Date().toISOString().split('T')[0],
                            legenda: foto.LEGENDA || "Foto da estrutura escolar",
                            isFallback: true
                        }));
                        
                        this.noticias = [...noticiasOriginais, ...fotosComoNoticias];
                        this.usouFallback = fotosNecessarias > 0;
                    } else {
                        this.noticias = noticiasOriginais;
                    }
                } else {
                    this.noticias = noticiasOriginais;
                }
            } else {
                this.noticias = noticiasOriginais;
            }
            
            console.log(`🎯 Total: ${this.noticias.length} itens no carrossel`);
            this.renderNews();
            
        } catch (error) {
            console.error('❌ Erro ao carregar notícias:', error);
            this.showError('Erro ao carregar notícias. Tente novamente mais tarde.');
        }
    }
    
    async loadFromJson() {
        try {
            const response = await fetch('assets/txt/news.json');
            if (response.ok) {
                const data = await response.json();
                if (data.noticias && Array.isArray(data.noticias)) {
                    console.log(`📄 ${data.noticias.length} notícias carregadas do JSON (fallback)`);
                    return data.noticias;
                }
            }
            return [];
        } catch (error) {
            console.error('❌ Erro ao carregar JSON de fallback:', error);
            return [];
        }
    }
    filtrarNoticiasRecentes(noticias) {
        const hoje = new Date();
        hoje.setHours(23, 59, 59, 999); 
        
        const dezDiasAtras = new Date();
        dezDiasAtras.setDate(hoje.getDate() - 10);
        dezDiasAtras.setHours(0, 0, 0, 0); 
        
        const noticiasFiltradas = noticias.filter(noticia => {
            if (!noticia.data) return false;
            
            try {
                let dataNoticia;
                if (noticia.data.includes('/')) {
                    const partes = noticia.data.split('/');
                    if (partes.length === 3) {
                        dataNoticia = new Date(partes[2], partes[1] - 1, partes[0]);
                    } else {
                        return false;
                    }
                } 
                else {
                    dataNoticia = new Date(noticia.data);
                }
                
                if (isNaN(dataNoticia.getTime())) return false;
                return dataNoticia >= dezDiasAtras && dataNoticia <= hoje;
                
            } catch (error) {
                return false;
            }
        });
        
        const removidas = noticias.length - noticiasFiltradas.length;
        if (removidas > 0) {
            console.log(`🗑️ ${removidas} notícias removidas (mais de 10 dias ou data futura)`);
        }
        console.log(`📅 ${noticiasFiltradas.length} notícias dentro do período de 10 dias`);
        
        return noticiasFiltradas;
    }

    renderNews() {
        if (!this.carousel) return;

        this.carousel.innerHTML = '';
        
        if (this.noticias.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        this.noticias.forEach((noticia, index) => {
            const slide = document.createElement('div');
            slide.className = `news-slide ${index === 0 ? 'active' : ''}`;
            
            let imagemUrl = noticia.imagem;
            
            if (imagemUrl && imagemUrl.includes('drive.google.com')) {
                if (typeof window.converterLinksDrive === 'function') {
                    const urlsConvertidas = window.converterLinksDrive(imagemUrl);
                    if (urlsConvertidas && urlsConvertidas.length > 0) {
                        imagemUrl = urlsConvertidas[0];
                    }
                } else {
                    const match = imagemUrl.match(/[-\w]{25,}/);
                    if (match) {
                        imagemUrl = `https://drive.google.com/uc?export=view&id=${match[0]}`;
                    }
                }
            }
            
            if (!imagemUrl || imagemUrl.trim() === '') {
                imagemUrl = 'assets/img/Escola_Entrada.jpg';
            }
            
            const dataFormatada = this.formatDate(noticia.data);
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
                        
                    ${!noticia.isFallback && noticia.link ? `
                        <a href="${noticia.link}" 
                        class="view-details-btn" 
                        style="margin-top: 15px;"
                        target="_blank" rel="noopener noreferrer">
                            Saiba mais <i class="fas fa-external-link-alt"></i>
                        </a>
                    ` : noticia.isFallback ? `
                        <a href="informacoes.html#estrutura" class="view-details-btn" style="margin-top: 15px;">
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

        if (this.usouFallback) {
            this.addFallbackNotice();
        }

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
                    <div class="news-image">
                        <img src="assets/img/Escola_Entrada.jpg" 
                             alt="Escola Mariana Cavalcanti" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Escola+Mariana+Cavalcanti'"
                             loading="lazy">
                    </div>
                </div>
            </div>
        `;
        
        this.updateIndicators(1);
        if (this.totalSlidesSpan) this.totalSlidesSpan.textContent = '1';
        if (this.currentSlideSpan) this.currentSlideSpan.textContent = '1';
    }

    addFallbackNotice() {
        const notice = document.createElement('div');
        notice.className = 'fallback-notice';
        notice.innerHTML = `
            <div class="fallback-notice-content">
                <i class="fas fa-info-circle"></i>
                <span>Complementamos com fotos da escola para melhor experiência</span>
            </div>
        `;
        
        const container = document.querySelector('.news-carousel-container');
        if (container && !document.querySelector('.fallback-notice')) {
            container.appendChild(notice);
            
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
        
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        this.isTransitioning = true;
        
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        slides[index].classList.add('active');
        
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
        this.updateCounter();
        
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

        document.addEventListener('keydown', (e) => {
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

        const container = document.querySelector('.news-carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (this.carousel) {
            this.carousel.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.carousel.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }
    }

    handleSwipe() {
        const slides = document.querySelectorAll('.news-slide');
        if (!slides.length) return;
        
        const swipeThreshold = 50;
        const diffX = this.touchEndX - this.touchStartX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
            this.resetAutoPlay();
        }
    }

    startAutoPlay() {
        const slides = document.querySelectorAll('.news-slide');
        if (slides.length <= 1) return;
        
        this.stopAutoPlay();
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
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
                    <div class="news-image">
                        <img src="assets/img/Escola_Entrada.jpg" 
                             alt="Escola Mariana Cavalcanti" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Erro'"
                             loading="lazy">
                    </div>
                </div>
            </div>
        `;
        
        this.updateIndicators(1);
        if (this.totalSlidesSpan) this.totalSlidesSpan.textContent = '1';
        if (this.currentSlideSpan) this.currentSlideSpan.textContent = '1';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.newsManager) {
        window.newsManager = new NewsManager();
        console.log('🚀 NewsManager inicializado com integração Google Sheets');
    }
});

