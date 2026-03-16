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
        
        // Eventos deste dia (apenas início e fim)
        const eventosDia = filtrarEventosPorInicioFim(data);
        
        // Adiciona eventos ao dia
        eventosDia.forEach(evento => {
            const eventoEl = document.createElement('div');
            eventoEl.className = `evento-dia ${evento.TIPO?.toLowerCase() || 'normal'}`;
            
            // Verifica se é início ou fim para adicionar indicador visual
            const dataInicio = new Date(evento.INICIO);
            const dataFim = new Date(evento.FIM);
            const dataComparar = new Date(data);
            dataComparar.setHours(0, 0, 0, 0);
            dataInicio.setHours(0, 0, 0, 0);
            dataFim.setHours(0, 0, 0, 0);
            
            if (dataComparar.getTime() === dataInicio.getTime() && 
                dataComparar.getTime() === dataFim.getTime()) {
                // Evento de um único dia
                eventoEl.textContent = `📅 ${evento.EVENTO || 'Evento'}`;
            } else if (dataComparar.getTime() === dataInicio.getTime()) {
                // Dia de início
                eventoEl.textContent = `▶ ${evento.EVENTO || 'Evento'}`;
            } else if (dataComparar.getTime() === dataFim.getTime()) {
                // Dia de fim
                eventoEl.textContent = `⏹ ${evento.EVENTO || 'Evento'}`;
            } else {
                eventoEl.textContent = evento.EVENTO || 'Evento';
            }
            
            // Adiciona informações de data no tooltip
            const dataInicioStr = formatarData(evento.INICIO);
            const dataFimStr = formatarData(evento.FIM);
            eventoEl.title = `${evento.EVENTO}\nInício: ${dataInicioStr}\nFim: ${dataFimStr}\n${evento.DESCRICAO || ''}`;
            
            diaEl.appendChild(eventoEl);
        });
        
        calendarioContainer.appendChild(diaEl);
    }
    
    // NOVA FUNÇÃO: Filtra eventos apenas para início e fim
    function filtrarEventosPorInicioFim(data) {
        return eventos.filter(evento => {
            if (!evento.INICIO || !evento.FIM) return false;
            
            // Converte as strings de data para objetos Date
            const dataInicio = new Date(evento.INICIO);
            const dataFim = new Date(evento.FIM);
            
            // Ajusta as datas para comparar apenas dia/mês/ano
            const dataComparar = new Date(data);
            dataComparar.setHours(0, 0, 0, 0);
            
            const inicioComparar = new Date(dataInicio);
            inicioComparar.setHours(0, 0, 0, 0);
            
            const fimComparar = new Date(dataFim);
            fimComparar.setHours(0, 0, 0, 0);
            
            // Verifica se a data é exatamente o início OU exatamente o fim
            return dataComparar.getTime() === inicioComparar.getTime() || 
                   dataComparar.getTime() === fimComparar.getTime();
        });
    }
    
    // Renderiza lista de eventos do mês
    function renderizarListaEventos() {
        eventosLista.innerHTML = '';
        
        // Filtra eventos que ocorrem neste mês (considerando início ou fim)
        const eventosMes = eventos.filter(evento => {
            if (!evento.INICIO || !evento.FIM) return false;
            
            const dataInicio = new Date(evento.INICIO);
            const dataFim = new Date(evento.FIM);
            
            // Cria datas para o primeiro e último dia do mês atual
            const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
            const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
            
            // Ajusta para comparar apenas datas
            primeiroDiaMes.setHours(0, 0, 0, 0);
            ultimoDiaMes.setHours(23, 59, 59, 999);
            dataInicio.setHours(0, 0, 0, 0);
            dataFim.setHours(23, 59, 59, 999);
            
            // Verifica se INÍCIO ou FIM está dentro do mês atual
            return (dataInicio >= primeiroDiaMes && dataInicio <= ultimoDiaMes) ||
                   (dataFim >= primeiroDiaMes && dataFim <= ultimoDiaMes);
        });
        
        // Remove duplicatas e ordena por data de início
        const eventosUnicos = new Map();
        eventosMes.forEach(evento => {
            if (!eventosUnicos.has(evento.ID)) {
                eventosUnicos.set(evento.ID, evento);
            }
        });
        
        // Converte o Map de volta para array e ordena por data de início
        const eventosListaArray = Array.from(eventosUnicos.values());
        eventosListaArray.sort((a, b) => new Date(a.INICIO) - new Date(b.INICIO));
        
        if (eventosListaArray.length === 0) {
            eventosLista.innerHTML = '<p class="sem-eventos">Nenhum evento este mês.</p>';
            return;
        }
        
        eventosListaArray.forEach(evento => {
            const eventoEl = document.createElement('div');
            eventoEl.className = `evento-item ${evento.TIPO?.toLowerCase() || 'normal'}`;
            
            const dataInicio = formatarData(evento.INICIO);
            const dataFim = formatarData(evento.FIM);
            
            // Mostra o período completo
            const periodo = dataInicio === dataFim 
                ? dataInicio 
                : `${dataInicio} até ${dataFim}`;
            
            eventoEl.innerHTML = `
                <div class="evento-data">
                    <i class="far fa-calendar"></i>
                    ${periodo}
                </div>
                <div class="evento-titulo">${evento.EVENTO || 'Evento'}</div>
                <div class="evento-descricao">${evento.DESCRICAO || 'Sem descrição'}</div>
            `;
            
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