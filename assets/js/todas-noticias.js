// todas-noticias.js 
class TodasNoticiasManager {
    constructor() {
        this.noticias = [];
        this.container = document.getElementById('todasNoticiasContent');
        this.searchInput = document.getElementById('searchTodasNoticias');
        this.countBadge = document.getElementById('countTodasNoticias');
        this.countRecentes = document.getElementById('countRecentes');
        this.toggleBtn = document.getElementById('toggleTodasNoticias');
        this.limparBtn = document.getElementById('limparFiltrosTodas');
        
        this.modal = document.getElementById('noticiaModal');
        this.modalTrack = document.getElementById('modalCarouselTrack');
        this.modalCounter = document.getElementById('modalCounter');
        this.modalIndicators = document.getElementById('modalIndicators');
        this.modalPrevBtn = document.getElementById('modalPrev');
        this.modalNextBtn = document.getElementById('modalNext');
        this.modalCloseBtn = document.getElementById('modalClose');
        this.modalTitulo = document.getElementById('modalTitulo');
        this.modalData = document.getElementById('modalData');
        this.modalLegenda = document.getElementById('modalLegenda');
        this.modalConteudo = document.getElementById('modalConteudo');
        this.modalLink = document.getElementById('modalLink');
        
        this.currentSlide = 0;
        this.imagensAtuais = [];
        
        if (!this.container) return;
        this.init();
    }
    
    async init() {
        await this.loadNews();
        this.setupEventListeners();
        this.setupModalEvents();
    }
    
    async loadNews() {
        try {
            let noticias = [];
            
            if (typeof window.fetchData === 'function') {
                try {
                    const dadosPlanilha = await window.fetchData('NEWS', 'news');
                    if (dadosPlanilha && Array.isArray(dadosPlanilha)) {
                        noticias = dadosPlanilha
                            .filter(item => item.titulo && item.titulo.trim() !== '')
                            .map((item, index) => ({
                                id: index + 1,
                                titulo: item.titulo || 'Notícia sem título',
                                conteudo: item.conteudo || '',
                                imagem: item.imagem || '',
                                data: item.data || '',
                                legenda: item.legenda || '',
                                link: item.link || ''
                            }));
                    }
                } catch {
                    noticias = await this.loadFromJson();
                }
            } else {
                noticias = await this.loadFromJson();
            }
            
            this.noticias = noticias;
            this.renderNews();
        } catch (error) {
            console.error('❌ Erro:', error);
            this.renderEmptyState();
        }
    }
    
    async loadFromJson() {
        try {
            const response = await fetch('assets/txt/news.json');
            if (response.ok) {
                const data = await response.json();
                return data.noticias || [];
            }
        } catch (error) {
            console.error('❌ Erro JSON:', error);
        }
        return [];
    }
    
