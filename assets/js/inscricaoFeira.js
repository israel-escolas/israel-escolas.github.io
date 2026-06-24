// ============================================
// FEIRA DE CIÊNCIAS 2026 - INSCRIÇÕES
// Controle de inscrições, planilha e cards de oficinas
// ============================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrNeP4anjnsFOS9SsA4RjiAnzsbLgGHwhbH3ds8_X_mp8XTBTOAP5IOcWvk3YCZCA/exec';
var inscrevendo = false;

// ============================================
// BANCO DE DADOS DAS OFICINAS
// Para adicionar nova oficina: adicione um objeto no array abaixo
// ============================================
const oficinas = [
    {
        id: '01',
        titulo: 'Construção do Carrinho Potencial',
        professor: 'Solange Batista ',
        estudantes: [
            'João Gabriel Nunes de Oliveira',
            'José Davi Alves da Silva',
            'Maria Vivia da Silva Santos',
            'Thalles Gabriel Fernandes Nunes',
            'Thamyris Crystina de Oliveira Santos'
        ],
        publicoAlvo: {
            'Ensino Médio': false,
            'Ensino Fundamental': true,
            'Comunidade': false
        },
        descricao: 'Nesta oficina, os participantes irão construir um carrinho movido exclusivamente por energia potencial, utilizando materiais simples e de baixo custo. O experimento demonstra na prática como a energia potencial gravitacional se transforma em energia cinética, permitindo que o carrinho se mova sem motor ou pilhas. Durante a atividade, serão explorados conceitos fundamentais da Física, como a Lei da Conservação de Energia, que explica que a energia não pode ser criada nem destruída, apenas transformada. Os participantes entenderão como a altura da rampa (energia potencial) influencia diretamente na velocidade do carrinho (energia cinética), e como o atrito dissipa parte dessa energia em forma de calor. Ao final, cada participante terá construído seu próprio carrinho e compreendido, de forma divertida e interativa, os princípios que regem o movimento e a energia no nosso dia a dia.'
    },
    {
        id: '02',
        titulo: 'Conservação de abelhas sem ferrão por meio de iscas sustentáveis com materiais recicláveis',
        professor: 'Weliton Andrade',
        estudantes: [
            'Júlio Cesar da Silva Feliciano',
            'Micaias Natanael Silva de Moura',
            'Wellington Samuel Alves da Silva'
        ],
        publicoAlvo: {
            'Ensino Médio': true,
            'Ensino Fundamental': true,
            'Comunidade': true
        },
        descricao: 'Você sabia que as abelhas sem ferrão são responsáveis pela polinização de até 90% das plantas nativas do Brasil? Nesta oficina, os participantes irão aprender sobre a importância vital desses pequenos polinizadores para a preservação da biodiversidade e produção de alimentos, além de descobrir como construir iscas sustentáveis utilizando garrafas PET recicladas para atrair e proteger novas colônias. A atividade aborda de forma prática: o papel ecológico das abelhas nativas, as principais ameaças que enfrentam (desmatamento, agrotóxicos e mudanças climáticas), e o passo a passo completo para confecção e instalação correta das iscas. Serão apresentados também os resultados reais do monitoramento feito pelos estudantes, demonstrando como a ciência cidadã pode contribuir para a conservação ambiental. Cada participante sairá da oficina com o conhecimento e as habilidades necessárias para se tornar um protetor das abelhas nativas em sua própria comunidade.'
    },
    {
        id: '03',
        titulo: 'Papel Reciclado: Produção de Papel a Partir do Reaproveitamento de Resíduos de Papel',
        professor: 'Israel Lázaro',
        estudantes: [
            'Ana Talita Soares de Santana',
            'Clarice Emanuely da Silva Oliveira',
            'Emilly de Almeida Soares'
        ],
        publicoAlvo: {
            'Ensino Médio': true,
            'Ensino Fundamental': true,
            'Comunidade': true
        },
        descricao: 'Nesta oficina, os participantes aprenderão, de forma prática, como transformar papel usado em novas folhas de papel reciclado. A atividade envolve etapas como trituração, preparo da polpa e moldagem das folhas, permitindo compreender o processo de reciclagem e sua importância para a redução de resíduos e a preservação dos recursos naturais. A oficina busca incentivar hábitos sustentáveis e a conscientização ambiental.'
    },
    {
        id: '04',
        titulo: 'Bomba de Sementes',
        professor: 'Sebastião de Alencar Neto',
        estudantes: [
            'Maria Allyce Nunes Brito',
            'Ana Alícia Jácome da Silva',
            'Murilo Arthur de Arraújo Barbosa',
            'Guilherme Libanio da Rocha Neto'
        ],
        publicoAlvo: {
            'Ensino Médio': true,
            'Ensino Fundamental': true,
            'Comunidade': true
        },
        descricao: 'A oficina de produção de bombas de sementes oferece uma alternativa de reflorestamento de áreas desertas e desperta a curiosidade para reconhecer espécies nativas e a importância do bioma caatinga.'
    },
    {
        id: '05',
        titulo: 'Foguetes de Garrafa PET - Princípios de Física na Prática',
        professor: 'Israel Lázaro',
        estudantes: [
            'Bruna Ismael de Oliveira',
            'Maria Gabriela da Silva Clementino',
            'Caio Frutuoso da Silva',
            'Thays Soares Santana'
        ],
        publicoAlvo: {
            'Ensino Médio': true,
            'Ensino Fundamental': true,
            'Comunidade': false
        },
        descricao: 'Nesta oficina, os participantes aprenderão, de forma prática, como construir e lançar foguetes utilizando garrafas PET, explorando princípios fundamentais da Física como pressão, propulsão e leis de Newton. A atividade demonstra conceitos de lançamento de projéteis, aerodinâmica e transformação de energia de maneira divertida e interativa.'
    },
    {
        id: '06',
        titulo: 'Dança: Movimento que Acalma e Causa Bem-Estar',
        professor: 'Solange Batista e Cristiany Sheyla ',
        estudantes: [
            'Carlos Emanuel Ferreira',
            'Ana Vitoria da Silva Alvilino'
        ],
        publicoAlvo: {
            'Ensino Médio': true,
            'Ensino Fundamental': true,
            'Comunidade': true
        },
        descricao: 'A oficina "Dança: movimento que acalma e causa bem-estar" tem como objetivo demonstrar os benefícios da dança para a saúde física e emocional. Através da prática de movimento acompanhados por música, os participantes poderão observar como a dança ajuda a reduzir o estresse, melhorar o humor e promover a sensação de relaxamento. Além de ser uma atividade divertida, a dança contribui para o bem-estar, a socialização e a qualidade de vida, mostrando que o movimento é uma importante ferramenta para manter o equilíbrio entre o corpo e mente.'
    },
    {
        id: '07',
        titulo: 'Redação Nota 1000',
        professor: 'Maria Cecília',
        estudantes: [
            'Ana Júlia da Silva Cipriano',
            'Maria Luiza Gomes da Silva',
            'Zayna Zaara Oliveira Nunes',
            'Ingrid Eloa Ferreira da Silva',
            'Josicleide Araújo de Sousa',
            'Thays Soares Santana'
        ],
        publicoAlvo: {
            'Ensino Médio': true,
            'Ensino Fundamental': false,
            'Comunidade': true
        },
        descricao: 'Trata-se de uma aula dinâmica sobre a produção de redação para o Enem, considerando as 5 competências exigidas pelo concurso, com o objetivo de apresentar em 4 passos a fórmula perfeita para uma redação nota 1000. Será utilizado o projetor.'
    }
];

