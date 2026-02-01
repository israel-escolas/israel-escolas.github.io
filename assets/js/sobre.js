document.addEventListener('DOMContentLoaded', async function() {
    const timelineContainer = document.getElementById('timelineContainer');
    const professoresContainer = document.getElementById('professoresContainer');
    const filtroDisciplina = document.getElementById('filtroDisciplina');
    
    // Dados da linha do tempo
    const timelineData = [
        {
            ano: "1990",
            titulo: "Fundação da Escola",
            descricao: "A Escola Estadual Mariana Cavalcanti foi fundada com apenas 4 salas de aula e 120 alunos. O nome homenageia a educadora Mariana Cavalcanti, pioneira no ensino público na região."
        },
        {
            ano: "1998",
            titulo: "Expansão e Modernização",
            descricao: "Ampliação do prédio com construção de laboratório de ciências, biblioteca e quadra esportiva. Implementação do primeiro laboratório de informática."
        },
        {
            ano: "2005",
            titulo: "Primeira Formatura",
            descricao: "Realizada a primeira formatura do ensino fundamental, com 45 alunos concluindo o 9º ano. Início de programa de atividades extracurriculares."
        },
        {
            ano: "2012",
            titulo: "Reconhecimento Estadual",
            descricao: "A escola recebe o selo 'Escola Referência' pelo desempenho no IDEB. Implantação do projeto pedagógico 'Educação Integral'."
        },
        {
            ano: "2020",
            titulo: "Inovação Digital",
            descricao: "Implementação completa do ensino híbrido durante a pandemia. Digitalização de processos e criação da plataforma de ensino online da escola."
        },
        {
            ano: "2024",
            titulo: "Presente e Futuro",
            descricao: "Consolidação como referência educacional na região. Projetos de sustentabilidade e tecnologia aplicada à educação."
        }
    ];
    
    // Inicialização
    async function init() {
        renderizarTimeline();
        await carregarProfessores();
    }
    
    // Renderiza linha do tempo
    function renderizarTimeline() {
        timelineContainer.innerHTML = '';
        
        timelineData.forEach((item, index) => {
            const isEven = index % 2 === 0;
            
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-year">${item.ano}</div>
                    <h4 class="timeline-title">${item.titulo}</h4>
                    <p class="timeline-description">${item.descricao}</p>
                </div>
            `;
            
            timelineContainer.appendChild(timelineItem);
        });
    }
    
    // Carrega professores da planilha
    async function carregarProfessores() {
        professoresContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando professores...</p>
            </div>
        `;
        
        try {
            const professores = await fetchData('HORARIOS', 'PROFESSORES');
            console.log('Professores carregados:', professores);
            
            if (!professores || professores.length === 0) {
                mostrarSemProfessores();
                return;
            }
            
            // Extrai disciplinas únicas para o filtro
            const disciplinasUnicas = new Set();
            professores.forEach(prof => {
                // Pega todas as disciplinas (colunas 01-04)
                const disciplinas = [
                    prof['DISCIPLINA 01'],
                    prof['DISCIPLINA 02'],
                    prof['DISCIPLINA 03'],
                    prof['DISCIPLINA 04'],
                    prof['DISCIPLINA 05'],
                    prof['DISCIPLINA 06'],
                    prof['DISCIPLINA 07'],
                    prof['DISCIPLINA 08']
                ];
                
                // Adiciona ao set depois de corrigir
                disciplinas.forEach(d => {
                    if (d && d.trim() !== '') {
                        const disciplinaCorrigida = corrigirDisciplina(d);
                        disciplinasUnicas.add(disciplinaCorrigida);
                    }
                });
            });
            
            // Ordena disciplinas alfabeticamente
            const disciplinasOrdenadas = Array.from(disciplinasUnicas).sort();
            
            // Preenche filtro
            filtroDisciplina.innerHTML = '<option value="all">Todas as disciplinas</option>';
            disciplinasOrdenadas.forEach(disciplina => {
                filtroDisciplina.innerHTML += `<option value="${disciplina}">${disciplina}</option>`;
            });
            
            // Processa professores antes de exibir
            const professoresProcessados = processarProfessores(professores);
            exibirProfessores(professoresProcessados);
            
        } catch (error) {
            console.error('Erro ao carregar professores:', error);
            professoresContainer.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar professores.</p>
                    <p><small>${error.message || 'Verifique a conexão ou a estrutura dos dados'}</small></p>
                </div>
            `;
        }
    }
    
    // Processa professores - corrige dados e formata
    function processarProfessores(professores) {
        return professores.map(prof => {
            // Cria uma cópia para não alterar os dados originais
            const professorProcessado = { ...prof };
            
            // Corrige disciplinas
            professorProcessado['DISCIPLINA 01'] = corrigirDisciplina(prof['DISCIPLINA 01']);
            professorProcessado['DISCIPLINA 02'] = corrigirDisciplina(prof['DISCIPLINA 02']);
            professorProcessado['DISCIPLINA 03'] = corrigirDisciplina(prof['DISCIPLINA 03']);
            professorProcessado['DISCIPLINA 04'] = corrigirDisciplina(prof['DISCIPLINA 04']);
            professorProcessado['DISCIPLINA 05'] = corrigirDisciplina(prof['DISCIPLINA 05']);
            professorProcessado['DISCIPLINA 06'] = corrigirDisciplina(prof['DISCIPLINA 06']);
            professorProcessado['DISCIPLINA 07'] = corrigirDisciplina(prof['DISCIPLINA 07']);
            professorProcessado['DISCIPLINA 08'] = corrigirDisciplina(prof['DISCIPLINA 08']);
            
            // Processa a foto usando a função converterLinksDrive do api.js
            if (prof.FOTO && prof.FOTO.trim() !== '') {
                const fotosConvertidas = converterLinksDrive(prof.FOTO);
                if (fotosConvertidas.length > 0) {
                    professorProcessado.FOTO = fotosConvertidas[0]; // Pega a primeira foto
                }
            }
            
            // Formata experiência
            if (prof.EXPERIENCIA) {
                professorProcessado.EXPERIENCIA = formatarExperiencia(prof.EXPERIENCIA);
            }
            
            return professorProcessado;
        });
    }
    
    // Corrige nomes de disciplinas
    function corrigirDisciplina(disciplina) {
        if (!disciplina) return '';
        
        const disciplinaTrim = disciplina.trim();
        if (disciplinaTrim === '') return '';
        
        const correcoes = {
            'SOLCIOLOGIA': 'SOCIOLOGIA',
            'RADOSÍNIO LÓGICO': 'RACIOCÍNIO LÓGICO',
            'RADOSINIO LOGICO': 'RACIOCÍNIO LÓGICO',
            'RACIOCINIO LOGICO': 'RACIOCÍNIO LÓGICO',
            'REDIÇÃO': 'REDAÇÃO',
            'PORTUGUES': 'PORTUGUÊS',
            'MATEMATICA': 'MATEMÁTICA',
            'FISICA': 'FÍSICA',
            'CIENCIAS': 'CIÊNCIAS',
            'BIOLOGIA': 'BIOLOGIA',
            'HISTORIA': 'HISTÓRIA',
            'GEOGRAFIA': 'GEOGRAFIA',
            'FILOSOFIA': 'FILOSOFIA',
            'SOCIOLOGIA': 'SOCIOLOGIA',
            'ED. AMBIENTAL': 'EDUCAÇÃO AMBIENTAL',
            'ED AMBIENTAL': 'EDUCAÇÃO AMBIENTAL',
            'EDUCAÇÃO AMBIENTAL': 'EDUCAÇÃO AMBIENTAL',
            'LETRAS': 'LÍNGUA PORTUGUESA'
        };
        
        const disciplinaUpper = disciplinaTrim.toUpperCase();
        return correcoes[disciplinaUpper] || disciplinaTrim;
    }
    
    // Formata experiência
    function formatarExperiencia(experiencia) {
        if (!experiencia) return '';
        
        // Se já estiver formatado, retorna como está
        if (typeof experiencia === 'string' && experiencia.includes('anos')) {
            return experiencia;
        }
        
        // Extrai números da string
        const match = experiencia.toString().match(/\d+/);
        if (match) {
            const anos = match[0];
            return `${anos} anos de experiência na instituição.`;
        }
        
        return experiencia.toString();
    }
    
    // Exibe professores
    function exibirProfessores(professores) {
        if (!professores || professores.length === 0) {
            mostrarSemProfessores();
            return;
        }
        
        professoresContainer.innerHTML = '';
        
        professores.forEach(professor => {
            const professorCard = criarCardProfessor(professor);
            if (professorCard) {
                professoresContainer.appendChild(professorCard);
            }
        });
    }
    
    // Cria card de professor
    function criarCardProfessor(professor) {
        // Verifica se temos dados mínimos
        if (!professor.PROFESSORES && !professor.NOME) {
            console.warn('Professor sem nome:', professor);
            return null;
        }
        
        const card = document.createElement('div');
        card.className = 'professor-card';
        
        // Extrai disciplinas válidas
        const disciplinas = [
            professor['DISCIPLINA 01'],
            professor['DISCIPLINA 02'], 
            professor['DISCIPLINA 03'],
            professor['DISCIPLINA 04'],
            professor['DISCIPLINA 05'],
            professor['DISCIPLINA 06'],
            professor['DISCIPLINA 07'],
            professor['DISCIPLINA 08']
        ].filter(d => d && d.trim() !== '');
        
        // Usa o nome completo da coluna PROFESSORES
        let nomeCompleto = professor.NOME || professor.PROFESSORES || 'Professor';
        
        // Determina título (Prof./Profª.) baseado no nome
        let titulo = 'Prof.';
        const nomeUpper = nomeCompleto.toUpperCase();
        
        // Detecção automática de gênero pelo nome
        const nomesFemininos = ['MARIA', 'ANA', 'SOLANGE', 'CLARA', 'LUCIA', 'LÚCIA', 'SOFIA', 'JULIA', 'JÚLIA', 'BEATRIZ', 'LUIZA', 'CARLA', 'PATRICIA', 'PATRÍCIA'];
        const contemNomeFeminino = nomesFemininos.some(nome => nomeUpper.includes(nome));
        
        if (contemNomeFeminino) {
            titulo = 'Profª.';
        }
        
        // Se já começar com Profª no nome, usa Profª.
        if (nomeUpper.startsWith('PROFª') || nomeUpper.includes(' PROFA')) {
            titulo = 'Profª.';
        }
        
        // Remove qualquer prefixo do nome
        let nomeDisplay = nomeCompleto.replace(/Profª?\.?\s*/i, '').trim();
        
        // Calcula iniciais para fallback
        const nomePartes = nomeDisplay.split(' ').filter(n => n.trim() !== '');
        let iniciais = '';
        if (nomePartes.length >= 2) {
            iniciais = (nomePartes[0][0] + nomePartes[nomePartes.length - 1][0]).toUpperCase();
        } else if (nomePartes.length === 1) {
            iniciais = nomePartes[0].substring(0, 2).toUpperCase();
        } else {
            iniciais = 'PR';
        }
        
        // Verifica se tem foto processada
        const temFoto = professor.FOTO && professor.FOTO.trim() !== '';
        
        // Determina área principal (primeira disciplina)
        const areaPrincipal = disciplinas.length > 0 ? disciplinas[0] : '';
        
        // Monta o HTML do card
        card.innerHTML = `
            <div class="professor-header">
                <div class="professor-avatar ${temFoto ? 'has-foto' : 'no-foto'}">
                    ${temFoto ? 
                        `<img src="${professor.FOTO}" alt="${nomeDisplay}" class="professor-foto-real">` 
                        : iniciais
                    }
                </div>
                <h3 class="professor-nome">${titulo} ${nomeDisplay}</h3>
                <p class="professor-area">${areaPrincipal}</p>
            </div>
            <div class="professor-info">
                ${professor.FORMACAO ? `
                    <div class="professor-formacao">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${professor.FORMACAO}</span>
                    </div>
                ` : ''}
                
                ${professor.EXPERIENCIA ? `
                    <div class="professor-experiencia">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${professor.EXPERIENCIA}</span>
                    </div>
                ` : ''}
                
                ${disciplinas.length > 0 ? `
                    <div class="professor-disciplinas">
                        <h4><i class="fas fa-book"></i> Disciplinas:</h4>
                        <div class="disciplinas-list">
                            ${disciplinas.map(d => `
                                <div class="disciplina-item">
                                    <i class="fas fa-check"></i>
                                    <span>${d}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : '<p class="sem-disciplinas">Disciplinas não informadas</p>'}
            </div>
        `;
        
        // Adiciona classe baseada na área principal para diferentes cores
        const areaUpper = areaPrincipal.toUpperCase();
        if (areaUpper.includes('PORTUGUÊS') || areaUpper.includes('LITERATURA') || areaUpper.includes('REDAÇÃO') || areaUpper.includes('LETRAS')) {
            card.classList.add('professor-linguas');
        } else if (areaUpper.includes('MATEMÁTICA') || areaUpper.includes('FÍSICA') || areaUpper.includes('RACIOCÍNIO') || areaUpper.includes('QUÍMICA')) {
            card.classList.add('professor-exatas');
        } else if (areaUpper.includes('HISTÓRIA') || areaUpper.includes('SOCIOLOGIA') || areaUpper.includes('FILOSOFIA') || areaUpper.includes('GEOGRAFIA')) {
            card.classList.add('professor-humanas');
        } else if (areaUpper.includes('CIÊNCIAS') || areaUpper.includes('BIOLOGIA') || areaUpper.includes('EDUCAÇÃO AMBIENTAL')) {
            card.classList.add('professor-ciencias');
        }
        
        // Se tem foto, adiciona tratamento de erro
        if (temFoto) {
            const avatarImg = card.querySelector('.professor-foto-real');
            if (avatarImg) {
                avatarImg.addEventListener('error', function() {
                    // Se a foto falhar, mostra as iniciais
                    const avatarDiv = this.parentElement;
                    avatarDiv.classList.remove('has-foto');
                    avatarDiv.classList.add('no-foto');
                    avatarDiv.innerHTML = iniciais;
                });
            }
        }
        
        return card;
    }
    
    // Filtra professores por disciplina
    filtroDisciplina.addEventListener('change', async function() {
        try {
            const professores = await fetchData('HORARIOS', 'PROFESSORES');
            const professoresProcessados = processarProfessores(professores);
            
            if (this.value === 'all') {
                exibirProfessores(professoresProcessados);
            } else {
                const filtrados = professoresProcessados.filter(prof => {
                    const disciplinas = [
                        prof['DISCIPLINA 01'],
                        prof['DISCIPLINA 02'],
                        prof['DISCIPLINA 03'],
                        prof['DISCIPLINA 04'],
                        prof['DISCIPLINA 05'],
                        prof['DISCIPLINA 06'],
                        prof['DISCIPLINA 07'],
                        prof['DISCIPLINA 08']
                    ];
                    return disciplinas.some(d => d && d.trim() === this.value);
                });
                
                exibirProfessores(filtrados);
            }
        } catch (error) {
            console.error('Erro ao filtrar professores:', error);
            professoresContainer.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao filtrar professores.</p>
                    <p><small>${error.message}</small></p>
                </div>
            `;
        }
    });
    
    // Mensagem sem professores
    function mostrarSemProfessores() {
        professoresContainer.innerHTML = `
            <div class="sem-dados">
                <i class="fas fa-user-graduate fa-3x"></i>
                <p>Nenhum professor cadastrado.</p>
                <p><small>Adicione professores na aba PROFESSORES da planilha HORARIOS</small></p>
            </div>
        `;
    }
    
    // Inicializa
    init();
});