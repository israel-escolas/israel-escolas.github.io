// ============================================
// LABORATÓRIO VIRTUAL - FUNCIONALIDADES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. INICIALIZAÇÃO
    inicializarLaboratorioVirtual();
    atualizarAnoAtual();
    
    // 2. FILTRO POR DISCIPLINA
    const botoesDisciplinas = document.querySelectorAll('.disciplina-btn');
    const categorias = document.querySelectorAll('.disciplina-categoria');
    const mensagemVazia = document.getElementById('nenhuma-simulacao');
    
    botoesDisciplinas.forEach(botao => {
        botao.addEventListener('click', function() {
            // Ativar botão clicado
            botoesDisciplinas.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const disciplinaSelecionada = this.dataset.disciplina;
            let temResultados = false;
            
            // Mostrar/ocultar categorias
            if (disciplinaSelecionada === 'todas') {
                categorias.forEach(cat => {
                    cat.style.display = 'block';
                    cat.classList.add('active');
                    temResultados = true;
                });
            } else {
                categorias.forEach(cat => {
                    if (cat.id === disciplinaSelecionada) {
                        cat.style.display = 'block';
                        cat.classList.add('active');
                        temResultados = true;
                    } else {
                        cat.style.display = 'none';
                        cat.classList.remove('active');
                    }
                });
            }
            
            // Mostrar mensagem se não houver resultados
            mensagemVazia.style.display = temResultados ? 'none' : 'block';
            
            // Adicionar efeito visual
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 3. BUSCA DE SIMULAÇÕES
    const inputBusca = document.getElementById('search-simulacoes');
    const btnBusca = document.querySelector('.search-box button');
    
    function buscarSimulacoes() {
        const termo = inputBusca.value.toLowerCase().trim();
        const todasSimulacoes = document.querySelectorAll('.simulacao-card');
        let resultadosEncontrados = 0;
        
        todasSimulacoes.forEach(card => {
            const titulo = card.querySelector('h3').textContent.toLowerCase();
            const descricao = card.querySelector('.descricao').textContent.toLowerCase();
            const disciplina = card.dataset.disciplina;
            
            if (termo === '' || titulo.includes(termo) || descricao.includes(termo)) {
                card.style.display = 'flex';
                card.classList.add('filtro-ativo');
                resultadosEncontrados++;
                
                // Remover animação após 2 segundos
                setTimeout(() => {
                    card.classList.remove('filtro-ativo');
                }, 2000);
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar mensagem de nenhum resultado
        mensagemVazia.style.display = resultadosEncontrados > 0 ? 'none' : 'block';
        
        // Atualizar contadores
        atualizarContadores();
    }
    
    // Event listeners para busca
    inputBusca.addEventListener('input', buscarSimulacoes);
    btnBusca.addEventListener('click', buscarSimulacoes);
    
    // Buscar ao pressionar Enter
    inputBusca.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarSimulacoes();
        }
    });
    
    // 4. MODAL DE DETALHES
    const modal = document.getElementById('modal-detalhes');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescricao = document.getElementById('modal-descricao');
    const modalIframe = document.getElementById('modal-iframe');
    const modalTempo = document.getElementById('modal-tempo');
    const modalNivel = document.getElementById('modal-nivel');
    const modalPublico = document.getElementById('modal-publico');
    const modalBtnJogar = document.getElementById('modal-btn-jogar');
    const closeModal = document.querySelector('.close-modal');
    
    // Dados das simulações (nível e público-alvo)
    const dadosSimulacoes = {
        'Monte o Átomo': { nivel: 'Fundamental', tempo: '15-20 min', publico: '6º ao 9º ano' },
        'Monte a Molécula': { nivel: 'Médio', tempo: '20-25 min', publico: '8º ano ao Ensino Médio' },
        'Densidade': { nivel: 'Fundamental', tempo: '15 min', publico: '6º ao 8º ano' },
        'Escala de pH': { nivel: 'Médio', tempo: '20 min', publico: '8º ano ao Ensino Médio' },
        'Dados de Projéteis': { nivel: 'Médio', tempo: '25-30 min', publico: 'Ensino Médio' },
        'Balançando': { nivel: 'Fundamental', tempo: '15 min', publico: '6º ao 8º ano' },
        'Forças e Movimento': { nivel: 'Médio', tempo: '20-25 min', publico: '9º ano ao Ensino Médio' },
        'Circuito Elétrico': { nivel: 'Avançado', tempo: '30-40 min', publico: 'Ensino Médio' },
        'Introdução às Frações': { nivel: 'Fundamental', tempo: '20 min', publico: '5º ao 7º ano' },
        'Geometria Plana': { nivel: 'Fundamental', tempo: '15-20 min', publico: '6º ao 8º ano' },
        'Criador de Gráficos': { nivel: 'Médio', tempo: '25 min', publico: '8º ano ao Ensino Médio' },
        'Seleção Natural': { nivel: 'Médio', tempo: '30 min', publico: '9º ano ao Ensino Médio' },
        'Neurônio: Um Impulso Nervoso': { nivel: 'Avançado', tempo: '30-35 min', publico: 'Ensino Médio' },
        'Previsão do Tempo': { nivel: 'Médio', tempo: '20 min', publico: '7º ao 9º ano' }
    };
    
    // Botões "Detalhes"
    document.querySelectorAll('.btn-info').forEach(btn => {
        btn.addEventListener('click', function() {
            const titulo = this.dataset.titulo;
            const descricao = this.dataset.descricao;
            const url = this.closest('.simulacao-card').querySelector('iframe').src;
            
            // Preencher modal
            modalTitulo.textContent = titulo;
            modalDescricao.textContent = descricao;
            modalIframe.src = url;
            
            // Preencher informações adicionais
            const dados = dadosSimulacoes[titulo] || { nivel: 'Fundamental', tempo: '15-20 min', publico: '6º ao 9º ano' };
            modalTempo.textContent = dados.tempo;
            modalNivel.textContent = dados.nivel;
            modalPublico.textContent = dados.publico;
            
            // Configurar botão "Iniciar Simulação"
            modalBtnJogar.onclick = function() {
                window.open(url, '_blank');
            };
            
            // Mostrar modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Botões "Jogar Agora"
    document.querySelectorAll('.btn-jogar').forEach(btn => {
        btn.addEventListener('click', function() {
            const url = this.dataset.url;
            window.open(url, '_blank');
        });
    });
    
    // Fechar modal
    closeModal.addEventListener('click', fecharModal);
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModal();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            fecharModal();
        }
    });
    
    // 5. FUNÇÕES AUXILIARES
    function inicializarLaboratorioVirtual() {
        console.log('Laboratório Virtual inicializado!');
        atualizarContadores();
    }
    
    function atualizarAnoAtual() {
        document.getElementById('ano-atual').textContent = new Date().getFullYear();
    }
    
    function atualizarContadores() {
        const categorias = document.querySelectorAll('.disciplina-categoria');
        
        categorias.forEach(categoria => {
            const grid = categoria.querySelector('.simulacoes-grid');
            const cardsVisiveis = grid.querySelectorAll('.simulacao-card[style=""]').length + 
                                 grid.querySelectorAll('.simulacao-card:not([style])').length;
            const contador = categoria.querySelector('.contador');
            
            if (contador) {
                contador.textContent = `${cardsVisiveis} simulação${cardsVisiveis !== 1 ? 'ões' : ''}`;
            }
        });
    }
    
    function fecharModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        modalIframe.src = ''; // Limpar iframe para parar animações
    }
    
    // 6. ANIMAÇÃO DE ENTRADA
    const cards = document.querySelectorAll('.simulacao-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // 7. OTIMIZAÇÃO DE PERFORMANCE PARA IFRAMES
    function carregarIframesAposScroll() {
        const iframes = document.querySelectorAll('.iframe-container iframe');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (!iframe.dataset.loaded) {
                        iframe.src = iframe.dataset.src || iframe.src;
                        iframe.dataset.loaded = true;
                    }
                }
            });
        }, { threshold: 0.1 });
        
        iframes.forEach(iframe => {
            if (!iframe.src.includes('phet.colorado.edu')) {
                iframe.dataset.src = iframe.src;
                iframe.src = '';
                observer.observe(iframe);
            }
        });
    }
    
    // Iniciar carregamento lazy
    setTimeout(carregarIframesAposScroll, 1000);
});

// Adicionar classe para animação
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
    }
`;
document.head.appendChild(style);