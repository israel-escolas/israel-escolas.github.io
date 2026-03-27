document.addEventListener('DOMContentLoaded', function() {
    const currentMonthEl = document.getElementById('currentMonth');
    const calendarioContainer = document.getElementById('calendarioContainer');
    const eventosLista = document.getElementById('eventosLista');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    let dataAtual = new Date();
    let eventos = [];
    
    // Lista de feriados escolares 2026
    const feriadosEscolares = [
        // FEVEREIRO
        { data: '2026-02-10', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'DIREC, Equipe Gestora e Equipe Pedagógica' },
        { data: '2026-02-11', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'DIREC, Equipe Gestora e Equipe Pedagógica' },
        { data: '2026-02-15', nome: 'Carnaval', tipo: 'feriado', descricao: 'Ponto facultativo' },
        { data: '2026-02-16', nome: 'Carnaval', tipo: 'feriado', descricao: 'Ponto facultativo' },
        { data: '2026-02-17', nome: 'Quarta-feira de Cinzas', tipo: 'ponto_facultativo', descricao: 'Ponto facultativo até 14h' },
        { data: '2026-02-18', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Escola' },
        { data: '2026-02-19', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Escola' },
        // ABRIL
        { data: '2026-04-02', nome: 'Quinta-feira Santa', tipo: 'feriado', descricao: 'Semana Santa' },
        { data: '2026-04-03', nome: 'Sexta-feira Santa', tipo: 'feriado', descricao: 'Paixão de Cristo' },
        { data: '2026-04-21', nome: 'Tiradentes', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-04-25', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Não considerar dia letivo' },
        // MAIO
        { data: '2026-05-01', nome: 'Dia do Trabalho', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-05-16', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        // JUNHO
        { data: '2026-06-04', nome: 'Corpus Christi', tipo: 'ponto_facultativo', descricao: 'Ponto facultativo' },
        // JULHO
        { data: '2026-07-11', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        { data: '2026-07-13', nome: 'Início do Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-14', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
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
        { data: '2026-07-25', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Não considerar dia letivo' },
        { data: '2026-07-26', nome: 'Recesso', tipo: 'recesso', descricao: 'Recesso escolar' },
        { data: '2026-07-27', nome: 'Término do Recesso', tipo: 'recesso', descricao: 'Retorno das aulas' },
        // AGOSTO
        { data: '2026-08-11', nome: 'Dia do Estudante', tipo: 'comemorativo', descricao: 'Data comemorativa' },
        { data: '2026-08-22', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        // SETEMBRO
        { data: '2026-09-07', nome: 'Independência do Brasil', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-09-12', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        { data: '2026-09-26', nome: 'Jornada Pedagógica', tipo: 'jornada', descricao: 'Não considerar dia letivo' },
        // OUTUBRO
        { data: '2026-10-03', nome: 'Mártires de Cunhaú e Uruaçu', tipo: 'feriado', descricao: 'Feriado Estadual RN' },
        { data: '2026-10-12', nome: 'Nossa Senhora Aparecida', tipo: 'feriado', descricao: 'Padroeira do Brasil' },
        { data: '2026-10-16', nome: 'Dia do Professor', tipo: 'comemorativo', descricao: 'Ponto facultativo' },
        { data: '2026-10-28', nome: 'Dia do Servidor Público', tipo: 'comemorativo', descricao: 'Ponto facultativo' },
        // NOVEMBRO
        { data: '2026-11-02', nome: 'Finados', tipo: 'feriado', descricao: 'Feriado Nacional' },
        { data: '2026-11-07', nome: 'Dia Letivo Acrescido', tipo: 'letivo_especial', descricao: 'Sábado letivo' },
        { data: '2026-11-20', nome: 'Consciência Negra', tipo: 'feriado', descricao: 'Feriado Nacional' },
        // DEZEMBRO
        { data: '2026-12-25', nome: 'Natal', tipo: 'feriado', descricao: 'Feriado Nacional' }
    ];
    
    // Função auxiliar para criar data sem horário (apenas YYYY-MM-DD)
    function criarDataSemHorario(dataString) {
        if (!dataString) return null;
        const partes = dataString.split('-');
        if (partes.length === 3) {
            // Cria data com ano, mês, dia (sem horário, usando fuso local)
            return new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
        }
        return null;
    }
    
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
            // Verifica se a função fetchData existe globalmente
            if (typeof window.fetchData === 'function') {
                eventos = await window.fetchData('EVENTOS', 'EVENTOS');
                console.log('Eventos carregados:', eventos);
            } else {
                console.log('⚠️ Função fetchData não encontrada, usando apenas feriados escolares');
                eventos = [];
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            eventos = [];
        }
    }
    
    // Filtra eventos apenas para início e fim (CORRIGIDO)
    function filtrarEventosPorInicioFim(data) {
        const dataComparar = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        dataComparar.setHours(0, 0, 0, 0);
        
        return eventos.filter(evento => {
            if (!evento.INICIO || !evento.FIM) return false;
            
            const dataInicio = criarDataSemHorario(evento.INICIO);
            const dataFim = criarDataSemHorario(evento.FIM);
            
            if (!dataInicio || !dataFim) return false;
            
            dataInicio.setHours(0, 0, 0, 0);
            dataFim.setHours(0, 0, 0, 0);
            
            return dataComparar.getTime() === dataInicio.getTime() || 
                   dataComparar.getTime() === dataFim.getTime();
        });
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
    
    // Cria um dia no calendário (CORRIGIDO)
    function criarDiaCalendario(data, isOutroMes) {
        const diaEl = document.createElement('div');
        diaEl.className = 'dia-calendario';
        
        if (isOutroMes) {
            diaEl.classList.add('outro-mes');
        }
        
        // Verifica se é hoje (comparando data sem horário)
        const hoje = new Date();
        const hojeSemHorario = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const dataSemHorario = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        
        if (dataSemHorario.getTime() === hojeSemHorario.getTime()) {
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
            const dataInicio = criarDataSemHorario(evento.INICIO);
            const dataFim = criarDataSemHorario(evento.FIM);
            const dataComparar = new Date(data.getFullYear(), data.getMonth(), data.getDate());
            dataComparar.setHours(0, 0, 0, 0);
            
            if (dataInicio && dataFim) {
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
    
    // Renderiza lista de eventos do mês (CORRIGIDO)
    function renderizarListaEventos() {
        eventosLista.innerHTML = '';
        
        const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
        const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
        primeiroDiaMes.setHours(0, 0, 0, 0);
        ultimoDiaMes.setHours(23, 59, 59, 999);
        
        const eventosMes = eventos.filter(evento => {
            if (!evento.INICIO || !evento.FIM) return false;
            
            const dataInicio = criarDataSemHorario(evento.INICIO);
            const dataFim = criarDataSemHorario(evento.FIM);
            
            if (!dataInicio || !dataFim) return false;
            
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
        eventosListaArray.sort((a, b) => {
            const dataA = criarDataSemHorario(a.INICIO);
            const dataB = criarDataSemHorario(b.INICIO);
            return dataA - dataB;
        });
        
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
    
    // Formata data para exibição
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
        .evento-dia.feriado, .evento-item.feriado {
            background: #e74c3c !important;
            border-left-color: #e74c3c !important;
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