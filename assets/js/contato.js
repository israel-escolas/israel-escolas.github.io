// ================================
// CONTATO.JS
// Formulário de contato via WhatsApp
// Compatível com GitHub Pages
// ================================

document.addEventListener('DOMContentLoaded', function () {

    const formContato = document.getElementById('formContato');
    if (!formContato) return; // evita conflito se não estiver na página

    const telefoneWhatsApp = "5584999746224";

    const modalConfirmacao = document.getElementById('modalConfirmacao');
    const fecharModalBtn = document.getElementById('fecharModal');

    // ================================
    // ENVIO DO FORMULÁRIO
    // ================================
    formContato.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const assunto = document.getElementById('assunto').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        // Validação básica
        if (!nome || !mensagem || !assunto) {
            alert('Por favor, preencha os campos obrigatórios.');
            return;
        }

        // Montar mensagem do WhatsApp
        const textoWhatsApp =
`📩 *Novo contato pelo site*
🏫 *Escola Estadual Mariana Cavalcanti*

👤 *Nome:* ${nome}
📧 *E-mail:* ${email || 'Não informado'}
📞 *Telefone:* ${telefone || 'Não informado'}
🏷️ *Assunto:* ${assunto}

💬 *Mensagem:*
${mensagem}`;

        const textoCodificado = encodeURIComponent(textoWhatsApp);

        // Abrir WhatsApp
        window.open(
            `https://wa.me/${telefoneWhatsApp}?text=${textoCodificado}`,
            '_blank'
        );

        // Mostrar modal de confirmação
        abrirModalConfirmacao();

        // Limpar formulário
        formContato.reset();
    });

    // ================================
    // MODAL
    // ================================
    function abrirModalConfirmacao() {
        if (modalConfirmacao) {
            modalConfirmacao.classList.add('ativo');
        }
    }

    function fecharModalConfirmacao() {
        if (modalConfirmacao) {
            modalConfirmacao.classList.remove('ativo');
        }
    }

    if (fecharModalBtn) {
        fecharModalBtn.addEventListener('click', fecharModalConfirmacao);
    }

    // Fechar modal clicando fora
    if (modalConfirmacao) {
        modalConfirmacao.addEventListener('click', function (event) {
            if (event.target === modalConfirmacao) {
                fecharModalConfirmacao();
            }
        });
    }

    // ================================
    // MÁSCARA DE TELEFONE (BR)
    // ================================
    const inputTelefone = document.getElementById('telefone');

    if (inputTelefone) {
        inputTelefone.addEventListener('input', function (event) {
            let valor = event.target.value.replace(/\D/g, '');

            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            if (valor.length > 10) {
                valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (valor.length > 6) {
                valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (valor.length > 2) {
                valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                valor = valor.replace(/(\d*)/, '($1');
            }

            event.target.value = valor;
        });
    }

});
