document.addEventListener('DOMContentLoaded', function() {
    const currentMonthEl = document.getElementById('currentMonth');
    const calendarioContainer = document.getElementById('calendarioContainer');
    const eventosLista = document.getElementById('eventosLista');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    let dataAtual = new Date();
    let eventos = [];
    
    // Inicialização
    async function init() {
        await carregarEventos();
        renderizarCalendario();
        renderizarListaEventos();
    }
    
    // Carrega eventos da planilha
    async function carregarEventos() {
        try {
            eventos = await fetchData('EVENTOS', 'EVENTOS');
            console.log('Eventos carregados:', eventos);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            eventos = [];
        }
    }
    
    // Renderiza o calendário
    function renderizarCalendario() {
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();
        
        // Atualiza título do mês
        currentMonthEl.textContent = formatarMesAno(dataAtual);
        
        // Limpa o calendário
        calendarioContainer.innerHTML = '';
        
        // Adiciona cabeçalhos dos dias da semana
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        diasSemana.forEach(dia => {
            const diaEl = document.createElement('div');
            diaEl.className = 'dia-semana';
            diaEl.textContent = dia;
            calendarioContainer.appendChild(diaEl);
        });
        
        // Primeiro dia do mês
        const primeiroDia = new Date(ano, mes, 1);
        // Último dia do mês
        const ultimoDia = new Date(ano, mes + 1, 0);
        // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
        const primeiroDiaSemana = primeiroDia.getDay();
        // Total de dias no mês
        const totalDias = ultimoDia.getDate();
        
        // Dias do mês anterior (para preencher início)
        for (let i = 0; i < primeiroDiaSemana; i++) {
            const dia = new Date(ano, mes, -i);
            criarDiaCalendario(dia, true);
        }
        
        // Dias do mês atual
        for (let dia = 1; dia <= totalDias; dia++) {
            const data = new Date(ano, mes, dia);
            criarDiaCalendario(data, false);
        }
        
        // Dias do próximo mês (para completar grid)
        const diasRestantes = 42 - (primeiroDiaSemana + totalDias); // 6 semanas * 7 dias
        for (let i = 1; i <= diasRestantes; i++) {
            const dia = new Date(ano, mes + 1, i);
            criarDiaCalendario(dia, true);
        }
    }
    
    // Cria um dia no calendário
    function criarDiaCalendario(data, isOutroMes) {
        const diaEl = document.createElement('div');
        diaEl.className = 'dia-calendario';
        
        if (isOutroMes) {
            diaEl.classList.add('outro-mes');
        }
        
        // Verifica se é hoje
        const hoje = new Date();
        if (data.getDate() === hoje.getDate() && 
            data.getMonth() === hoje.getMonth() && 
            data.getFullYear() === hoje.getFullYear()) {
            diaEl.classList.add('hoje');
        }
        
        // Número do dia
        const numeroEl = document.createElement('div');
        numeroEl.className = 'numero-dia';
        numeroEl.textContent = data.getDate();
        diaEl.appendChild(numeroEl);
        
        // Eventos deste dia
        const eventosDia = filtrarEventosPorData(data);
        eventosDia.forEach(evento => {
            const eventoEl = document.createElement('div');
            eventoEl.className = `evento-dia ${evento.TIPO?.toLowerCase() || 'normal'}`;
            eventoEl.textContent = evento.EVENTO || 'Evento';
            eventoEl.title = `${evento.EVENTO}\n${evento.DESCRICAO || ''}`;
            //eventoEl.addEventListener('click', () => abrirModalEvento(evento));
            diaEl.appendChild(eventoEl);
        });
        
        calendarioContainer.appendChild(diaEl);
    }
    
    // Filtra eventos por data
    function filtrarEventosPorData(data) {
        return eventos.filter(evento => {
            if (!evento.INICIO) return false;
            
            const dataEvento = new Date(evento.INICIO);
            return dataEvento.getDate() === data.getDate() &&
                   dataEvento.getMonth() === data.getMonth() &&
                   dataEvento.getFullYear() === data.getFullYear();
        });
    }
    
    // Renderiza lista de eventos do mês
    function renderizarListaEventos() {
        eventosLista.innerHTML = '';
        
        const eventosMes = eventos.filter(evento => {
            if (!evento.INICIO) return false;
            
            const dataEvento = new Date(evento.INICIO);
            return dataEvento.getMonth() === dataAtual.getMonth() &&
                   dataEvento.getFullYear() === dataAtual.getFullYear();
        });
        
        // Ordena por data
        eventosMes.sort((a, b) => new Date(a.INICIO) - new Date(b.INICIO));
        
        if (eventosMes.length === 0) {
            eventosLista.innerHTML = '<p class="sem-eventos">Nenhum evento este mês.</p>';
            return;
        }
        
        eventosMes.forEach(evento => {
            const eventoEl = document.createElement('div');
            eventoEl.className = `evento-item ${evento.TIPO?.toLowerCase() || 'normal'}`;
            
            const dataInicio = formatarData(evento.INICIO);
            const dataFim = evento.FIM ? formatarData(evento.FIM) : null;
            
            eventoEl.innerHTML = `
                <div class="evento-data">
                    <i class="far fa-calendar"></i>
                    ${dataInicio}${dataFim && dataFim !== dataInicio ? ` até ${dataFim}` : ''}
                </div>
                <div class="evento-titulo">${evento.EVENTO || 'Evento'}</div>
                <div class="evento-descricao">${evento.DESCRICAO || 'Sem descrição'}</div>
            `;
            
           // eventoEl.addEventListener('click', () => abrirModalEvento(evento));
            eventosLista.appendChild(eventoEl);
        });
    }
    
    // Formata data para exibição
    function formatarData(dataString) {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }
    
    // Formata mês/ano para exibição
    function formatarMesAno(data) {
        return data.toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        }).replace(/^./, c => c.toUpperCase());
    }
    
    // Modal de evento
    /*function abrirModalEvento(evento) {
        const fotos = converterLinksDrive(evento.FOTOS || '');
        const primeiraFoto = fotos[0] || '';
        const dataInicio = formatarData(evento.INICIO);
        const dataFim = evento.FIM ? formatarData(evento.FIM) : null;
        
        let mensagem = `
            <strong>${evento.EVENTO}</strong><br><br>
            <strong>Data:</strong> ${dataInicio}${dataFim ? ` até ${dataFim}` : ''}<br>
            <strong>Tipo:</strong> ${evento.TIPO || 'Normal'}<br>
            <strong>Descrição:</strong> ${evento.DESCRICAO || 'Sem descrição'}<br>
            <strong>Local:</strong> ${evento.local || 'Não informado'}
        `;
        
        if (primeiraFoto) {
            mensagem += `<br><br><img src="${primeiraFoto}" style="max-width:100%;border-radius:5px;">`;
        }
        
        alert(mensagem);
    }*/
    
    // Navegação entre meses
    prevMonthBtn.addEventListener('click', () => {
        dataAtual.setMonth(dataAtual.getMonth() - 1);
        renderizarCalendario();
        renderizarListaEventos();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        dataAtual.setMonth(dataAtual.getMonth() + 1);
        renderizarCalendario();
        renderizarListaEventos();
    });
    
    todayBtn.addEventListener('click', () => {
        dataAtual = new Date();
        renderizarCalendario();
        renderizarListaEventos();
    });
    
    // Inicializa
    init();
});