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

    // Dropdown para mobile - COM FECHAR OUTROS DROPDOWNS
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = toggle.parentElement;
                const estavaAberto = dropdown.classList.contains('open');
                
                // Fecha TODOS os dropdowns primeiro
                dropdownToggles.forEach(otherToggle => {
                    otherToggle.parentElement.classList.remove('open');
                });
                
                // Se não estava aberto, abre apenas este
                if (!estavaAberto) {
                    dropdown.classList.add('open');
                }
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
    if (!wrapper || !indicators) return;

    wrapper.innerHTML = `
        <div class="carousel-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Carregando eventos...</span>
        </div>
    `;
    
    let todosEventos = await fetchData("EVENTOS", "EVENTOS");
    
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    let eventos = todosEventos.filter(e => {
        if (!e.INICIO) return false;
        const d = new Date(e.INICIO);
        return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual;
    });

    let mostrandoHistorico = false;
    
    if (eventos.length === 0) {
        const eventosOrdenados = todosEventos
            .filter(e => e.INICIO)
            .sort((a, b) => {
                const dataA = new Date(a.INICIO);
                const dataB = new Date(b.INICIO);
                return dataB - dataA;
            });

        eventos = eventosOrdenados.slice(0, 5);
        mostrandoHistorico = true;
        if (eventos.length === 0) {
            const container = document.querySelector(".carousel-container");
            if (container) {
                container.classList.add("hidden");
            }
            wrapper.innerHTML = `
                <div class="carousel-loading">
                    <i class="fas fa-calendar-times"></i>
                    <span>Nenhum evento disponível no momento.</span>
                </div>
            `;
            return;
        }
        
        console.log(`Nenhum evento este mês. Mostrando os ${eventos.length} últimos eventos.`);
    } else {
        eventos = eventos.slice(0, 5);
    }
    
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
                        <div >
                            <a href="eventos.html" class="view-details-btn" >
                            <i class="fas fa-images"></i> Ver todos os eventos
                            </a>
                        </div>
                    </div>
                </div>
                <div class="slide-content">
                    ${mostrandoHistorico ? '<span class="evento-historico-badge">📌 Eventos Anteriores</span>' : ''}
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
                </div>
            `;
            
            wrapper.appendChild(slide);
            const indicator = document.createElement("div");
            indicator.className = "indicator" + (i === 0 ? " active" : "");
            indicator.onclick = () => mudarSlide(i);
            indicators.appendChild(indicator);
        });
    }
    
    function mudarSlide(novoIndex) {
        const slides = document.querySelectorAll(".carousel-slide");
        const dots = document.querySelectorAll(".indicator");
        
        if (slides.length === 0 || dots.length === 0) return;
        
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
    function iniciarAutoPlay() {
        timer = setInterval(proximoSlide, 6000);
    }
    
    function pararAutoPlay() {
        clearInterval(timer);
    }
    const bannerNext = document.getElementById("bannerNext");
    const bannerPrev = document.getElementById("bannerPrev");
    
    if (bannerNext) bannerNext.onclick = proximoSlide;
    if (bannerPrev) bannerPrev.onclick = slideAnterior;

    wrapper.addEventListener("mouseenter", pararAutoPlay);
    wrapper.addEventListener("mouseleave", iniciarAutoPlay);

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") slideAnterior();
        if (e.key === "ArrowRight") proximoSlide();
    });
    criarSlides();
    iniciarAutoPlay();
    
    console.log(`Carrossel iniciado com ${eventos.length} slides${mostrandoHistorico ? ' (eventos anteriores)' : ''}`);
});

window.abrirModalEvento = async function(eventId) {
    console.log("Abrindo modal para evento ID:", eventId);
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalContent');

    if (!modal || !modalContent) {
        console.error("Modal não encontrado no DOM");
        return;
    }

    modalContent.innerHTML = `
        <div class="modal-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando detalhes do evento...</p>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 

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
        

        const fotos = converterLinksDrive(evento.FOTOS || '');
        const primeiraFoto = fotos[0] || '';
        

        const dataInicio = formatarData(evento.INICIO);
        const dataFim = evento.FIM ? formatarData(evento.FIM) : '';

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

