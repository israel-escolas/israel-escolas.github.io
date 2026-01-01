document.addEventListener('DOMContentLoaded', function() {
    const selectTurma = document.getElementById('selectTurma');
    const container = document.getElementById('horariosContainer');
    const btnDownload = document.getElementById('btnDownload');
    
    let dadosHorarios = null;
    let turmaAtual = '';
    
    // Carrega horários quando selecionar turma
    selectTurma.addEventListener('change', async function() {
        turmaAtual = this.value;
        if (!turmaAtual) {
            mostrarMensagemSelecao();
            return;
        }
        
        container.innerHTML = '<div class="loading">Carregando horários...</div>';
        
        try {
            dadosHorarios = await fetchData('HORARIOS', turmaAtual);
            console.log('Dados recebidos:', dadosHorarios);
            exibirHorarios(dadosHorarios);
            btnDownload.style.display = 'inline-block';
        } catch (error) {
            console.error('Erro detalhado:', error);
            container.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar horários para esta turma.</p>
                    <p><small>${error.message}</small></p>
                </div>
            `;
        }
    });
    
    // Exibe os horários em tabela
    function exibirHorarios(dados) {
        if (!dados || dados.length === 0) {
            container.innerHTML = '<div class="no-data">Nenhum horário cadastrado para esta turma.</div>';
            return;
        }
        
        console.log('Dados para exibir:', dados);
        
        // Verifica quais cabeçalhos existem nos dados
        const primeiraLinha = dados[0];
        const cabecalhos = Object.keys(primeiraLinha);
        
        // Remove coluna ID se existir
        const cabecalhosFiltrados = cabecalhos.filter(cab => cab !== 'ID' && cab !== 'id');
        
        // Cria a tabela
        let tabelaHTML = `
        <div class="table-container">
            <table class="tabela-horarios">
                <thead>
                    <tr>
        `;
        
        // Cabeçalhos dinâmicos
        cabecalhosFiltrados.forEach(cab => {
            tabelaHTML += `<th>${formatarCabecalho(cab)}</th>`;
        });
        
        tabelaHTML += `
                    </tr>
                </thead>
                <tbody>
    `;
        
        // Preenche as linhas ORIGINAIS
        dados.forEach((linha, index) => {
            // Verifica se é contraturno
            const isContraturno = linha.horario && 
                                 linha.horario.toString().toUpperCase().includes('CONTRA');
            
            // Verifica se é linha de professor (linha após horário com conteúdo)
            const isLinhaProfessor = index > 0 && 
                                   dados[index-1].horario && 
                                   dados[index-1].horario.trim() !== '' && 
                                   linha.horario === '';
            
            // Adiciona linha em branco antes do contraturno
            if (isContraturno) {
                tabelaHTML += `<tr class="separator"><td colspan="${cabecalhosFiltrados.length}"></td></tr>`;
            }
            
            // Determina classe da linha
            let linhaClasse = '';
            if (isLinhaProfessor) {
                linhaClasse = 'linha-professor';
            } else if (isContraturno) {
                linhaClasse = 'contraturno-row';
            }
            
            tabelaHTML += `<tr class="${linhaClasse}">`;
            
            cabecalhosFiltrados.forEach(cab => {
                let valor = linha[cab] || '';
                let htmlConteudo = '';
                
                // Se for coluna de horário
                if (cab.toLowerCase().includes('horario')) {
                    htmlConteudo = valor || '&nbsp;';
                } 
                // Se for linha de professor (APENAS PROFESSOR)
                else if (isLinhaProfessor) {
                    if (valor && valor.trim() !== '') {
                        htmlConteudo = `<span class="professor">${valor}</span>`;
                    } else {
                        htmlConteudo = '&nbsp;';
                    }
                }
                // Linha normal com horário (APENAS DISCIPLINA)
                else if (valor && valor.trim() !== '') {
                    htmlConteudo = `<span class="disciplina">${valor}</span>`;
                } else {
                    htmlConteudo = '&nbsp;';
                }
                
                // Se for coluna de horário, destaque
                const classe = cab.toLowerCase().includes('horario') ? 'horario-cell' : '';
                
                tabelaHTML += `<td class="${classe}">${htmlConteudo}</td>`;
            });
            
            tabelaHTML += `</tr>`;
        });
        
        tabelaHTML += `
                </tbody>
            </table>
        </div>
        `;
        
        container.innerHTML = tabelaHTML;
        
        // Força ajuste de altura após renderização
        setTimeout(() => {
            document.querySelectorAll('.linha-professor').forEach(linha => {
                linha.style.height = '28px';
                linha.style.minHeight = '28px';
                linha.style.maxHeight = '28px';
                
                linha.querySelectorAll('td').forEach(celula => {
                    celula.style.padding = '0 8px';
                    celula.style.height = '28px';
                    celula.style.minHeight = '28px';
                    celula.style.maxHeight = '28px';
                    celula.style.overflow = 'hidden';
                });
            });
        }, 50);
    }
    
    // Função para formatar cabeçalhos
    function formatarCabecalho(cabecalho) {
        const map = {
            'horario': 'Horário',
            'segunda-feira': 'Segunda',
            'terça-feira': 'Terça', 
            'quarta-feira': 'Quarta',
            'quinta-feira': 'Quinta',
            'sexta-feira': 'Sexta'
        };
        
        // Converte para minúsculo para comparação
        const cabMinusculo = cabecalho.toLowerCase().trim();
        
        // Retorna mapeado ou o próprio cabeçalho capitalizado
        return map[cabMinusculo] || 
               cabecalho.charAt(0).toUpperCase() + cabecalho.slice(1).toLowerCase();
    }
    
    // Botão de download (simulação)
    btnDownload.addEventListener('click', function() {
        if (!turmaAtual) {
            alert('Selecione uma turma primeiro!');
            return;
        }
        
        // Simulação de download - implementação real requer biblioteca jsPDF
        const nomeArquivo = `Horarios_${turmaAtual.replace(/[º°]/g, '').replace(/\s+/g, '_')}.pdf`;
        alert(`Download do PDF "${nomeArquivo}" seria gerado aqui.\n\nImplementação real com jsPDF pode ser adicionada depois.`);
    });
    
    // Mensagem inicial
    function mostrarMensagemSelecao() {
        container.innerHTML = `
            <div class="no-turma-selected">
                <i class="far fa-calendar-alt fa-3x"></i>
                <p>Selecione uma turma para visualizar os horários</p>
            </div>
        `;
        btnDownload.style.display = 'none';
    }
    
    // Mostra mensagem inicial
    mostrarMensagemSelecao();
});