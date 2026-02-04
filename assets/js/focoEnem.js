// ============================================
// FOCO ENEM - Funcionalidades da Página ENEM
// Página: focoEnem.html
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ FOCO ENEM carregado para focoEnem.html');
    
    // ================================
    // 1. ACCORDION PARA CONTEÚDOS
    // ================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const item = this.parentElement;
                const wasActive = item.classList.contains('active');
                
                // Fecha todos os outros accordions
                document.querySelectorAll('.accordion-item').forEach(el => {
                    el.classList.remove('active');
                });
                
                // Se não estava aberto, abre
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });
        
        // Abre o primeiro accordion por padrão
        if (accordionHeaders[0]) {
            accordionHeaders[0].parentElement.classList.add('active');
        }
    }
    
    // ================================
    // 2. CONTADOR REGRESSIVO ENEM 2026
    // ================================
    function criarContadorENEM() {
        // Data estimada do ENEM 2026: primeiro sábado de novembro
        const dataENEM2026 = new Date('2026-11-01T13:00:00'); // 7 de novembro de 2026
        const agora = new Date();
        const diferenca = dataENEM2026 - agora;
        
        // Se já passou, mostra mensagem
        if (diferenca <= 0) {
            return '<div class="contador-enem">ENEM 2026 já realizado!</div>';
        }
        
        // Calcula dias, horas, minutos, segundos
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
        
        return `
            <div class="contador-enem">
                <div class="contador-item">
                    <span class="contador-numero">${dias}</span>
                    <span class="contador-label">dias</span>
                </div>
                <div class="contador-item">
                    <span class="contador-numero">${horas}</span>
                    <span class="contador-label">horas</span>
                </div>
                <div class="contador-item">
                    <span class="contador-numero">${minutos}</span>
                    <span class="contador-label">min</span>
                </div>
                <div class="contador-item">
                    <span class="contador-numero">${segundos}</span>
                    <span class="contador-label">seg</span>
                </div>
            </div>
        `;
    }
    
    // Adiciona contador na página
    function adicionarContador() {
        const heroInfo = document.querySelector('.hero-info');
        if (heroInfo) {
            const contadorHTML = criarContadorENEM();
            
            // Cria container para o contador
            const contadorContainer = document.createElement('div');
            contadorContainer.className = 'contador-container';
            contadorContainer.innerHTML = contadorHTML;
            
            // Insere depois do hero-info
            heroInfo.parentNode.insertBefore(contadorContainer, heroInfo.nextSibling);
            
            // Atualiza contador a cada segundo
            setInterval(() => {
                contadorContainer.innerHTML = criarContadorENEM();
            }, 1000);
        }
    }
    
    // Chama função para adicionar contador
    adicionarContador();
    
    // ================================
    // 3. INTERAÇÃO COM MATERIAIS
    // ================================
    const materialCards = document.querySelectorAll('.material-card');
    
    materialCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Se clicar no link, deixa seguir normalmente
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                return;
            }
            
            // Pulsa o card quando clicado
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // ================================
    // 4. DICAS INTERATIVAS
    // ================================
    const dicaCards = document.querySelectorAll('.dica-card');
    
    dicaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // ================================
    // 5. LINKS COM CONFIRMAÇÃO
    // ================================
    const linksExternos = document.querySelectorAll('a[target="_blank"]');
    
    linksExternos.forEach(link => {
        link.addEventListener('click', function(e) {
            // Para os links principais, não pedir confirmação toda hora
            if (this.classList.contains('material-btn') || 
                this.classList.contains('redacao-btn') ||
                this.classList.contains('link-card')) {
                
                const siteNome = this.querySelector('h3')?.textContent || 
                                this.textContent.trim() || 
                                'site externo';
                
                const confirmar = confirm(`Você está saindo do site da escola e será redirecionado para:\n\n${siteNome}\n\nDeseja continuar?`);
                
                if (!confirmar) {
                    e.preventDefault();
                    return false;
                }
            }
        });
    });
    
    // ================================
    // 6. SCROLL SUAVE PARA SEÇÕES
    // ================================
    const linksInternos = document.querySelectorAll('a[href^="#"]');
    
    linksInternos.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ================================
    // 7. BOTÃO VOLTAR AO TOPO
    // ================================
    function criarBotaoTopo() {
        const botaoTopo = document.createElement('button');
        botaoTopo.className = 'botao-topo-enem';
        botaoTopo.innerHTML = '<i class="fas fa-arrow-up"></i>';
        botaoTopo.title = 'Voltar ao topo';
        
        document.body.appendChild(botaoTopo);
        
        // Mostra/oculta ao rolar
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                botaoTopo.classList.add('visivel');
            } else {
                botaoTopo.classList.remove('visivel');
            }
        });
        
        // Clique para voltar ao topo
        botaoTopo.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    criarBotaoTopo();
    
    // ================================
    // 8. SALVAR LINKS VISITADOS
    // ================================
    function salvarLinkVisitado(url) {
        const linksVisitados = JSON.parse(localStorage.getItem('enem_links_visitados') || '[]');
        
        if (!linksVisitados.includes(url)) {
            linksVisitados.push(url);
            localStorage.setItem('enem_links_visitados', JSON.stringify(linksVisitados));
        }
    }
    
    // Marca links como visitados
    linksExternos.forEach(link => {
        link.addEventListener('click', function() {
            salvarLinkVisitado(this.href);
        });
    });
});

// ================================
// ADICIONA CSS DINÂMICO
// ================================
function adicionarCSSFocoEnem() {
    const style = document.createElement('style');
    style.textContent = `
        /* Contador ENEM */
        .contador-container {
            margin: 30px auto;
            max-width: 600px;
        }
        
        .contador-enem {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        
        .contador-item {
            background: linear-gradient(135deg, #8e44ad 0%, #732d91 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            text-align: center;
            min-width: 80px;
            box-shadow: 0 5px 15px rgba(142, 68, 173, 0.3);
        }
        
        .contador-numero {
            display: block;
            font-size: 2rem;
            font-weight: bold;
        }
        
        .contador-label {
            font-size: 0.9rem;
            opacity: 0.9;
            text-transform: uppercase;
        }
        
        /* Botão voltar ao topo */
        .botao-topo-enem {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8e44ad 0%, #732d91 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .botao-topo-enem.visivel {
            opacity: 1;
            transform: translateY(0);
        }
        
        .botao-topo-enem:hover {
            background: linear-gradient(135deg, #732d91 0%, #5b2372 100%);
            transform: translateY(-3px);
        }
        
        /* Animações para cards */
        .material-card,
        .dica-card,
        .link-card,
        .dica-final {
            transition: all 0.3s ease;
        }
        
        /* Progresso visual nos links visitados */
        a[target="_blank"]:visited .material-icon {
            opacity: 0.7;
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
            .contador-enem {
                gap: 10px;
            }
            
            .contador-item {
                min-width: 70px;
                padding: 12px 15px;
            }
            
            .contador-numero {
                font-size: 1.5rem;
            }
            
            .botao-topo-enem {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
        
        @media (max-width: 480px) {
            .contador-item {
                min-width: 60px;
                padding: 10px 12px;
            }
            
            .contador-numero {
                font-size: 1.3rem;
            }
            
            .contador-label {
                font-size: 0.8rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Adiciona CSS quando página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adicionarCSSFocoEnem);
} else {
    adicionarCSSFocoEnem();
}

console.log('🚀 FOCO ENEM.js configurado para focoEnem.html');