    getImagensUrl(imagemString) {
        if (!imagemString || imagemString.trim() === '') return [];
        
        if (typeof window.converterLinksDrive === 'function') {
            return window.converterLinksDrive(imagemString);
        }
        
        const urls = imagemString.split(',').map(u => u.trim()).filter(u => u);
        return urls.map(url => {
            const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match) return `https://lh3.googleusercontent.com/d/${match[1]}`;
            return url;
        });
    }
    
    renderNews(noticiasFiltradas = null) {
        if (!this.container) return;
        
        const noticias = noticiasFiltradas || this.noticias;
        this.container.innerHTML = '';
        
        if (noticias.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        noticias.forEach((noticia) => {
            const card = this.createCard(noticia);
            this.container.appendChild(card);
        });
        
        this.updateCounters(noticias);
    }
    
    createCard(noticia) {
        const card = document.createElement('article');
        card.className = 'noticia-card';
        
        const imagens = this.getImagensUrl(noticia.imagem);
        const imagemPrincipal = imagens.length > 0 ? imagens[0] : 'assets/img/Escola_Entrada.jpg';
        const dataFormatada = this.formatDate(noticia.data);
        const conteudoResumido = this.truncateText(noticia.conteudo, 120);
        
        card.innerHTML = `
            <div class="noticia-card-image">
                <img src="${imagemPrincipal}" 
                     alt="${this.escapeHtml(noticia.titulo)}" 
                     onerror="this.onerror=null; this.src='assets/img/Escola_Entrada.jpg';"
                     loading="lazy">
            </div>
            <div class="noticia-card-body">
                <h3>${this.escapeHtml(noticia.titulo)}</h3>
                <p class="noticia-card-text">${this.escapeHtml(conteudoResumido)}</p>
                <div class="noticia-card-meta">
                    ${dataFormatada ? `<span><i class="far fa-calendar-alt"></i> ${dataFormatada}</span>` : ''}
                    ${imagens.length > 1 ? `<span><i class="fas fa-images"></i> ${imagens.length} fotos</span>` : ''}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.openModal(noticia));
        return card;
    }
    
    openModal(noticia) {
        this.imagensAtuais = this.getImagensUrl(noticia.imagem);
        if (this.imagensAtuais.length === 0) {
            this.imagensAtuais.push('assets/img/Escola_Entrada.jpg');
        }
        
        this.currentSlide = 0;
        const dataFormatada = this.formatDate(noticia.data);

        this.modalTrack.innerHTML = this.imagensAtuais.map((img, i) => `
            <div class="modal-carousel-slide">
                <img src="${img}" 
                     alt="Foto ${i + 1}" 
                     onerror="this.onerror=null; this.src='assets/img/Escola_Entrada.jpg';">
            </div>
        `).join('');

        this.modalTrack.style.transform = 'translateX(0)';

        this.modalIndicators.innerHTML = this.imagensAtuais.map((_, i) => `
            <div class="modal-carousel-indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
        `).join('');

        this.modalIndicators.querySelectorAll('.modal-carousel-indicator').forEach(ind => {
            ind.addEventListener('click', () => {
                this.goToSlide(parseInt(ind.dataset.index));
            });
        });

        this.modalCounter.textContent = `1 / ${this.imagensAtuais.length}`;

        const temMultiplas = this.imagensAtuais.length > 1;
        this.modalPrevBtn.style.display = temMultiplas ? 'flex' : 'none';
        this.modalNextBtn.style.display = temMultiplas ? 'flex' : 'none';
        this.modalCounter.style.display = temMultiplas ? 'block' : 'none';
        this.modalIndicators.style.display = temMultiplas ? 'flex' : 'none';

        this.modalTitulo.textContent = noticia.titulo;
        this.modalData.innerHTML = `<i class="far fa-calendar-alt"></i> ${dataFormatada || 'Data não informada'}`;
        
        if (noticia.legenda) {
            this.modalLegenda.innerHTML = `<i class="fas fa-camera"></i> ${this.escapeHtml(noticia.legenda)}`;
            this.modalLegenda.style.display = 'flex';
        } else {
            this.modalLegenda.style.display = 'none';
        }
        
        this.modalConteudo.textContent = noticia.conteudo || 'Conteúdo não disponível.';
        
        if (noticia.link) {
            this.modalLink.href = noticia.link;
            this.modalLink.style.display = 'inline-flex';
        } else {
            this.modalLink.style.display = 'none';
        }

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    goToSlide(index) {
        if (index < 0) index = this.imagensAtuais.length - 1;
        if (index >= this.imagensAtuais.length) index = 0;
        
        this.currentSlide = index;
        this.modalTrack.style.transform = `translateX(-${index * 100}%)`;
        this.modalCounter.textContent = `${index + 1} / ${this.imagensAtuais.length}`;

        const indicators = this.modalIndicators.querySelectorAll('.modal-carousel-indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    setupModalEvents() {
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        this.modalPrevBtn.addEventListener('click', () => this.prevSlide());
        this.modalNextBtn.addEventListener('click', () => this.nextSlide());

        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                this.closeModal();
            } else if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    renderEmptyState() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="noticias-empty">
                <i class="fas fa-newspaper"></i>
                <h3>Nenhuma notícia encontrada</h3>
                <p>Em breve teremos novidades!</p>
            </div>
        `;
        this.updateCounters([]);
    }
    
    updateCounters(noticias) {
        if (this.countBadge) this.countBadge.textContent = noticias.length;
        
        if (this.countRecentes) {
            const duasSemanas = new Date();
            duasSemanas.setDate(duasSemanas.getDate() - 14);
            const recentes = noticias.filter(n => {
                try { return new Date(n.data) >= duasSemanas; } catch { return false; }
            });
            this.countRecentes.textContent = recentes.length;
        }
    }
    
    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterNews());
        }
        
        if (this.limparBtn) {
            this.limparBtn.addEventListener('click', () => {
                if (this.searchInput) this.searchInput.value = '';
                this.renderNews();
            });
        }
        
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                const content = document.getElementById('todasNoticiasContent');
                const icon = this.toggleBtn.querySelector('i');
                const span = this.toggleBtn.querySelector('span');
                if (!content) return;
                
                const isVisible = content.style.display !== 'none';
                content.style.display = isVisible ? 'none' : 'grid';
                icon.className = isVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
                span.textContent = isVisible ? 'Mostrar' : 'Ocultar';
                this.toggleBtn.setAttribute('aria-expanded', !isVisible);
            });
        }
    }
    
    filterNews() {
        const termo = this.searchInput?.value?.toLowerCase().trim() || '';
        if (!termo) {
            this.renderNews();
            return;
        }
        
        const filtradas = this.noticias.filter(n => 
            n.titulo?.toLowerCase().includes(termo) ||
            n.conteudo?.toLowerCase().includes(termo) ||
            n.legenda?.toLowerCase().includes(termo)
        );
        this.renderNews(filtradas);
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            if (dateString.includes('/')) return dateString;
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString('pt-BR');
        } catch { return dateString; }
    }
    
    truncateText(text, max = 120) {
        if (!text) return '';
        return text.length <= max ? text : text.substring(0, max).trim() + '...';
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.todasNoticiasManager) {
        window.todasNoticiasManager = new TodasNoticiasManager();
    }
});