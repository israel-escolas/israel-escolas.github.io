const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrNeP4anjnsFOS9SsA4RjiAnzsbLgGHwhbH3ds8_X_mp8XTBTOAP5IOcWvk3YCZCA/exec';
var inscrevendo = false;

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

function enviarInscricaoParaPlanilha(dados, callback) {
    mostrarCarregando('Salvando...');
    
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
    if (!validarTelefone(telefone)) { mostrarErro('Telefone inválido.'); return; }
    if (!escola) { mostrarErro('Informe a escola.'); return; }
    if (!oficina) { mostrarErro('Selecione uma oficina.'); return; }
    if (!horario) { mostrarErro('Selecione um horário.'); return; }
    if (isNaN(qtd) || qtd < 1 || qtd > 50) { mostrarErro('Quantidade: 1 a 50.'); return; }
    
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
            mostrarErro(r.erro || 'Erro na inscrição.');
            return;
        }
        
        document.getElementById('conf-nome').textContent = nome;
        document.getElementById('conf-telefone').textContent = formatarTelefone(telefone);
        document.getElementById('conf-escola').textContent = escola;
        document.getElementById('conf-participantes').textContent = qtd;
        document.getElementById('conf-oficina').textContent = oficina;
        document.getElementById('conf-horario').textContent = horario;
        document.getElementById('conf-data').textContent = '25 de Junho de 2026';
        document.getElementById('conf-id').textContent = 'FEIRA2026-' + Date.now().toString(36).toUpperCase().slice(-6);
        
        fecharModal();
        
        setTimeout(function() {
            var m = document.getElementById('modal-confirmacao');
            if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
        }, 300);
        
        mostrarSucesso('✅ Inscrição confirmada!');
    });
}

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
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { fecharModal(); fecharConfirmacao(); }
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
    
    mostrarCarregando('Gerando...');
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

function atualizarBotoesOficina() {
    var botoes = document.querySelectorAll('.science-btn');
    var lib = new Date(2026, 5, 16);
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

setInterval(atualizarBotoesOficina, 60000);

document.addEventListener('DOMContentLoaded', function() {
    initModalOficinas();
    atualizarBotoesOficina();
});

window.abrirModalOficina = abrirModalOficina;
window.fecharModal = fecharModal;
window.fecharConfirmacao = fecharConfirmacao;
window.inscreverOficina = inscreverOficina;
window.salvarInscricao = salvarInscricao;