// ============================================
// API DA PLANILHA GOOGLE
// ============================================
function chamarAPI(params, callback) {
    var cb = 'jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    
    window[cb] = function(data) {
        callback(data);
        delete window[cb];
        var s = document.getElementById(cb);
        if (s) s.remove();
    };
    
    var url = SCRIPT_URL + '?callback=' + cb;
    for (var k in params) {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
            url += '&' + k + '=' + encodeURIComponent(params[k]);
        }
    }
    
    var script = document.createElement('script');
    script.id = cb;
    script.src = url;
    script.onerror = function() {
        callback({ error: 'Erro de conexão', sucesso: false });
        delete window[cb];
        script.remove();
    };
    document.body.appendChild(script);
}

function carregarOficinasDaPlanilha() {
    var select = document.getElementById('oficina');
    if (!select) return;
    
    select.innerHTML = '<option value="">🔄 Carregando...</option>';
    select.disabled = true;
    
    chamarAPI({ action: 'listarOficinas' }, function(data) {
        select.disabled = false;
        
        if (data.error) {
            select.innerHTML = '<option value="">❌ ' + data.error + '</option>';
            return;
        }
        
        if (data.oficinas && data.oficinas.length > 0) {
            select.innerHTML = '<option value="">Escolha uma oficina...</option>';
            
            data.oficinas.forEach(function(of) {
                var opt = document.createElement('option');
                opt.value = of.titulo;
                if (of.horarios && of.horarios.length > 0) {
                    opt.dataset.horarios = JSON.stringify(of.horarios);
                }
                
                if (of.disponivel) {
                    opt.textContent = '🔬 ' + of.titulo + ' (' + of.vagasDisponiveis + '/' + of.vagas + ' vagas)';
                } else {
                    opt.textContent = '🚫 ' + of.titulo + ' (ESGOTADO)';
                    opt.disabled = true;
                }
                select.appendChild(opt);
            });
            
            select.onchange = function() {
                var sel = this.options[this.selectedIndex];
                var grid = document.getElementById('horarios-grid');
                document.getElementById('horario-selecionado').value = '';
                
                if (sel.dataset.horarios) {
                    var horarios = JSON.parse(sel.dataset.horarios);
                    grid.innerHTML = '';
                    
                    if (horarios.length === 0) {
                        grid.innerHTML = '<p style="color:#999;text-align:center;width:100%;">Sem horários</p>';
                        return;
                    }
                    
                    horarios.forEach(function(h) {
                        var div = document.createElement('div');
                        div.className = 'horario-option';
                        div.textContent = h;
                        div.onclick = function() {
                            document.querySelectorAll('.horario-option').forEach(function(o) {
                                o.classList.remove('selected');
                            });
                            this.classList.add('selected');
                            document.getElementById('horario-selecionado').value = h;
                        };
                        grid.appendChild(div);
                    });
                } else {
                    grid.innerHTML = '<p style="color:#999;text-align:center;width:100%;">Selecione uma oficina</p>';
                }
            };
        } else {
            select.innerHTML = '<option value="">⚠️ Nenhuma oficina</option>';
        }
    });
}

