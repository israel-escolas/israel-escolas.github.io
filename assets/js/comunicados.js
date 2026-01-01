document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('comunicadosContainer');
    const filtroDestinatario = document.getElementById('filtroDestinatario');
    const filtroUrgencia = document.getElementById('filtroUrgencia');
    const filtroStatus = document.getElementById('filtroStatus');
    const limparFiltrosBtn = document.getElementById('limparFiltros');

    let todosComunicados = [];
    
    // Inicialização
    async function init() {
        await carregarComunicados();
        // Aplica o filtro de ativos por padrão
        filtrarComunicados();
    }
    
    // Carrega comunicados da planilha
    async function carregarComunicados() {
        container.innerHTML = `
            <div class="loading-comunicados">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando comunicados...</p>
            </div>
        `;
        
        try {
            todosComunicados = await fetchData('COMUNICADOS', 'COMUNICADOS');
            console.log('Comunicados carregados:', todosComunicados);
            
            if (todosComunicados.length === 0) {
                mostrarSemComunicados();
                return;
            }
            
            exibirComunicados(todosComunicados);
        } catch (error) {
            console.error('Erro ao carregar comunicados:', error);
            container.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar comunicados.</p>
                    <p><small>${error.message}</small></p>
                </div>
            `;
        }
    }
    
    // Exibe comunicados na tela
    function exibirComunicados(comunicados) {
        if (comunicados.length === 0) {
            mostrarSemComunicados();
            return;
        }
        
        // Verifica se está mostrando "Todos"
        const mostrandoTodos = filtroStatus.value === 'all';
        
        // Ordena os comunicados
        const comunicadosOrdenados = ordenarComunicados(comunicados, mostrandoTodos);
        
        container.innerHTML = '';
        
        comunicadosOrdenados.forEach(comunicado => {
            const card = criarCardComunicado(comunicado);
            container.appendChild(card);
        });
    }
    
    // Função de ordenação dos comunicados
    function ordenarComunicados(comunicados, mostrandoTodos) {
        // Cria uma cópia para não modificar o original
        const ordenados = [...comunicados];
        
        ordenados.sort((a, b) => {
            // 1º critério: Se mostrando TODOS, ativos primeiro
            if (mostrandoTodos) {
                const hoje = new Date();
                const expiradoA = converterData(a.VALIDADE) && converterData(a.VALIDADE) < hoje;
                const expiradoB = converterData(b.VALIDADE) && converterData(b.VALIDADE) < hoje;
                
                // Ativos (não expirados) primeiro
                if (!expiradoA && expiradoB) return -1;
                if (expiradoA && !expiradoB) return 1;
            }
            
            // 2º critério: Urgentes primeiro
            if (a.URGENTE === 'SIM' && b.URGENTE !== 'SIM') return -1;
            if (a.URGENTE !== 'SIM' && b.URGENTE === 'SIM') return 1;
            
            // 3º critério: Data mais recente primeiro
            const dataA = converterData(a.DATA);
            const dataB = converterData(b.DATA);
            return dataB - dataA;
        });
        
        return ordenados;
    }
    
    // Cria card de comunicado
    function criarCardComunicado(comunicado) {
        const card = document.createElement('div');
        
        // Classes base
        card.className = 'comunicado-card';
        
        // Verifica se é urgente
        if (comunicado.URGENTE === 'SIM') {
            card.classList.add('urgente');
        }
        
        // Verifica se está expirado
        const hoje = new Date();
        const validoAte = converterData(comunicado.VALIDADE);
        const isExpirado = validoAte && validoAte < hoje;
        
        if (isExpirado) {
            card.classList.add('expirado');
        }
        
        // Formata datas
        const dataFormatada = formatarDataBR(comunicado.DATA);
        const validadeFormatada = formatarDataBR(comunicado.VALIDADE);
        
        // Destinatário
        const destinatario = comunicado.DESTINATARIO || 'TODOS';
        
        // Conteúdo HTML
        card.innerHTML = `
            <div class="comunicado-header">
                <h3 class="comunicado-titulo">${comunicado.TITULO || 'Sem título'}</h3>
                <div class="comunicado-meta">
                    <span class="comunicado-badge badge-destinatario">${destinatario}</span>
                    ${comunicado.URGENTE === 'SIM' ? '<span class="comunicado-badge badge-urgente">Urgente</span>' : ''}
                    <span class="comunicado-badge badge-data">${dataFormatada}</span>
                    <span class="comunicado-badge badge-validade ${isExpirado ? 'expirado' : ''}">Válido até: ${validadeFormatada}</span>
                </div>
            </div>
            
            <div class="comunicado-conteudo">
                ${(comunicado.MENSAGEM || 'Sem conteúdo').replace(/\n/g, '<br>')}
            </div>
            
            <div class="comunicado-footer">
                <span class="comunicado-id">Comunicado #${comunicado.ID || 'N/A'}</span>
                <span>${isExpirado ? '⏰ Expirado' : '✅ Ativo'}</span>
            </div>
        `;
        
        return card;
    }
    
    // Converte data para objeto Date
    function converterData(dataString) {
        if (!dataString || dataString.trim() === '') return null;
        
        // Remove espaços extras
        dataString = dataString.trim();
        
        // Tenta formato dd/mm/aaaa
        if (dataString.includes('/')) {
            const partes = dataString.split('/');
            if (partes.length === 3) {
                // Remove espaços em branco
                const dia = parseInt(partes[0].trim(), 10);
                const mes = parseInt(partes[1].trim(), 10) - 1;
                let ano = parseInt(partes[2].trim(), 10);
                
                // Verifica se é ano com 2 dígitos
                if (ano < 100) {
                    ano += 2000; // Assume anos 2000+
                }
                
                return new Date(ano, mes, dia);
            }
        }
        
        // Tenta formato ISO (2026-01-28T03:00:00.000Z)
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
        
        // Tenta criar Date normalmente
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? null : data;
    }
    
    // Formata data para exibição BR (dd/mm/aaaa)
    function formatarDataBR(dataString) {
        if (!dataString || dataString.trim() === '') return 'Não informada';
        
        const dataObj = converterData(dataString);
        
        // Se não conseguiu converter, retorna o valor original
        if (!dataObj) {
            return dataString;
        }
        
        // Formata para dd/mm/aaaa
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
    }
    
    // Filtra comunicados
    function filtrarComunicados() {
        let filtrados = [...todosComunicados];
        
        // Filtro por destinatário
        if (filtroDestinatario.value !== 'all') {
            filtrados = filtrados.filter(c => 
                (c.DESTINATARIO || 'TODOS') === filtroDestinatario.value
            );
        }
        
        // Filtro por urgência
        if (filtroUrgencia.value !== 'all') {
            filtrados = filtrados.filter(c => 
                c.URGENTE === filtroUrgencia.value
            );
        }
        
        // Filtro por status (ativo/expirado)
        if (filtroStatus.value !== 'all') {
            const hoje = new Date();
            filtrados = filtrados.filter(c => {
                const validoAte = converterData(c.VALIDADE);
                const isExpirado = validoAte && validoAte < hoje;
                return filtroStatus.value === 'expirado' ? isExpirado : !isExpirado;
            });
        }
        
        exibirComunicados(filtrados);
    }
    
    // Mensagem quando não há comunicados
    function mostrarSemComunicados() {
        container.innerHTML = `
            <div class="sem-comunicados">
                <i class="far fa-newspaper fa-3x"></i>
                <p>Nenhum comunicado encontrado.</p>
                ${todosComunicados.length === 0 ? '<p><small>Adicione comunicados na planilha.</small></p>' : ''}
            </div>
        `;
    }
    
    // Event Listeners
    filtroDestinatario.addEventListener('change', filtrarComunicados);
    filtroUrgencia.addEventListener('change', filtrarComunicados);
    filtroStatus.addEventListener('change', filtrarComunicados);
    
    limparFiltrosBtn.addEventListener('click', () => {
        filtroDestinatario.value = 'all';
        filtroUrgencia.value = 'all';
        filtroStatus.value = 'all';
        exibirComunicados(todosComunicados);
    });
    
    // Inicializa
    init();
});