window.trocarImagemPrincipal = function(src, index) {
    const mainImage = document.getElementById('mainEventImage');
    if (mainImage) {
        mainImage.src = src;
    }
    document.querySelectorAll('.modal-gallery-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
};
window.fecharModal = function() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
};
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModal();
    }
});
document.addEventListener('click', function(e) {
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalContent && modal.classList.contains('active')) {
        if (!modalContent.contains(e.target) && e.target !== modal) {
            fecharModal();
        }
    }
});
// ===========================
// TIRINHA DE COMUNICADOS 
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const tirinhaSection = document.querySelector('.comunicados-tirinha');
    const tirinhaScroll = document.querySelector('.tirinha-scroll');
    
    if (!tirinhaSection || !tirinhaScroll) return;
    
    let todosComunicados = [];
    async function initTirinha() {
        tirinhaSection.style.display = 'none';
        await carregarComunicadosTirinha();
    }
    async function carregarComunicadosTirinha() {
        try {
            todosComunicados = await fetchData('COMUNICADOS', 'COMUNICADOS');
            console.log('Comunicados carregados para tirinha:', todosComunicados);
            
            if (todosComunicados.length === 0) {
                return;
            }
            
            exibirComunicadosTirinha(todosComunicados);
        } catch (error) {
            console.error('Erro ao carregar comunicados:', error);
        }
    }
    function exibirComunicadosTirinha(comunicados) {
        const hoje = new Date();
        const comunicadosAtivos = comunicados.filter(comunicado => {
            if (!comunicado.VALIDADE || comunicado.VALIDADE.trim() === '') {
                return true;
            }
            
            const validade = converterData(comunicado.VALIDADE);
            return !validade || validade >= hoje;
        });
        
        if (comunicadosAtivos.length === 0) {
            return;
        }

        const comunicadosOrdenados = ordenarParaTirinha(comunicadosAtivos);
        const comunicadosExibicao = comunicadosOrdenados.slice(0, 5);

        tirinhaScroll.innerHTML = '';
        
        comunicadosExibicao.forEach(comunicado => {
            const item = criarItemTirinha(comunicado);
            tirinhaScroll.appendChild(item);
        });
        tirinhaSection.style.display = 'block';

        iniciarRolagemAutomatica();
    }

    function ordenarParaTirinha(comunicados) {
        return [...comunicados].sort((a, b) => {
            if (a.URGENTE === 'SIM' && b.URGENTE !== 'SIM') return -1;
            if (a.URGENTE !== 'SIM' && b.URGENTE === 'SIM') return 1;

            const dataA = converterData(a.DATA) || new Date(0);
            const dataB = converterData(b.DATA) || new Date(0);
            return dataB - dataA;
        });
    }
    function criarItemTirinha(comunicado) {
        const item = document.createElement('div');
        item.className = 'tirinha-item';
        if (comunicado.URGENTE === 'SIM') {
            item.classList.add('destaque');
        }
        const icone = escolherIcone(comunicado);
        const titulo = comunicado.TITULO || 'Comunicado';
        let textoExibicao = titulo;
        if (textoExibicao.length > 30) {
            textoExibicao = textoExibicao.substring(0, 27) + '...';
        }
        const dataFormatada = formatarDataCurta(comunicado.DATA);
        if (dataFormatada) {
            textoExibicao += ` - ${dataFormatada}`;
        }
        
        item.innerHTML = `
            <i class="fas ${icone}"></i>
            <span>${textoExibicao}</span>
        `;

        item.title = `${titulo}\n${comunicado.MENSAGEM || ''}`.substring(0, 100) + '...';
        
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.location.href = 'comunicados.html';
        });
        
        return item;
    }
    function escolherIcone(comunicado) {
        const titulo = (comunicado.TITULO || '').toLowerCase();
        const destinatario = (comunicado.DESTINATARIO || '').toLowerCase();
        
        if (comunicado.URGENTE === 'SIM') {
            return 'fa-exclamation-circle';
        } else if (destinatario.includes('pais') || destinatario.includes('responsáveis')) {
            return 'fa-users';
        } else if (destinatario.includes('aluno')) {
            return 'fa-graduation-cap';
        } else if (titulo.includes('reunião')) {
            return 'fa-calendar-check';
        } else if (titulo.includes('prova') || titulo.includes('avaliação')) {
            return 'fa-pencil-alt';
        } else if (titulo.includes('evento')) {
            return 'fa-calendar-alt';
        } else if (titulo.includes('feriado')) {
            return 'fa-umbrella-beach';
        } else {
            return 'fa-bullhorn';
        }
    }
    function formatarDataCurta(dataString) {
        if (!dataString || dataString.trim() === '') return null;
        
        const data = converterData(dataString);
        if (!data) return null;
        
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        
        return `${dia}/${mes}`;
    }
    function converterData(dataString) {
        if (!dataString || dataString.trim() === '') return null;
        
        dataString = dataString.trim();

        if (dataString.includes('/')) {
            const partes = dataString.split('/');
            if (partes.length === 3) {
                const dia = parseInt(partes[0].trim(), 10);
                const mes = parseInt(partes[1].trim(), 10) - 1;
                let ano = parseInt(partes[2].trim(), 10);
                
                if (ano < 100) {
                    ano += 2000;
                }
                
                return new Date(ano, mes, dia);
            }
        }

        if (dataString.includes('T')) {
            return new Date(dataString);
        }

        if (dataString.includes('-')) {
            const partes = dataString.split('-');
            if (partes.length === 3) {
                const ano = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10) - 1;
                const dia = parseInt(partes[2], 10);
                return new Date(ano, mes, dia);
            }
        }
        
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? null : data;
    }
    function iniciarRolagemAutomatica() {
        let scrollAmount = 0;
        const scrollStep = 1;
        const scrollInterval = 40;
        let isPaused = false;

        tirinhaScroll.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        tirinhaScroll.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        const intervalId = setInterval(() => {
            if (!isPaused && tirinhaScroll && tirinhaScroll.scrollWidth > tirinhaScroll.clientWidth) {
                scrollAmount += scrollStep;

                if (scrollAmount >= tirinhaScroll.scrollWidth - tirinhaScroll.clientWidth) {
                    scrollAmount = 0;
                }
                
                tirinhaScroll.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, scrollInterval);

        window.addEventListener('beforeunload', () => {
            clearInterval(intervalId);
        });
    }

    function iniciarAtualizacaoPeriodica() {
        setInterval(async () => {
            try {
                const novosComunicados = await fetchData('COMUNICADOS', 'COMUNICADOS');
                if (JSON.stringify(novosComunicados) !== JSON.stringify(todosComunicados)) {
                    todosComunicados = novosComunicados;
                    
                    if (todosComunicados.length === 0) {
                        tirinhaSection.style.display = 'none';
                    } else {
                        exibirComunicadosTirinha(todosComunicados);
                    }
                }
            } catch (error) {
                console.error('Erro ao atualizar comunicados:', error);
            }
        }, 300000); 
    }
    initTirinha();
    iniciarAtualizacaoPeriodica();
});