// ============================================
// VALIDAÇÕES E FORMATAÇÕES
// ============================================
function validarTelefone(t) {
    var n = t.replace(/\D/g, '');
    return n.length >= 10 && n.length <= 11;
}

function formatarTelefone(t) {
    var n = t.replace(/\D/g, '');
    if (n.length === 11) return '(' + n.slice(0,2) + ') ' + n.slice(2,7) + '-' + n.slice(7);
    if (n.length === 10) return '(' + n.slice(0,2) + ') ' + n.slice(2,6) + '-' + n.slice(6);
    return t;
}

function initMascaraTelefone() {
    var input = document.getElementById('telefone-contato');
    if (!input) return;
    
    input.addEventListener('input', function(e) {
        var v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        
        if (v.length > 0) {
            if (v.length <= 2) v = '(' + v;
            else if (v.length <= 7) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
            else v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
        }
        e.target.value = v;
    });
}

// ============================================
// INSCRIÇÃO NA OFICINA
// ============================================
function enviarInscricaoParaPlanilha(dados, callback) {
    mostrarCarregando('Salvando inscrição...');
    
    chamarAPI({
        action: 'inscrever',
        nome: dados.nome,
        quantidade: dados.qtdParticipantes,
        escola: dados.escola,
        oficina: dados.oficina,
        horario: dados.horario,
        contato: dados.telefone
    }, function(r) {
        removerCarregando();
        callback(r);
    });
}

