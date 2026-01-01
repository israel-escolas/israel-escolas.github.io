// Menu Mobile Toggle com overlay
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.createElement('div');
menuOverlay.className = 'menu-overlay';
document.body.appendChild(menuOverlay);

// Dropdown toggles
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

if (hamburger && navMenu) {
    // Abrir/fechar menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar no overlay
    menuOverlay.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Fechar todos os dropdowns
        dropdownToggles.forEach(toggle => {
            toggle.parentElement.classList.remove('open');
        });
    });

    // Dropdown para mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = toggle.parentElement;
                dropdown.classList.toggle('open');
            }
        });
    });

    // Fechar dropdowns ao clicar fora (apenas desktop)
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) {
            dropdownToggles.forEach(toggle => {
                const dropdown = toggle.parentElement;
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });
        }
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && !link.classList.contains('dropdown-toggle')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Destacar link ativo
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

/* =============================
   OPÇÃO PRIMEIRO SLIDE
 ============================= */
document.addEventListener('DOMContentLoaded', async () => {
    const slider = document.getElementById("eventosSlider");
    const indicators = document.getElementById("sliderIndicators");

    // Verifica se os elementos existem
    if (!slider || !indicators) return;

    let slideIndex = 0;
    let slides = [];
    let timer;

    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();

    const eventos = await fetchData("EVENTOS", "EVENTOS");

    // Filtra apenas eventos do mês atual
    const eventosDoMes = eventos.filter(e => {
        if (!e.INICIO) return false;
        const d = new Date(e.INICIO);
        return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual;
    });

    if (eventosDoMes.length === 0) {
        slider.innerHTML = "<p class='slider-loading'>Nenhum evento este mês.</p>";
        return;
    }

    slider.innerHTML = "";

    eventosDoMes.forEach((evento, i) => {
        const fotos = converterLinksDrive(evento.FOTOS || '');
        const img = fotos[0] || "https://via.placeholder.com/800x400?text=Sem+Imagem";

        const slide = document.createElement("div");
        slide.className = "slider-slide";
        slide.style.backgroundImage = `url('${img}')`;

        slide.innerHTML = `
            <div class="slide-info">
                <h3>${evento.EVENTO}</h3>
                <p><i class="far fa-calendar"></i> ${formatarData(evento.INICIO)}</p>
            </div>
        `;

        slider.appendChild(slide);

        // Bolinha
        const dot = document.createElement("div");
        dot.className = "slider-dot";
        dot.onclick = () => showSlide(i);
        indicators.appendChild(dot);
    });

    slides = document.querySelectorAll(".slider-slide");
    const dots = document.querySelectorAll(".slider-dot");

    function showSlide(index) {
        slideIndex = index;

        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        slides[index].classList.add("active");
        dots[index].classList.add("active");

        resetTimer();
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(nextSlide, 5000);
    }

    // Inicia slider
    showSlide(0);
    resetTimer();
});

/* =============================
   OPÇÃO SEGUNDO SLIDE
 ============================= */
