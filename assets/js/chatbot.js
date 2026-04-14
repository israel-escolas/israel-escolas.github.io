/**
 * CHATBOT COMPLETO - ESCOLA MARIANA CAVALCANTI
 * Botões aparecem IMEDIATAMENTE na tela inicial - VERSÃO COMPLETA E FUNCIONAL
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========== ELEMENTOS DOM ==========
    const elements = {
        container: document.getElementById('chatbotContainer'),
        toggle: document.getElementById('chatbotToggle'),
        close: document.getElementById('chatbotClose'),
        messages: document.getElementById('chatbotMessages'),
        notification: document.getElementById('chatbotNotification')
    };

    // ========== ESTADO ==========
    let currentFlow = null;
    const flowHistory = [];

    // ========== INFORMAÇÕES DA ESCOLA ==========
    const escola = {
        nome: 'Escola Estadual Mariana Cavalcanti',
        telefone: '(84) 3382-2270',
        email: 'eemarianacavalcanti@educar.rn.gov.br',
        endereco: 'AV. SENHORA SANTANA, 09 PRÉDIO. CENTRO, Luís Gomes - RN',
        cep: '59940-000',
        horario: 'Segunda a Sexta: 7h às 17h',
        responsavel: 'Diretoria Escolar'
    };

    // ========== INICIALIZAÇÃO ==========
    function init() {
        setupEventListeners();
        setupNotification();
        console.log('🤖 Chatbot carregado');
    }

    function setupEventListeners() {
        elements.toggle.addEventListener('click', openChat);
        elements.close.addEventListener('click', closeChat);
    }

    function setupNotification() {
        if (!localStorage.getItem('chatbotVisited')) {
            elements.notification.style.display = 'flex';
            localStorage.setItem('chatbotVisited', 'true');
        }
    }

    // ========== CONTROLE DO CHAT ==========
    function openChat() {
        elements.container.classList.remove('chatbot-hidden');
        elements.container.classList.add('chatbot-visible');
        elements.notification.style.display = 'none';
        
        // MOSTRAR TELA INICIAL IMEDIATAMENTE
        clearMessages();
        showWelcome();
    }

    function closeChat() {
        elements.container.classList.remove('chatbot-visible');
        elements.container.classList.add('chatbot-hidden');
    }

    // ========== TELA INICIAL (COM BOTÕES) ==========
    function showWelcome() {
        currentFlow = 'welcome';
        flowHistory.length = 0; // Limpar histórico
        
        // MENSAGEM
        addBotMessage(`Olá! 😊<br>Sou a  assistente virtual da <strong>${escola.nome}</strong>.<br><br>Como posso te ajudar hoje?`);
        
        // BOTÕES IMEDIATAMENTE
        setTimeout(() => {
            showInitialButtons();
        }, 50);
    }

    function showInitialButtons() {
        const buttons = [
            { text: '📅 Eventos escolares', action: 'eventos' },
            { text: '🕐 Horários', action: 'horarios' },
            { text: '📞 Contato / Secretaria', action: 'contato' },
            { text: '📍 Localização', action: 'localizacao' },
            { text: '📝 Matrículas', action: 'matriculas' },
            { text: '❓ Outras dúvidas', action: 'duvidas' }
        ];
        
        createButtonContainer(buttons, 'chatbot-suggestions-container', 'chatbot-suggestion-button');
    }

    // ========== FLUXOS PRINCIPAIS ==========
    function handleAction(action) {
        // Registrar clique do usuário
        addUserMessage(getButtonText(action));
        
        // Processar ação
        switch(action) {
            case 'eventos':
                showEventosMenu();
                break;
            case 'horarios':
                showHorariosMenu();
                break;
            case 'contato':
                showContatoMenu();
                break;
            case 'localizacao':
                showLocalizacaoMenu();
                break;
            case 'matriculas':
                showMatriculasMenu();
                break;
            case 'duvidas':
                showDuvidasMenu();
                break;
            case 'back':
                goBack();
                break;
            case 'menu':
                showWelcome();
                break;
            case 'fechar':
                addBotMessage('Atendimento encerrado! 😊<br>Tenha um ótimo dia!');
                setTimeout(closeChat, 2000);
                break;
            case 'navegateToMenu':
                navegateToMenu();
                break;
                
            // Ações de submenu
            case 'proximosEventos':
                showProximosEventos();
                break;
            case 'participarEventos':
                showParticiparEventos();
                break;
            case 'sugerirEvento':
                showSugerirEvento();
                break;
            case 'horarioAulas':
                showHorarioAulas();
                break;
            case 'funcionamentoGeral':
                showFuncionamentoGeral();
                break;
            case 'atendimentoSecretaria':
                showAtendimentoSecretaria();
                break;
            case 'horarioMerenda':
                showHorarioMerenda();
                break;
            case 'transporte':
                showTransporte();
                break;
            case 'agendarVisita':
                showAgendarVisita();
                break;
            case 'estacionamento':
                showEstacionamento();
                break;
            case 'documentosMatricula':
                showDocumentosMatricula();
                break;
            case 'datasMatricula':
                showDatasMatricula();
                break;
            case 'vagasDisponiveis':
                showVagasDisponiveis();
                break;
            case 'transferenciaMatricula':
                showTransferenciaMatricula();
                break;
            case 'uniforme':
                showUniforme();
                break;
            case 'merenda':
                showMerenda();
                break;
            case 'material':
                showMaterial();
                break;
            case 'atendimentoMedico':
                showAtendimentoMedico();
                break;
            case 'regrasEscola':
                showRegrasEscola();
                break;
        }
    }

    // ========== MENU EVENTOS ==========
    function showEventosMenu() {
        currentFlow = 'eventos';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📅 Eventos da Escola</strong><br><br>Fique por dentro das atividades, reuniões e eventos comemorativos.`);
        
        const buttons = [
            { text: '📅 Próximos eventos', action: 'proximosEventos' },
            { text: '🗓️ Calendário completo', action: 'openCalendar' },
            { text: '🎉 Como participar', action: 'participarEventos' },
            { text: '🖼️ Galeria de fotos', action: 'openGaleria' },
            { text: '💡 Sugerir evento', action: 'sugerirEvento' },
            { text: '🔙 Voltar ao menu', action: 'menu' }
        ];
        createButtonContainer(buttons);
    }

function showProximosEventos() {
    currentFlow = 'proximosEventos';
    flowHistory.push(currentFlow);
    
    addBotMessage(`<strong>📅 Próximos Eventos</strong><br><br>
        Confira nossa agenda completa de eventos e atividades escolares.`);
    
    const buttons = [
        { text: '🎉 Ver todos os eventos', action: 'openEventsPage', specialClass: 'chatbot-button-action' },
        { text: '🗓️ Ver calendário', action: 'openCalendar' },
        { text: '✅ Confirmar presença', action: 'contato' },
        { text: '🔙 Voltar', action: 'back' },
        { text: '🏠 Menu principal', action: 'menu' }
    ];
    createButtonContainer(buttons);
}

    function showParticiparEventos() {
        currentFlow = 'participarEventos';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🎉 Como Participar</strong><br><br>
            <strong>Para alunos:</strong><br>
            • Fique atento aos comunicados<br>
            • Inscreva-se com o professor<br><br>
            <strong>Para pais:</strong><br>
            • Confirme sua presença<br>
            • Participe das reuniões<br><br>
            <strong>Para comunidade:</strong><br>
            • Siga nossas redes sociais<br>
            • Consulte eventos abertos`);
        
        showBackButtons();
    }

    function showSugerirEvento() {
        currentFlow = 'sugerirEvento';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>💡 Sugerir Evento</strong><br><br>
            Tem uma ideia para um evento escolar?<br><br>
            Entre em contato:<br>
            📞 ${escola.telefone}<br>
            ✉️ ${escola.email}<br><br>
            Horário: ${escola.horario}`);
        
        const buttons = [
            { text: '📱 Ligar agora', action: 'callSchool', specialClass: 'chatbot-button-call' },
            { text: '✉️ Enviar e-mail', action: 'sendEmail' },
            { text: '🔙 Voltar', action: 'back' }
        ];
        createButtonContainer(buttons);
    }

    // ========== MENU HORÁRIOS ==========
    function showHorariosMenu() {
        currentFlow = 'horarios';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🕐 Horários da Escola</strong><br><br>O que você precisa saber?`);
        
        const buttons = [
            { text: '⏰ Horário de aulas', action: 'horarioAulas' },
            { text: '🏫 Funcionamento geral', action: 'funcionamentoGeral' },
            { text: '📞 Atendimento secretaria', action: 'atendimentoSecretaria' },
            { text: '🍎 Horário da merenda', action: 'horarioMerenda' },
            { text: '🚌 Transporte escolar', action: 'transporte' },
            { text: '🔙 Voltar ao menu', action: 'menu' }
        ];
        createButtonContainer(buttons);
    }

    function showHorarioAulas() {
        currentFlow = 'horarioAulas';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>⏰ Horário das Aulas</strong><br><br>
            <strong>Turno Matutino:</strong><br>
            Entrada: 7h00<br>
            Intervalo: 9h30-9h45<br>
            Saída: 11h15<br><br>
            <strong>Turno Vespertino:</strong><br>
            Entrada: 13h00<br>
            Intervalo: 15h30-15h45<br>
            Saída: 17h15<br><br>
            ⚠️ Tolerância: 10 minutos`);
        
        showBackButtons();
    }

    function showFuncionamentoGeral() {
        currentFlow = 'funcionamentoGeral';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🏫 Funcionamento Geral</strong><br><br>
            Escola: Segunda a sexta, 7h às 17h<br><br>
            Secretaria: ${escola.horario}<br><br>
            Períodos de aula:<br>
            Manhã: 7h30-11h30<br>
            Tarde: 13h30-17h30`);
        
        showBackButtons();
    }

    function showAtendimentoSecretaria() {
        currentFlow = 'atendimentoSecretaria';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📞 Atendimento da Secretaria</strong><br><br>
            Horário: ${escola.horario}<br><br>
            Melhor horário:<br>
            • 8h às 11h<br>
            • 14h às 16h<br><br>
            💡 Dica: Evite os primeiros 30 minutos.`);
        
        const buttons = [
            { text: '📱 Ligar agora', action: 'callSchool', specialClass: 'chatbot-button-call' },
            { text: '✉️ Enviar e-mail', action: 'sendEmail' },
            { text: '📅 Agendar visita', action: 'agendarVisita' },
            { text: '🔙 Voltar', action: 'back' },
            { text: '🏠 Menu principal', action: 'menu' }
        ];
        createButtonContainer(buttons);
    }

    function showHorarioMerenda() {
        currentFlow = 'horarioMerenda';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🍎 Horário da Merenda</strong><br><br>
            Turno da Manhã: 9h30 às 9h45<br><br>
            Turno da Tarde: 15h30 às 15h45<br><br>
            🍽️ Cardápio supervisionado por nutricionista`);
        
        showBackButtons();
    }

    function showTransporte() {
        currentFlow = 'transporte';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🚌 Transporte Escolar</strong><br><br>
            Opções:<br>
            1. Ônibus municipal<br><br>
            ⚠️ A escola não fornece transporte.<br><br>`);
        
        showBackButtons();
    }

    // ========== MENU CONTATO ==========
    function showContatoMenu() {
        currentFlow = 'contato';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📞 Contato da Escola</strong><br><br>
            📍 ${escola.endereco}<br>
            📞 ${escola.telefone}<br>
            ✉️ ${escola.email}<br>
            🕐 ${escola.horario}<br>
            👤 ${escola.responsavel}`);
        
        const buttons = [
            { text: '📱 Ligar agora', action: 'callSchool', specialClass: 'chatbot-button-call' },
            { text: '✉️ Enviar e-mail', action: 'sendEmail' },
            { text: '🗺️ Ver no mapa', action: 'openMaps' },
            { text: '📅 Agendar visita', action: 'agendarVisita' },
            { text: '🔙 Voltar ao menu', action: 'menu' }
        ];
        createButtonContainer(buttons);
    }

    function showAgendarVisita() {
        currentFlow = 'agendarVisita';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📅 Agendar Visita</strong><br><br>
            Para agendar uma visita:<br><br>
            1. Telefone: ${escola.telefone}<br>
            2. E-mail: ${escola.email}<br>
            3. Presencialmente<br><br>
            Horário: ${escola.horario}`);
        
        const buttons = [
            { text: '📱 Ligar para agendar', action: 'callSchool', specialClass: 'chatbot-button-call' },
            { text: '✉️ E-mail para agendar', action: 'sendEmail' },
            { text: '🗺️ Ver localização', action: 'openMaps' },
            { text: '🔙 Voltar', action: 'back' }
        ];
        createButtonContainer(buttons);
    }

    // ========== MENU LOCALIZAÇÃO ==========
    function showLocalizacaoMenu() {
        currentFlow = 'localizacao';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📍 Localização</strong><br><br>
            ${escola.endereco}<br>
            CEP: ${escola.cep}<br>
            Luís Gomes - RN<br><br>
            Como chegar:<br>
            🚗 Centro da cidade<br>
            🚶 Próximo à praça principal<br>
            🚌 Várias linhas de ônibus`);
        
        const buttons = [
            { text: '🗺️ Abrir no Google Maps', action: 'openMaps', specialClass: 'chatbot-button-action' },
            { text: '🚗 Calcular rota', action: 'calculateRoute' },
            { text: '🅿️ Estacionamento', action: 'estacionamento' },
            { text: '🔙 Voltar ao menu', action: 'menu' }
        ];
        createButtonContainer(buttons);
    }

    function showEstacionamento() {
        currentFlow = 'estacionamento';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🅿️ Estacionamento</strong><br><br>
            Opções:<br>
            1. Frente da escola <br>
            2. Interno para motos<br>
            3. Lateral sem pavimento<br><br>`);
        
        showBackButtons();
    }

    // ========== MENU MATRÍCULAS ==========
    function showMatriculasMenu() {
        currentFlow = 'matriculas';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📝 Matrículas</strong><br><br>O que você precisa saber?`);
        
        const buttons = [
            { text: '📋 Documentos necessários', action: 'documentosMatricula' },
            { text: '📅 Datas e períodos', action: 'datasMatricula' },
            { text: '👥 Vagas disponíveis', action: 'vagasDisponiveis' },
            { text: '🔄 Transferência', action: 'transferenciaMatricula' },
            { text: '🔙 Voltar ao menu', action: 'menu' }
        ];
        createButtonContainer(buttons);
    }

    function showDocumentosMatricula() {
        currentFlow = 'documentosMatricula';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📋 Documentos para Matrícula</strong><br><br>
            <strong>Para o aluno:</strong><br>
            1. RG ou Certidão de Nascimento<br>
            2. CPF (se tiver)<br>
            3. Comprovante de vacinação<br>
            4. 2 fotos 3x4<br>
            5. Histórico escolar<br><br>
            <strong>Para o responsável:</strong><br>
            1. RG e CPF<br>
            2. Comprovante de residência<br>
            3. Comprovante de renda<br><br>
            💡 Traga também cópias simples.`);
        
        // Botões personalizados incluindo o botão de navegação
        const buttons = [
            { 
                text: '📄 Ver mais detalhes sobre matrículas', 
                action: 'navegateToMenu' 
            },
            { text: '🔙 Voltar', action: 'back' },
            { text: '🏠 Menu principal', action: 'menu' }
        ];
        
        createButtonContainer(buttons);
    }

    function showDatasMatricula() {
        currentFlow = 'datasMatricula';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📅 Datas de Matrícula</strong><br><br>
            Pré-matrícula (Renovação):<br>
            🟢 20 a 30 de novembro<br><br>
            Matrícula Regular:<br>
            🟡 15 a 30 de janeiro<br><br>
            Matrícula Tardia:<br>
            🔴 A partir de 1º de fevereiro<br><br>
            ⚠️ Vagas limitadas`);
        
        // Botões personalizados incluindo o botão de navegação
        const buttons = [
            { 
                text: '📄 Ver mais detalhes sobre matrículas', 
                action: 'navegateToMenu' 
            },
            { text: '🔙 Voltar', action: 'back' },
            { text: '🏠 Menu principal', action: 'menu' }
        ];
        
        createButtonContainer(buttons);
    }

    function showVagasDisponiveis() {
        currentFlow = 'vagasDisponiveis';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>👥 Vagas Disponíveis</strong><br><br>
            Para verificar vagas:<br><br>
            📞 ${escola.telefone}<br>
            ✉️ ${escola.email}<br>
            🏫 Secretaria da escola<br><br>
            Horário: ${escola.horario}<br><br>
            📊 Vagas por ordem de chegada.`);
        
        // Botões personalizados incluindo o botão de navegação
        const buttons = [
            { 
                text: '📄 Ver mais detalhes sobre matrículas', 
                action: 'navegateToMenu' 
            },
            { text: '🔙 Voltar', action: 'back' },
            { text: '🏠 Menu principal', action: 'menu' }
        ];
        
        createButtonContainer(buttons);
    }

    function showTransferenciaMatricula() {
        currentFlow = 'transferenciaMatricula';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🔄 Transferência de Matrícula</strong><br><br>
            Documentos adicionais:<br>
            1. Declaração de transferência<br>
            2. Histórico escolar completo<br><br>
            Procedimento:<br>
            1. Verificar vaga disponível<br>
            2. Apresentar documentação<br>
            3. Aguardar análise<br><br>
            ⚠️ Sujeito à disponibilidade de vagas.`);
        
        // Botões personalizados incluindo o botão de navegação
        const buttons = [
            { 
                text: '📄 Ver mais detalhes sobre matrículas', 
                action: 'navegateToMenu' 
            },
            { text: '🔙 Voltar', action: 'back' },
            { text: '🏠 Menu principal', action: 'menu' }
        ];
        
        createButtonContainer(buttons);
    }

    function navegateToMenu() {
        // Adiciona uma mensagem explicativa antes de navegar
        addBotMessage(`<strong>📋 Informações Completas de Matrícula</strong><br><br>
            Redirecionando para a página com todas as informações detalhadas sobre matrículas...`);
        
        // Pequeno delay para o usuário ler a mensagem
        setTimeout(() => {
            window.location.href = 'informacoes.html';
        }, 1500);
    }

    // ========== MENU OUTRAS DÚVIDAS ==========
    function showDuvidasMenu() {
        currentFlow = 'duvidas';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>❓ Outras Dúvidas</strong><br><br>Escolha um assunto:`);
        
        const buttons = [
            { text: '👕 Uniforme escolar', action: 'uniforme' },
            { text: '🍎 Merenda escolar', action: 'merenda' },
            { text: '🚌 Transporte', action: 'transporte' },
            { text: '📚 Material escolar', action: 'material' },
            { text: '🏥 Atendimento médico', action: 'atendimentoMedico' },
            { text: '📋 Regras da escola', action: 'regrasEscola' },
            { text: '🔙 Voltar ao menu', action: 'menu' }
        ];
        createButtonContainer(buttons, 'chatbot-buttons-compact');
    }

    function showUniforme() {
        currentFlow = 'uniforme';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>👕 Uniforme Escolar</strong><br><br>
            Obrigatório:<br>
            • Fardamento escolar<br>
            • Calça jeans ou análoga<br>
            Onde comprar:<br>
            🏫 Falar com a Secretaria da escola<br>
            `);
        
        showBackButtons();
    }

    function showMerenda() {
        currentFlow = 'merenda';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🍎 Merenda Escolar</strong><br><br>
            Oferecemos:<br>
            • Lanche (manhã e Tarde)<br>
            • Almoço (tarde - contra    turno)<br>
            Cardápio:<br>
            • Frutas e verduras<br>
            • Proteínas balanceadas<br><br>
            ⚠️ Restrições alimentares: informe na secretaria.`);
        
        showBackButtons();
    }

    function showMaterial() {
        currentFlow = 'material';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📚 Material Escolar</strong><br><br>
            Fornecido pela escola:<br>
            • Livros didáticos<br>
            • Lanche<br>
            • Material coletivo<br><br>
            Responsabilidade do aluno:<br>
            • Manter os materiais em bom estado<br>
            • Devolver os materiais quando solicitado<br>
            • Fardamento<br>`);
        
        showBackButtons();
    }

    function showAtendimentoMedico() {
        currentFlow = 'atendimentoMedico';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>🏥 Atendimento Médico</strong><br><br>
            Na escola:<br>
            • Primeiros socorros<br>
            • Acompanhamento<br><br>
            Emergências:<br>
            1. SAMU: 192<br>
            2. Hospital mais próximo<br>
            3. Contatar responsáveis<br><br>
            ⚠️ Medicação somente com autorização.`);
        
        showBackButtons();
    }

    function showRegrasEscola() {
        currentFlow = 'regrasEscola';
        flowHistory.push(currentFlow);
        
        addBotMessage(`<strong>📋 Regras da Escola</strong><br><br>
            Principais normas:<br>
            1. Pontualidade (10 min)<br>
            2. Uso do uniforme<br>
            3. Respeito a todos<br>
            4. Cuidado com patrimônio<br><br>
            Proibido:<br>
            • Celular em sala<br>
            • Agressão<br>
            • Saídas não autorizadas<br><br>
            📖 Regimento completo disponível na secretaria.`);
        
        showBackButtons();
    }

    // ========== FUNÇÕES AUXILIARES ==========
    function createButtonContainer(buttons, containerClass = 'chatbot-buttons-container', buttonClass = 'chatbot-button') {
        // Remover botões anteriores
        document.querySelectorAll('.chatbot-buttons-container, .chatbot-suggestions-container, .chatbot-buttons-compact')
            .forEach(el => el.remove());
        
        // Criar container
        const container = document.createElement('div');
        container.className = containerClass;
        
        // Adicionar botões
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = buttonClass;
            
            if (button.specialClass) {
                btn.classList.add(button.specialClass);
            }
            
            btn.innerHTML = button.text;
            btn.addEventListener('click', function() {
                // Efeito visual de clique
                this.style.transform = 'scale(0.98)';
                setTimeout(() => this.style.transform = '', 150);
                
                // Executar ação
                handleAction(button.action);
            });
            
            container.appendChild(btn);
        });
        
        elements.messages.appendChild(container);
        scrollToBottom();
    }

    function showBackButtons() {
        const buttons = [
            { text: '🔙 Voltar', action: 'back' },
            { text: '🏠 Menu principal', action: 'menu' }
        ];
        createButtonContainer(buttons);
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
        elements.messages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
        elements.messages.appendChild(messageDiv);
        scrollToBottom();
    }

    function getButtonText(action) {
        const map = {
            'eventos': '📅 Eventos escolares',
            'horarios': '🕐 Horários',
            'contato': '📞 Contato / Secretaria',
            'localizacao': '📍 Localização',
            'matriculas': '📝 Matrículas',
            'duvidas': '❓ Outras dúvidas',
            'proximosEventos': '📅 Próximos eventos',
            'participarEventos': '🎉 Como participar',
            'sugerirEvento': '💡 Sugerir evento',
            'horarioAulas': '⏰ Horário de aulas',
            'funcionamentoGeral': '🏫 Funcionamento geral',
            'atendimentoSecretaria': '📞 Atendimento secretaria',
            'horarioMerenda': '🍎 Horário da merenda',
            'transporte': '🚌 Transporte escolar',
            'agendarVisita': '📅 Agendar visita',
            'estacionamento': '🅿️ Estacionamento',
            'documentosMatricula': '📋 Documentos necessários',
            'datasMatricula': '📅 Datas e períodos',
            'vagasDisponiveis': '👥 Vagas disponíveis',
            'transferenciaMatricula': '🔄 Transferência',
            'uniforme': '👕 Uniforme escolar',
            'merenda': '🍎 Merenda escolar',
            'material': '📚 Material escolar',
            'atendimentoMedico': '🏥 Atendimento médico',
            'regrasEscola': '📋 Regras da escola',
            'navegateToMenu': '📄 Ver mais detalhes sobre matrículas'
        };
        return map[action] || action;
    }

    function clearMessages() {
        elements.messages.innerHTML = '';
        flowHistory.length = 0;
    }

    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    function scrollToBottom() {
        setTimeout(() => {
            elements.messages.scrollTop = elements.messages.scrollHeight;
        }, 100);
    }

    function goBack() {
        if (flowHistory.length > 1) {
            // Remove o fluxo atual
            flowHistory.pop();
            // Volta para o fluxo anterior
            const previousFlow = flowHistory[flowHistory.length - 1];
            
            // Recarregar o fluxo anterior
            switch(previousFlow) {
                case 'eventos':
                    showEventosMenu();
                    break;
                case 'horarios':
                    showHorariosMenu();
                    break;
                case 'contato':
                    showContatoMenu();
                    break;
                case 'localizacao':
                    showLocalizacaoMenu();
                    break;
                case 'matriculas':
                    showMatriculasMenu();
                    break;
                case 'duvidas':
                    showDuvidasMenu();
                    break;
                default:
                    showWelcome();
            }
        } else {
            showWelcome();
        }
    }

    // ========== AÇÕES EXTERNAS ==========
    const externalActions = {
        'openCalendar': () => window.location.href = 'calendario.html',
        'openGaleria': () => window.location.href = 'eventos.html#galeria',
        'openEventsPage': () => window.location.href = 'eventos.html', 
        'callSchool': () => window.location.href = `tel:${escola.telefone.replace(/\D/g, '')}`,
        'sendEmail': () => window.location.href = `mailto:${escola.email}?subject=Contato via Site - ${escola.nome}`,
        'openMaps': () => {
            const address = encodeURIComponent(`${escola.endereco}, Luís Gomes - RN`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        },
        'calculateRoute': () => {
            const address = encodeURIComponent(escola.endereco);
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
        }
    };

    // Atualizar handleAction para incluir ações externas
    const originalHandleAction = handleAction;
    handleAction = function(action) {
        if (externalActions[action]) {
            externalActions[action]();
        } else {
            originalHandleAction(action);
        }
    };

    // ========== INICIALIZAR ==========
    init();

    // Expor funções globalmente
    window.chatbot = {
        open: openChat,
        close: closeChat,
        restart: showWelcome
    };
});