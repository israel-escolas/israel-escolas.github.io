document.addEventListener('DOMContentLoaded', function() {
    const currentMonthEl = document.getElementById('currentMonth');
    const calendarioContainer = document.getElementById('calendarioContainer');
    const eventosLista = document.getElementById('eventosLista');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    let dataAtual = new Date();
    let eventos = [];
    
    // Lista de feriados escolares 2026 - CORRIGIDA
    const feriadosEscolares = [
        // FEVEREIRO
        { data: '2026-02-11', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'DIREC, Equipe Gestora e Equipe Pedagógica' },
        { data: '2026-02-12', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'DIREC, Equipe Gestora e Equipe Pedagógica' },
        { data: '2026-02-16', nome: 'Carnaval', tipo: 'feriado', descricao: 'Ponto facultativo' },
        { data: '2026-02-17', nome: 'Carnaval', tipo: 'feriado', descricao: 'Ponto facultativo' },
        { data: '2026-02-18', nome: 'Quarta-feira de Cinzas', tipo: 'ponto_facultativo', descricao: 'Ponto facultativo até 14h' },
        { data: '2026-02-19', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Escola' },
        { data: '2026-02-20', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Escola' },
        // ABRIL
        { data: '2026-04-03', nome: 'Quinta-feira Santa', tipo: 'feriado', descricao: 'Semana Santa' },
        { data: '2026-04-04', nome: 'Sexta-feira Santa', tipo: 'feriado', descricao: 'Paixão de Cristo' },
        { data: '2026-04-22', nome: 'Tiradentes', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-04-26', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Não considerar dia letivo' },
        // MAIO
        { data: '2026-05-02', nome: 'Dia do Trabalho', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-05-17', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        // JUNHO
        { data: '2026-06-05', nome: 'Corpus Christi', tipo: 'ponto_facultativo', descricao: 'Ponto facultativo' },
        // JULHO
        { data: '2026-07-12', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        { data: '2026-07-14', nome: 'Início do Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-15', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-16', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-17', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-18', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-19', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-20', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-21', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-22', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-23', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-24', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-25', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },      
        { data: '2026-07-26', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Não considerar dia letivo' },
        { data: '2026-07-27', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-28', nome: 'Término do Recesso', tipo: 'recesso', descricao: 'Retorno das aulas' },
        // AGOSTO
        { data: '2026-08-12', nome: 'Dia do Estudante', tipo: 'comemorativo', descricao: 'Data comemorativa' },
        { data: '2026-08-23', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        // SETEMBRO
        { data: '2026-09-08', nome: 'Independência do Brasil', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-09-13', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        { data: '2026-09-27', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Não considerar dia letivo' },
        // OUTUBRO
        { data: '2026-10-04', nome: 'Mártires de Cunhaú e Uruaçu', tipo: 'feriado', descricao: 'Feriado Estadual RN' },
        { data: '2026-10-13', nome: 'Nossa Senhora Aparecida', tipo: 'feriado', descricao: 'Padroeira do Brasil' },
        { data: '2026-10-16', nome: 'Dia do Professor', tipo: 'ponto_facultativo', descricao: 'Ponto facultativo' },
        { data: '2026-10-29', nome: 'Dia do Servidor Público', tipo: 'ponto_facultativo', descricao: 'Ponto facultativo' },
        // NOVEMBRO
        { data: '2026-11-03', nome: 'Finados', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-11-08', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        { data: '2026-11-21', nome: 'Consciência Negra', tipo: 'feriado', descricao: 'Feriado Nacional' },
        // DEZEMBRO
        { data: '2026-12-26', nome: 'Natal', tipo: 'feriado', descricao: 'Feriado Nacional' }
    ];
    
    // Inicialização
    async function init() {
        await carregarEventos();
        
        // Adiciona os feriados ao array eventos
        feriadosEscolares.forEach(feriado => {
            const jaExiste = eventos.some(e => {
                if (!e || !e.INICIO) return false;
                return e.INICIO === feriado.data;
            });
            
            if (!jaExiste) {
                eventos.push({
                    ID: `escolar_${feriado.data.replace(/-/g, '_')}`,
                    EVENTO: feriado.nome,
                    INICIO: feriado.data,
                    FIM: feriado.data,
                    TIPO: feriado.tipo,
                    DESCRICAO: feriado.descricao
                });
            }
        });
        
        console.log(`✅ Feriados escolares 2026 adicionados! Total de eventos: ${eventos.length}`);
        
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
        const diasRestantes = 42 - (primeiroDiaSemana + totalDias);
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
                eventoEl.textContent = `📅 ${evento.EVENTO || 'Evento'}`;
            } else if (dataComparar.getTime() === dataInicio.getTime()) {
                eventoEl.textContent = `▶ ${evento.EVENTO || 'Evento'}`;
            } else if (dataComparar.getTime() === dataFim.getTime()) {
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
    
    // Filtra eventos apenas para início e fim
    function filtrarEventosPorInicioFim(data) {
        return eventos.filter(evento => {
            if (!evento.INICIO || !evento.FIM) return false;
            
            const dataInicio = new Date(evento.INICIO);
            const dataFim = new Date(evento.FIM);
            const dataComparar = new Date(data);
            dataComparar.setHours(0, 0, 0, 0);
            
            const inicioComparar = new Date(dataInicio);
            inicioComparar.setHours(0, 0, 0, 0);
            
            const fimComparar = new Date(dataFim);
            fimComparar.setHours(0, 0, 0, 0);
            
            return dataComparar.getTime() === inicioComparar.getTime() || 
                   dataComparar.getTime() === fimComparar.getTime();
        });
    }
    
    // Renderiza lista de eventos do mês
    function renderizarListaEventos() {
        eventosLista.innerHTML = '';
        
        const eventosMes = eventos.filter(evento => {
            if (!evento.INICIO || !evento.FIM) return false;
            
            const dataInicio = new Date(evento.INICIO);
            const dataFim = new Date(evento.FIM);
            const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
            const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
            
            primeiroDiaMes.setHours(0, 0, 0, 0);
            ultimoDiaMes.setHours(23, 59, 59, 999);
            dataInicio.setHours(0, 0, 0, 0);
            dataFim.setHours(23, 59, 59, 999);
            
            return (dataInicio >= primeiroDiaMes && dataInicio <= ultimoDiaMes) ||
                   (dataFim >= primeiroDiaMes && dataFim <= ultimoDiaMes);
        });
        
        const eventosUnicos = new Map();
        eventosMes.forEach(evento => {
            if (!eventosUnicos.has(evento.ID)) {
                eventosUnicos.set(evento.ID, evento);
            }
        });
        
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
            const periodo = dataInicio === dataFim ? dataInicio : `${dataInicio} até ${dataFim}`;
            
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
    
    // Formata data para exibição - CORRIGIDA (sem problema de fuso)
    function formatarData(dataString) {
        if (!dataString) return '';
        const partes = dataString.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return dataString;
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

// Adiciona estilos CSS para os novos tipos de evento
(function adicionarEstilosFeriados() {
    const styleFeriados = document.createElement('style');
    styleFeriados.textContent = `
        .evento-dia.jornada, .evento-item.jornada {
            background: #9b59b6 !important;
            border-left-color: #9b59b6 !important;
        }
        .evento-dia.recesso, .evento-item.recesso {
            background: #3498db !important;
            border-left-color: #3498db !important;
        }
        .evento-dia.letivo_especial, .evento-item.letivo_especial {
            background: #2ecc71 !important;
            border-left-color: #2ecc71 !important;
        }
        .evento-dia.comemorativo, .evento-item.comemorativo {
            background: #f1c40f !important;
            border-left-color: #f1c40f !important;
            color: #2c3e50 !important;
        }
        .evento-dia.ponto_facultativo, .evento-item.ponto_facultativo {
            background: #f39c12 !important;
            border-left-color: #f39c12 !important;
        }
        .dia-calendario:has(.evento-dia.feriado) .numero-dia {
            color: #e74c3c !important;
            font-weight: bold;
        }
        .evento-dia[title] {
            cursor: help;
        }
    `;
    document.head.appendChild(styleFeriados);
    console.log('🎨 Estilos dos feriados adicionados!');
})();

console.log('📅 Calendário escolar com feriados 2026 carregado!');