document.addEventListener("DOMContentLoaded", async () => {
    const wrapper = document.getElementById("bannerWrapper");
    const indicators = document.getElementById("bannerIndicators");

    // 🔴 SE NÃO EXISTIR, PARA AQUI
    if (!wrapper || !indicators) return;

    // Mostrar loading
    wrapper.innerHTML = `
        <div class="carousel-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Carregando eventos...</span>
        </div>
    `;
    
    let eventos = await fetchData("EVENTOS", "EVENTOS");
    
    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();
    
    // Filtrar eventos do mês atual
    eventos = eventos.filter(e => {
        if (!e.INICIO) return false;
        const d = new Date(e.INICIO);
        return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual;
    });
    
    // *** ALTERAÇÃO: Se não tiver eventos, buscar fotos ***
    if (eventos.length === 0) {
        console.log("Nenhum evento encontrado, buscando fotos da escola...");
        
        // Busca fotos da escola
        const fotosEscola = await buscarFotosEscola();
        
        if (fotosEscola.length > 0) {
            console.log(`✅ Encontradas ${fotosEscola.length} fotos da escola`);
            
            // Usar as fotos no lugar dos eventos
            eventos = fotosEscola.map(foto => ({
                EVENTO: "Nossa Escola",
                INICIO: foto.DATA || new Date().toISOString(),
                FOTOS: foto.LINK,
                DESCRICAO: "Conheça as instalações da Escola Mariana Cavalcanti",
                LOCAL: "Luís Gomes - RN"
            }));
            
        } else {
            // Se não tiver nem eventos nem fotos
            wrapper.innerHTML = `
                <div class="carousel-loading">
                    <i class="far fa-calendar-times"></i>
                    <span>Nenhum evento este mês</span>
                </div>
            `;
            return;
        }
    }
    
    // Limitar a 5 eventos/fotos para não sobrecarregar
    eventos = eventos.slice(0, 5);
    
    let current = 0;
    let timer;
    
    function criarSlides() {
        wrapper.innerHTML = "";
        indicators.innerHTML = "";
        
        eventos.forEach((ev, i) => {
            const fotos = converterLinksDrive(ev.FOTOS || "");
            const img = fotos[0] || "assets/img/default-event.jpg";
            
            const slide = document.createElement("div");
            slide.className = "carousel-slide";
            if (i === 0) slide.classList.add("active");
            
            slide.innerHTML = `
                <div class="slide-image">
                    <img src="${img}" alt="${ev.EVENTO}">
                    <div class="overlay">
                        <div class="image-caption">
                            <i class="fas fa-camera"></i> ${ev.LOCAL || 'Local a definir'}
                        </div>
                    </div>
                </div>
                <div class="slide-content">
                    <div class="event-date">
                        <i class="far fa-calendar"></i>
                        ${formatarData(ev.INICIO)}
                    </div>
                    <h3>${ev.EVENTO}</h3>
                    <p>${ev.DESCRICAO || 'Uma atividade especial da nossa escola.'}</p>
                    
                    <ul class="event-details">
                        ${ev.HORARIO ? `<li><i class="far fa-clock"></i> ${ev.HORARIO}</li>` : ''}
                        ${ev.LOCAL ? `<li><i class="fas fa-map-marker-alt"></i> ${ev.LOCAL}</li>` : ''}
                        ${ev.RESPONSAVEL ? `<li><i class="fas fa-user-tie"></i> ${ev.RESPONSAVEL}</li>` : ''}
                    </ul>
                    
                    <a href="eventos.html" class="view-details-btn" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none;">
                        <i class="fas fa-images"></i> Ver todos os eventos
                    </a>
                </div>
            `;
            
            wrapper.appendChild(slide);
            
            // Criar indicador
            const indicator = document.createElement("div");
            indicator.className = "indicator" + (i === 0 ? " active" : "");
            indicator.onclick = () => mudarSlide(i);
            indicators.appendChild(indicator);
        });
    }
    
    function mudarSlide(novoIndex) {
        const slides = document.querySelectorAll(".carousel-slide");
        const dots = document.querySelectorAll(".indicator");
        
        slides[current].classList.remove("active");
        dots[current].classList.remove("active");
        
        current = novoIndex;
        
        slides[current].classList.add("active");
        dots[current].classList.add("active");
    }
    
    function proximoSlide() {
        mudarSlide((current + 1) % eventos.length);
    }
    
    function slideAnterior() {
        mudarSlide((current - 1 + eventos.length) % eventos.length);
    }
    
    // Auto-play
    function iniciarAutoPlay() {
        timer = setInterval(proximoSlide, 6000);
    }
    
    function pararAutoPlay() {
        clearInterval(timer);
    }
    
    // Event listeners
    const bannerNext = document.getElementById("bannerNext");
    const bannerPrev = document.getElementById("bannerPrev");
    
    if (bannerNext) bannerNext.onclick = proximoSlide;
    if (bannerPrev) bannerPrev.onclick = slideAnterior;
    
    // Pausar no hover
    wrapper.addEventListener("mouseenter", pararAutoPlay);
    wrapper.addEventListener("mouseleave", iniciarAutoPlay);
    
    // Teclado
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") slideAnterior();
        if (e.key === "ArrowRight") proximoSlide();
    });
    
    // Inicializar
    criarSlides();
    iniciarAutoPlay();
    
    console.log(`Carrossel iniciado com ${eventos.length} slides`);
});

