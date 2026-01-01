// Menu Mobile Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fecha menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
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
/* =============================
   CARROSSEL DE EVENTOS MODERNO
 ============================= */
document.addEventListener("DOMContentLoaded", async () => {
    const wrapper = document.getElementById("bannerWrapper");
    const indicators = document.getElementById("bannerIndicators");
    const currentSlideSpan = document.getElementById("currentSlide");
    const totalSlidesSpan = document.getElementById("totalSlides");
    
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
    
    if (eventos.length === 0) {
        wrapper.innerHTML = `
            <div class="carousel-loading">
                <i class="far fa-calendar-times"></i>
                <span>Nenhum evento programado para este mês</span>
            </div>
        `;
        return;
    }
    
    // Limitar a 5 eventos para não sobrecarregar
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
        
        // Atualizar contador
        totalSlidesSpan.textContent = eventos.length;
        atualizarContador();
    }
    
    function mudarSlide(novoIndex) {
        const slides = document.querySelectorAll(".carousel-slide");
        const dots = document.querySelectorAll(".indicator");
        
        slides[current].classList.remove("active");
        dots[current].classList.remove("active");
        
        current = novoIndex;
        
        slides[current].classList.add("active");
        dots[current].classList.add("active");
        
        atualizarContador();
    }
    
    function proximoSlide() {
        mudarSlide((current + 1) % eventos.length);
    }
    
    function slideAnterior() {
        mudarSlide((current - 1 + eventos.length) % eventos.length);
    }
    
    function atualizarContador() {
        currentSlideSpan.textContent = current + 1;
    }
    
    // Auto-play
    function iniciarAutoPlay() {
        timer = setInterval(proximoSlide, 6000); // 6 segundos
    }
    
    function pararAutoPlay() {
        clearInterval(timer);
    }
    
    // Event listeners
    document.getElementById("bannerNext").onclick = proximoSlide;
    document.getElementById("bannerPrev").onclick = slideAnterior;
    
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
    
    // Função placeholder para abrir modal
// Função para abrir modal com detalhes do evento
window.abrirModalEvento = async function(eventId) {
    console.log("Abrindo modal para evento ID:", eventId);
    
    // Abrir o modal imediatamente
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalContent');
    
    // Mostrar loading
    modalContent.innerHTML = `
        <div class="modal-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando detalhes do evento...</p>
        </div>
    `;
    
    modal.classList.add('active');
    
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
function fecharModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.remove('active');
}

// Adicione este código para configurar os eventos de fechar o modal
document.addEventListener('DOMContentLoaded', function() {
    // Criar modal dinamicamente se não existir
    if (!document.getElementById('eventModal')) {
        const modalHTML = `
            <div class="modal-overlay" id="eventModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2><i class="fas fa-calendar-alt"></i> Detalhes do Evento</h2>
                        <button class="modal-close" id="modalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-content" id="modalContent"></div>
                    <div class="modal-footer">
                        <button class="modal-btn secondary" id="modalCloseBtn">
                            <i class="fas fa-times"></i> Fechar
                        </button>
                        <button class="modal-btn primary" id="modalShareBtn">
                            <i class="fas fa-share-alt"></i> Compartilhar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Event listeners para fechar modal
    document.getElementById('modalClose')?.addEventListener('click', fecharModal);
    document.getElementById('modalCloseBtn')?.addEventListener('click', fecharModal);
    document.getElementById('modalShareBtn')?.addEventListener('click', function() {
        alert('Compartilhando evento...');
        // Aqui você pode adicionar funcionalidade de compartilhamento
    });
    
    // Fechar modal ao clicar fora
    document.getElementById('eventModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
    
    // Adicionar estilos para status
    const style = document.createElement('style');
    style.textContent = `
        .event-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .event-status.confirmado,
        .event-status.realizado {
            background: #d4edda;
            color: #155724;
        }
        .event-status.pendente,
        .event-status.agendado {
            background: #fff3cd;
            color: #856404;
        }
        .event-status.cancelado {
            background: #f8d7da;
            color: #721c24;
        }
    `;
    document.head.appendChild(style);
});
});