function inscreverOficina() {
    if (inscrevendo) return;
    
    var nome = document.getElementById('nome-responsavel')?.value.trim();
    var telefone = document.getElementById('telefone-contato')?.value.trim();
    var escola = document.getElementById('escola')?.value.trim();
    var qtd = parseInt(document.getElementById('qtd-participantes')?.value) || 1;
    var oficina = document.getElementById('oficina')?.value;
    var horario = document.getElementById('horario-selecionado')?.value;
   
    if (!nome || nome.length < 3) { mostrarErro('Nome completo (mín. 3 caracteres).'); return; }
    if (!telefone) { mostrarErro('Telefone obrigatório.'); return; }
    if (!validarTelefone(telefone)) { mostrarErro('Telefone inválido. Use DDD + número.'); return; }
    if (!escola) { mostrarErro('Informe a escola.'); return; }
    if (!oficina) { mostrarErro('Selecione uma oficina.'); return; }
    if (!horario) { mostrarErro('Selecione um horário.'); return; }
    if (isNaN(qtd) || qtd < 1 || qtd > 50) { mostrarErro('Quantidade de participantes: 1 a 50.'); return; }
    
    inscrevendo = true;
    var btn = document.getElementById('btn-inscrever-submit');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    }
    
    enviarInscricaoParaPlanilha({
        nome: nome,
        qtdParticipantes: qtd,
        escola: escola,
        oficina: oficina,
        horario: horario,
        telefone: telefone
    }, function(r) {
        inscrevendo = false;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check"></i> Inscrever';
        }
        
        if (!r.sucesso) {
            mostrarErro(r.erro || 'Erro na inscrição. Tente novamente.');
            return;
        }
        
        document.getElementById('conf-nome').textContent = nome;
        document.getElementById('conf-telefone').textContent = formatarTelefone(telefone);
        document.getElementById('conf-escola').textContent = escola;
        document.getElementById('conf-participantes').textContent = qtd;
        document.getElementById('conf-oficina').textContent = oficina;
        document.getElementById('conf-horario').textContent = horario;
        document.getElementById('conf-data').textContent = '30 de Junho de 2026';
        document.getElementById('conf-id').textContent = 'FEIRA2026-' + Date.now().toString(36).toUpperCase().slice(-6);
        
        fecharModal();
        
        setTimeout(function() {
            var m = document.getElementById('modal-confirmacao');
            if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
        }, 300);
        
        mostrarSucesso('✅ Inscrição confirmada com sucesso!');
    });
}

