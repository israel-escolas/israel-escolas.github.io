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
        const container = document.querySelector(".carousel-container");
        if (container) {
            container.classList.add("hidden");
        }
        return;
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
                        <div >
                            <a href="eventos.html" class="view-details-btn" >
                            <i class="fas fa-images"></i> Ver todos os eventos
                            </a>
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
// ===========================
// TIRINHA DE COMUNICADOS - INTEGRAÇÃO COM API
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da tirinha
    const tirinhaSection = document.querySelector('.comunicados-tirinha');
    const tirinhaScroll = document.querySelector('.tirinha-scroll');
    
    if (!tirinhaSection || !tirinhaScroll) return;
    
    let todosComunicados = [];
    
    // Inicialização
    async function initTirinha() {
        // Garante que começa escondida
        tirinhaSection.style.display = 'none';
        await carregarComunicadosTirinha();
    }
    
    // Carrega comunicados da planilha
    async function carregarComunicadosTirinha() {
        try {
            // Usa a mesma função fetchData do api.js
            todosComunicados = await fetchData('COMUNICADOS', 'COMUNICADOS');
            console.log('Comunicados carregados para tirinha:', todosComunicados);
            
            if (todosComunicados.length === 0) {
                return; // Já está escondida
            }
            
            exibirComunicadosTirinha(todosComunicados);
        } catch (error) {
            console.error('Erro ao carregar comunicados:', error);
            // Mantém escondida em caso de erro
        }
    }
    
    // Exibe comunicados na tirinha
    function exibirComunicadosTirinha(comunicados) {
        // Filtra apenas comunicados ativos (não expirados)
        const hoje = new Date();
        const comunicadosAtivos = comunicados.filter(comunicado => {
            // Se não tem validade, considera ativo
            if (!comunicado.VALIDADE || comunicado.VALIDADE.trim() === '') {
                return true;
            }
            
            const validade = converterData(comunicado.VALIDADE);
            return !validade || validade >= hoje;
        });
        
        // Se não há comunicados ativos, mantém escondida
        if (comunicadosAtivos.length === 0) {
            return;
        }
        
        // Ordena comunicados: urgentes primeiro, depois por data (mais recentes)
        const comunicadosOrdenados = ordenarParaTirinha(comunicadosAtivos);
        
        // Pega os primeiros 5 comunicados para não sobrecarregar a tirinha
        const comunicadosExibicao = comunicadosOrdenados.slice(0, 5);
        
        // Limpa e preenche a tirinha
        tirinhaScroll.innerHTML = '';
        
        comunicadosExibicao.forEach(comunicado => {
            const item = criarItemTirinha(comunicado);
            tirinhaScroll.appendChild(item);
        });
        
        // SÓ AGORA mostra a seção
        tirinhaSection.style.display = 'block';
        
        // Inicia rolagem automática
        iniciarRolagemAutomatica();
    }
    
    // Ordena comunicados para a tirinha
    function ordenarParaTirinha(comunicados) {
        return [...comunicados].sort((a, b) => {
            // 1º critério: Urgentes primeiro
            if (a.URGENTE === 'SIM' && b.URGENTE !== 'SIM') return -1;
            if (a.URGENTE !== 'SIM' && b.URGENTE === 'SIM') return 1;
            
            // 2º critério: Data mais recente primeiro
            const dataA = converterData(a.DATA) || new Date(0);
            const dataB = converterData(b.DATA) || new Date(0);
            return dataB - dataA;
        });
    }
    
    // Cria um item da tirinha
    function criarItemTirinha(comunicado) {
        const item = document.createElement('div');
        item.className = 'tirinha-item';
        
        // Adiciona classe de destaque se for urgente
        if (comunicado.URGENTE === 'SIM') {
            item.classList.add('destaque');
        }
        
        // Escolhe ícone baseado no tipo/destinatário
        const icone = escolherIcone(comunicado);
        
        // Formata o texto do comunicado
        const titulo = comunicado.TITULO || 'Comunicado';
        let textoExibicao = titulo;
        
        // Se o título for muito longo, trunca
        if (textoExibicao.length > 30) {
            textoExibicao = textoExibicao.substring(0, 27) + '...';
        }
        
        // Adiciona data se disponível
        const dataFormatada = formatarDataCurta(comunicado.DATA);
        if (dataFormatada) {
            textoExibicao += ` - ${dataFormatada}`;
        }
        
        item.innerHTML = `
            <i class="fas ${icone}"></i>
            <span>${textoExibicao}</span>
        `;
        
        // Adiciona tooltip com mais informações
        item.title = `${titulo}\n${comunicado.MENSAGEM || ''}`.substring(0, 100) + '...';
        
        // Torna o item clicável para ver detalhes
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.location.href = 'comunicados.html';
        });
        
        return item;
    }
    
    // Escolhe ícone baseado no comunicado
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
    
    // Formata data curta (dd/mm)
    function formatarDataCurta(dataString) {
        if (!dataString || dataString.trim() === '') return null;
        
        const data = converterData(dataString);
        if (!data) return null;
        
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        
        return `${dia}/${mes}`;
    }
    
    // Converte data para objeto Date
    function converterData(dataString) {
        if (!dataString || dataString.trim() === '') return null;
        
        dataString = dataString.trim();
        
        // Tenta formato dd/mm/aaaa
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
        
        // Tenta formato ISO
        if (dataString.includes('T')) {
            return new Date(dataString);
        }
        
        // Tenta formato yyyy-mm-dd
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
    
    // Rolagem automática suave
    function iniciarRolagemAutomatica() {
        let scrollAmount = 0;
        const scrollStep = 1;
        const scrollInterval = 40;
        let isPaused = false;
        
        // Pausa rolagem quando mouse está sobre a tirinha
        tirinhaScroll.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        tirinhaScroll.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Inicia rolagem automática
        const intervalId = setInterval(() => {
            if (!isPaused && tirinhaScroll && tirinhaScroll.scrollWidth > tirinhaScroll.clientWidth) {
                scrollAmount += scrollStep;
                
                // Reinicia quando chega ao final
                if (scrollAmount >= tirinhaScroll.scrollWidth - tirinhaScroll.clientWidth) {
                    scrollAmount = 0;
                }
                
                tirinhaScroll.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, scrollInterval);
        
        // Limpa intervalo quando a página é fechada
        window.addEventListener('beforeunload', () => {
            clearInterval(intervalId);
        });
    }
    
    // Verifica periodicamente por novos comunicados (a cada 5 minutos)
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
        }, 300000); // 5 minutos
    }
    
    // Inicializa
    initTirinha();
    iniciarAtualizacaoPeriodica();
});