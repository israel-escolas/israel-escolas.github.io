document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('eventosContainer');
    const filterType = document.getElementById('filterType');
    const filterMonth = document.getElementById('filterMonth');
    const resetBtn = document.getElementById('resetFilters');
    
    let todosEventos = [];
    let tiposUnicos = new Set();
    
    // Carrega eventos
    async function carregarEventos() {
        container.innerHTML = '<p class="loading">Carregando eventos...</p>';
        
        const eventos = await fetchData('EVENTOS', 'EVENTOS');
        
        // *** ORDENA OS EVENTOS: MAIS RECENTES PRIMEIRO ***
        todosEventos = eventos.sort((a, b) => {
            // Converte as datas para objetos Date
            const dataA = a.INICIO ? new Date(a.INICIO) : new Date(0);
            const dataB = b.INICIO ? new Date(b.INICIO) : new Date(0);
            
            // Ordena do MAIS RECENTE para o MAIS ANTIGO
            return dataB - dataA;
        });
        
        if (todosEventos.length === 0) {
            container.innerHTML = '<p class="no-events">Nenhum evento cadastrado.</p>';
            return;
        }
        
        // Coleta tipos únicos
        todosEventos.forEach(evento => {
            if (evento.TIPO) tiposUnicos.add(evento.TIPO);
        });
        
        // Preenche filtro de tipos
        filterType.innerHTML = '<option value="all">Todos os tipos</option>';
        tiposUnicos.forEach(tipo => {
            filterType.innerHTML += `<option value="${tipo}">${tipo}</option>`;
        });
        
        // Exibe eventos (já ordenados)
        exibirEventos(todosEventos);
    }
    
    // Exibe eventos na tela
    function exibirEventos(eventos) {
        if (eventos.length === 0) {
            container.innerHTML = '<p class="no-events">Nenhum evento encontrado com esses filtros.</p>';
            return;
        }
        
        container.innerHTML = '';
        
        eventos.forEach(evento => {
            // USAR A FUNÇÃO DE CONVERSÃO DO DRIVE
            const fotos = converterLinksDrive(evento.FOTOS || '');
            const primeiraFoto = fotos[0] || 'https://via.placeholder.com/400x300?text=Sem+Imagem';
            const dataInicio = formatarData(evento.INICIO);
            const dataFim = formatarData(evento.FIM);
            
            const eventoHTML = `
            <div class="evento-card">
                <div class="evento-imagem">
                    <img src="${primeiraFoto}" alt="${evento.EVENTO}" loading="lazy">
                    <span class="evento-tipo">${evento.TIPO || 'Evento'}</span>
                </div>
                <div class="evento-info">
                    <h3>${evento.EVENTO}</h3>
                    <p class="evento-data">
                        <i class="far fa-calendar"></i> ${dataInicio} 
                        ${dataFim && dataFim !== dataInicio ? ` até ${dataFim}` : ''}
                    </p>
                    <p class="evento-descricao">${evento.DESCRICAO || 'Sem descrição'}</p>
                    <button class="btn-ver-mais" onclick="abrirModalEvento(${evento.ID})">
                        Ver detalhes <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            `;
            
            container.innerHTML += eventoHTML;
        });
    }
    
    // Filtra eventos
    function filtrarEventos() {
        let filtrados = [...todosEventos];
        
        // Filtro por tipo
        if (filterType.value !== 'all') {
            filtrados = filtrados.filter(e => e.TIPO === filterType.value);
        }
        
        // Filtro por mês/ano
        if (filterMonth.value) {
            const [ano, mes] = filterMonth.value.split('-');
            filtrados = filtrados.filter(e => {
                if (!e.INICIO) return false;
                const dataEvento = new Date(e.INICIO);
                return dataEvento.getFullYear() == ano && 
                       (dataEvento.getMonth() + 1) == mes;
            });
        }
        
        // *** MANTÉM A ORDEM (mais recentes primeiro) mesmo após filtrar ***
        exibirEventos(filtrados);
    }
    
    // Event Listeners
    filterType.addEventListener('change', filtrarEventos);
    filterMonth.addEventListener('change', filtrarEventos);
    resetBtn.addEventListener('click', () => {
        filterType.value = 'all';
        filterMonth.value = '';
        exibirEventos(todosEventos);
    });
    
    // Modal simples (para teste)
    // ======== MODAL MELHORADO ======== //
    let fotosModal = [];
    let indexFoto = 0;

    window.abrirModalEvento = function(id) {
        const evento = todosEventos.find(e => e.ID == id);
        if (!evento) return;

        // Dados
        document.getElementById("modalTitulo").textContent = evento.EVENTO;
        document.getElementById("modalDescricao").textContent = evento.DESCRICAO || "Sem descrição";
        document.getElementById("modalData").textContent =
            formatarData(evento.INICIO) +
            (evento.FIM ? " até " + formatarData(evento.FIM) : "");

        // Fotos
        fotosModal = converterLinksDrive(evento.FOTOS || '');
        indexFoto = 0;

        const img = document.getElementById("galeriaImagem");
        img.src = fotosModal[0] || "https://via.placeholder.com/800x500?text=Sem+Imagem";

        // Mostrar modal
        document.getElementById("modalEvento").classList.add("active");
    };

    // Botões da galeria
    document.getElementById("galeriaNext").onclick = function() {
        if (fotosModal.length === 0) return;
        indexFoto = (indexFoto + 1) % fotosModal.length;
        document.getElementById("galeriaImagem").src = fotosModal[indexFoto];
    };

    document.getElementById("galeriaPrev").onclick = function() {
        if (fotosModal.length === 0) return;
        indexFoto = (indexFoto - 1 + fotosModal.length) % fotosModal.length;
        document.getElementById("galeriaImagem").src = fotosModal[indexFoto];
    };

    // Fechar modal
    document.getElementById("modalClose").onclick = function() {
        document.getElementById("modalEvento").classList.remove("active");
    };

    // Fechar clicando fora
    document.getElementById("modalEvento").onclick = function(e) {
        if (e.target.id === "modalEvento") {
            document.getElementById("modalEvento").classList.remove("active");
        }
    };

    // Fechar com ESC
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            document.getElementById("modalEvento").classList.remove("active");
        }
    });

    // Inicializa
    carregarEventos();
});