// ============================================
// MODAIS DE INSCRIÇÃO
// ============================================
function initModalOficinas() {
    var tipo = document.getElementById('tipo-inscricao');
    var qtd = document.getElementById('qtd-participantes');
    var grupo = document.getElementById('grupo-participantes');
    var naoEstuda = document.getElementById('nao-estuda');
    var escola = document.getElementById('escola');

    var btnInscrever = document.getElementById('btn-inscrever-submit');
    if (btnInscrever) {
        btnInscrever.addEventListener('click', function(e) {
            e.preventDefault();
            inscreverOficina();
        });
    }

    if (tipo && qtd && grupo) {
        tipo.addEventListener('change', function() {
            if (this.value === 'individual') {
                qtd.value = '1'; qtd.disabled = true; grupo.style.opacity = '0.6';
            } else {
                qtd.disabled = false; grupo.style.opacity = '1';
                if (qtd.value === '1') qtd.value = '5';
            }
        });
    }

    if (naoEstuda && escola) {
        naoEstuda.addEventListener('change', function() {
            if (this.checked) {
                escola.value = 'Não estuda'; escola.disabled = true; escola.style.opacity = '0.6';
            } else {
                escola.value = ''; escola.disabled = false; escola.style.opacity = '1';
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target === document.getElementById('modal-oficina')) fecharModal();
        if (e.target === document.getElementById('modal-confirmacao')) fecharConfirmacao();
        if (e.target === document.getElementById('modal-detalhes-oficina')) fecharModalDetalhes();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { 
            fecharModal(); 
            fecharConfirmacao(); 
            fecharModalDetalhes();
        }
    });
    
    initMascaraTelefone();
}

function abrirModalOficina() {
    var m = document.getElementById('modal-oficina');
    if (m) {
        m.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        carregarOficinasDaPlanilha();
        setTimeout(function() {
            var f = m.querySelector('input, select');
            if (f) f.focus();
        }, 100);
    }
}

function fecharModal() {
    var m = document.getElementById('modal-oficina');
    if (m) { m.style.display = 'none'; document.body.style.overflow = 'auto'; limparFormulario(); }
}

function fecharConfirmacao() {
    var m = document.getElementById('modal-confirmacao');
    if (m) { m.style.display = 'none'; document.body.style.overflow = 'auto'; }
}

function limparFormulario() {
    var f = document.getElementById('form-oficina');
    if (f) {
        f.reset();
        document.getElementById('qtd-participantes').value = '1';
        document.getElementById('horario-selecionado').value = '';
        document.querySelectorAll('.horario-option').forEach(function(o) { o.classList.remove('selected'); });
    }
}

function salvarInscricao() {
    var cartao = document.querySelector('.cartao-confirmacao');
    if (!cartao) return;
    
    if (typeof html2canvas === 'undefined') {
        window.print();
        return;
    }
    
    mostrarCarregando('Gerando comprovante...');
    var botoes = cartao.querySelector('.cartao-actions');
    var disp = botoes ? botoes.style.display : '';
    if (botoes) botoes.style.display = 'none';
    
    var overflowOriginal = cartao.style.overflow;
    var maxHeightOriginal = cartao.style.maxHeight;
    var heightOriginal = cartao.style.height;
    
    cartao.style.overflow = 'visible';
    cartao.style.maxHeight = 'none';
    cartao.style.height = 'auto';
    
    html2canvas(cartao, { 
        scale: 2, 
        backgroundColor: '#ffffff', 
        logging: false,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
    }).then(function(c) {
        cartao.style.overflow = overflowOriginal;
        cartao.style.maxHeight = maxHeightOriginal;
        cartao.style.height = heightOriginal;
        if (botoes) botoes.style.display = disp;
        
        removerCarregando();
        
        var id = document.getElementById('conf-id')?.textContent || 'inscricao';
        var a = document.createElement('a');
        a.download = 'comprovante-' + id.toLowerCase() + '.png';
        a.href = c.toDataURL('image/png');
        a.click();
        mostrarSucesso('✅ Comprovante salvo!');
    }).catch(function() {
        cartao.style.overflow = overflowOriginal;
        cartao.style.maxHeight = maxHeightOriginal;
        cartao.style.height = heightOriginal;
        if (botoes) botoes.style.display = disp;
        removerCarregando();
        window.print();
    });
}

// ============================================
// BOTÕES DE INSCRIÇÃO (CONTROLE DE DATA)
// ============================================
function atualizarBotoesOficina() {
    var botoes = document.querySelectorAll('.science-btn');
    var lib = new Date(2026, 5, 18); 
    var agora = new Date();
    
    botoes.forEach(function(b) {
        if (agora >= lib) {
            b.disabled = false;
            b.style.cursor = 'pointer';
            b.style.opacity = '1';
            b.className = 'science-btn btn-liberado';
            b.title = '✅ Inscrições abertas!';
            b.onclick = abrirModalOficina;
        } else {
            b.disabled = true;
            b.style.cursor = 'not-allowed';
            b.style.opacity = '0.6';
            b.className = 'science-btn btn-bloqueado';
            
            var diff = lib - agora;
            var d = Math.floor(diff / 86400000);
            var h = Math.floor((diff % 86400000) / 3600000);
            var m = Math.floor((diff % 3600000) / 60000);
            
            var msg = '🔒 Indisponível\n';
            if (d > 0) msg += 'Em ' + d + 'd ' + h + 'h';
            else if (h > 0) msg += 'Em ' + h + 'h';
            else msg += 'Em ' + m + 'min';
            
            b.title = msg;
        }
    });
}

// ============================================
// GERAÇÃO DINÂMICA DOS CARDS DE OFICINAS (ACCORDION)
// ============================================
function gerarCardsOficinas() {
    var container = document.querySelector('.oficinas-cards-wrapper');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (oficinas.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;width:100%;padding:20px;">Nenhuma oficina cadastrada ainda.</p>';
        return;
    }
    
    oficinas.forEach(function(oficina, index) {
        var publicos = [];
        for (var p in oficina.publicoAlvo) {
            if (oficina.publicoAlvo[p]) publicos.push(p);
        }
        var publicoTexto = publicos.length > 0 ? publicos.join(', ') : 'Todos os públicos';
        
        var accordion = document.createElement('div');
        accordion.className = 'oficina-accordion';
        
        accordion.innerHTML = 
            '<div class="oficina-accordion-header" data-index="' + index + '">' +
                '<div class="oficina-accordion-info">' +
                    '<span class="oficina-accordion-badge">Oficina ' + oficina.id + '</span>' +
                    '<h5>' + oficina.titulo + '</h5>' +
                '</div>' +
                '<div class="oficina-accordion-meta">' +
                    '<span><i class="fas fa-chalkboard-teacher"></i> ' + oficina.professor + '</span>' +
                    '<span><i class="fas fa-user-graduate"></i> ' + oficina.estudantes.length + ' estud.</span>' +
                '</div>' +
                '<i class="fas fa-chevron-down oficina-accordion-icon"></i>' +
            '</div>' +
            '<div class="oficina-accordion-body">' +
                '<div class="oficina-accordion-detalhes">' +
                    '<div class="detalhe-item">' +
                        '<strong><i class="fas fa-chalkboard-teacher"></i> Professor(a):</strong>' +
                        '<span>' + oficina.professor + '</span>' +
                    '</div>' +
                    '<div class="detalhe-item">' +
                        '<strong><i class="fas fa-users"></i> Equipe:</strong>' +
                        '<span>' + oficina.estudantes.join(', ') + '</span>' +
                    '</div>' +
                    '<div class="detalhe-item">' +
                        '<strong><i class="fas fa-bullseye"></i> Público-Alvo:</strong>' +
                        '<span>' + publicoTexto + '</span>' +
                    '</div>' +
                    '<div class="detalhe-item detalhe-descricao">' +
                        '<strong><i class="fas fa-align-left"></i> Descrição:</strong>' +
                        '<p>' + oficina.descricao + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
        
        container.appendChild(accordion);
    });
    
    // Adiciona evento de clique para expandir/recolher
    document.querySelectorAll('.oficina-accordion-header').forEach(function(header) {
        header.addEventListener('click', function() {
            var accordion = this.parentElement;
            var isActive = accordion.classList.contains('active');
            
            // Fecha todos os outros
            document.querySelectorAll('.oficina-accordion').forEach(function(item) {
                item.classList.remove('active');
            });
            
            // Abre o clicado (se não estava ativo)
            if (!isActive) {
                accordion.classList.add('active');
            }
        });
    });
}

// ============================================
// MODAL DE DETALHES DA OFICINA
// ============================================
document.addEventListener('click', function(event) {
    if (event.target.closest('.btn-detalhes-oficina')) {
        var card = event.target.closest('.oficina-card');
        if (!card) return;
        var index = parseInt(card.getAttribute('data-oficina-index'));
        abrirModalDetalhes(index);
    }
});

function abrirModalDetalhes(index) {
    var modal = document.getElementById('modal-detalhes-oficina');
    if (!modal) return;
    
    var dadosOficina = oficinas[index];
    if (!dadosOficina) return;
    
    preencherModalDetalhes(dadosOficina);
    modal.classList.add('visivel');
    document.body.style.overflow = 'hidden';
}

function fecharModalDetalhes() {
    var modal = document.getElementById('modal-detalhes-oficina');
    if (modal) {
        modal.classList.remove('visivel');
        document.body.style.overflow = '';
    }
}

function preencherModalDetalhes(dados) {
    var container = document.getElementById('detalhes-oficina-conteudo');
    if (!container || !dados) return;
    
    var estudantesHtml = dados.estudantes
        .map(function(nome) { return '<li><i class="fas fa-user-graduate"></i> ' + nome + '</li>'; })
        .join('');
    
    var publicoAlvoHtml = '';
    for (var p in dados.publicoAlvo) {
        if (dados.publicoAlvo[p]) {
            publicoAlvoHtml += '<span class="publico-tag">' + p + '</span>';
        }
    }
    
    container.innerHTML = 
        '<div class="detalhes-oficina-header">' +
            '<h3>' + dados.titulo + '</h3>' +
            '<span class="detalhes-badge-oficina">Oficina ' + dados.id + '</span>' +
        '</div>' +
        '<div class="detalhes-secao">' +
            '<h4><i class="fas fa-chalkboard-teacher"></i> Professor(a) Orientador(a)</h4>' +
            '<p class="detalhes-prof-nome">' + dados.professor + '</p>' +
        '</div>' +
        '<div class="detalhes-secao">' +
            '<h4><i class="fas fa-users"></i> Equipe de Estudantes</h4>' +
            '<ul class="detalhes-lista-estudantes">' + estudantesHtml + '</ul>' +
        '</div>' +
        '<div class="detalhes-secao">' +
            '<h4><i class="fas fa-bullseye"></i> Público-Alvo</h4>' +
            '<div class="detalhes-publico-alvo">' + (publicoAlvoHtml || '<p>Público não especificado.</p>') + '</div>' +
        '</div>' +
        '<div class="detalhes-secao detalhes-descricao">' +
            '<h4><i class="fas fa-align-left"></i> Descrição das Atividades</h4>' +
            '<p>' + dados.descricao + '</p>' +
        '</div>';
}

// ============================================
// INICIALIZAÇÃO
// ============================================
setInterval(atualizarBotoesOficina, 60000);

document.addEventListener('DOMContentLoaded', function() {
    gerarCardsOficinas();
    initModalOficinas();
    atualizarBotoesOficina();
});

// ============================================
// EXPORTAÇÃO GLOBAL
// ============================================
window.abrirModalOficina = abrirModalOficina;
window.fecharModal = fecharModal;
window.fecharConfirmacao = fecharConfirmacao;
window.fecharModalDetalhes = fecharModalDetalhes;
window.inscreverOficina = inscreverOficina;
window.salvarInscricao = salvarInscricao;
window.gerarCardsOficinas = gerarCardsOficinas;