// Função para abrir modal com detalhes do evento
window.abrirModalEvento = async function(eventId) {
    console.log("Abrindo modal para evento ID:", eventId);
    
    // Abrir o modal imediatamente
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalContent');
    
    // Verificar se o modal existe
    if (!modal || !modalContent) {
        console.error("Modal não encontrado no DOM");
        return;
    }
    
    // Mostrar loading
    modalContent.innerHTML = `
        <div class="modal-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando detalhes do evento...</p>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
    
    // Buscar dados do evento
    try {
        const eventos = await fetchData("EVENTOS", "EVENTOS");
        const evento = eventos.find(e => e.ID == eventId || e.EVENTO_ID == eventId);
        
        if (!evento) {
            modalContent.innerHTML = `
                <div class="modal-loading">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Evento não encontrado.</p>
                </div>
            `;
            return;
        }
        
        // Converter fotos
        const fotos = converterLinksDrive(evento.FOTOS || '');
        const primeiraFoto = fotos[0] || '';
        
        // Formatar datas
        const dataInicio = formatarData(evento.INICIO);
        const dataFim = evento.FIM ? formatarData(evento.FIM) : '';
        
        // Criar HTML do modal
        modalContent.innerHTML = `
            ${fotos.length > 0 ? `
                <div class="modal-main-image">
                    <img src="${primeiraFoto}" alt="${evento.EVENTO}" id="mainEventImage">
                </div>
            ` : ''}
            
            ${fotos.length > 1 ? `
                <div class="modal-gallery" id="eventGallery">
                    ${fotos.map((foto, index) => `
                        <div class="modal-gallery-item ${index === 0 ? 'active' : ''}" 
                             data-index="${index}" 
                             onclick="trocarImagemPrincipal('${foto}', ${index})">
                            <img src="${foto}" alt="Foto ${index + 1} do evento">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="modal-info">
                <h2 class="modal-title">${evento.EVENTO}</h2>
                
                <div class="modal-meta">
                    <div class="meta-item">
                        <i class="far fa-calendar"></i>
                        <span>${dataInicio}${dataFim ? ` a ${dataFim}` : ''}</span>
                    </div>
                    
                    ${evento.HORARIO ? `
                    <div class="meta-item">
                        <i class="far fa-clock"></i>
                        <span>${evento.HORARIO}</span>
                    </div>
                    ` : ''}
                    
                    ${evento.LOCAL ? `
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${evento.LOCAL}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${evento.DESCRICAO ? `
                <div class="modal-description">
                    <h3><i class="fas fa-info-circle"></i> Descrição</h3>
                    <p>${evento.DESCRICAO.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}
                
                <div class="modal-details">
                    ${evento.RESPONSAVEL ? `
                    <div class="detail-row">
                        <div class="detail-label">
                            <i class="fas fa-user-tie"></i> Responsável:
                        </div>
                        <div class="detail-value">${evento.RESPONSAVEL}</div>
                    </div>
                    ` : ''}
                    
                    ${evento.PUBLICO_ALVO ? `
                    <div class="detail-row">
                        <div class="detail-label">
                            <i class="fas fa-users"></i> Público-Alvo:
                        </div>
                        <div class="detail-value">${evento.PUBLICO_ALVO}</div>
                    </div>
                    ` : ''}
                    
                    ${evento.TIPO ? `
                    <div class="detail-row">
                        <div class="detail-label">
                            <i class="fas fa-tag"></i> Tipo:
                        </div>
                        <div class="detail-value">${evento.TIPO}</div>
                    </div>
                    ` : ''}
                    
                    ${evento.STATUS ? `
                    <div class="detail-row">
                        <div class="detail-label">
                            <i class="fas fa-check-circle"></i> Status:
                        </div>
                        <div class="detail-value">
                            <span class="event-status ${evento.STATUS.toLowerCase()}">
                                ${evento.STATUS}
                            </span>
                        </div>
                    </div>
                    ` : ''}
                    
                    ${evento.OBSERVACOES ? `
                    <div class="detail-row">
                        <div class="detail-label">
                            <i class="fas fa-sticky-note"></i> Observações:
                        </div>
                        <div class="detail-value">${evento.OBSERVACOES}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Erro ao carregar evento:', error);
        modalContent.innerHTML = `
            <div class="modal-loading">
                <i class="fas fa-exclamation-circle"></i>
                <p>Erro ao carregar detalhes do evento.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">${error.message}</p>
            </div>
        `;
    }
};

// Função para trocar imagem principal na galeria
window.trocarImagemPrincipal = function(src, index) {
    const mainImage = document.getElementById('mainEventImage');
    if (mainImage) {
        mainImage.src = src;
    }
    
    // Atualizar galeria ativa
    document.querySelectorAll('.modal-gallery-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
};

// Função para fechar modal
window.fecharModal = function() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
};

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModal();
    }
});

// Fechar modal ao clicar fora do conteúdo
document.addEventListener('click', function(e) {
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalContent && modal.classList.contains('active')) {
        if (!modalContent.contains(e.target) && e.target !== modal) {
            fecharModal();
        }
    }
});