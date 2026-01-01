// ============================================
// CHATBOT TELETENDIMENTO - ESCOLA MARIANA CAVALCANTI
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotNotification = document.getElementById('chatbotNotification');
    
    // Estado
    let isChatOpen = false;
    let isFirstTime = true;
    let currentStep = 'saudacao';
    let userData = {};
    let eventosReais = []; // Array para eventos reais
    
    // Informações da Escola (sempre atualizadas)
    const escolaInfo = {
        nome: 'Escola Estadual Mariana Cavalcanti',
        telefone: '(84) 3382-2270',
        email: 'eemarianacavalcanti@hotmail.com',
        endereco: 'AV. SENHORA SANTANA, 09 PRÉDIO. CENTRO, Luís Gomes - RN',
        cep: '59940-000',
        horario: 'Segunda a Sexta: 7h às 17h',
        responsavel: 'Diretoria Escolar'
    };
    
    // ========== FUNÇÕES PARA EVENTOS REAIS ==========
    
    async function carregarEventosReais() {
        try {
            console.log('📥 Carregando eventos reais para o chatbot...');
            const eventos = await fetchData('EVENTOS', 'EVENTOS');
            
            if (eventos && eventos.length > 0) {
                // Ordenar por data (mais recentes primeiro)
                eventosReais = eventos.sort((a, b) => {
                    const dataA = a.INICIO ? new Date(a.INICIO) : new Date(0);
                    const dataB = b.INICIO ? new Date(b.INICIO) : new Date(0);
                    return dataB - dataA;
                });
                console.log(`✅ ${eventosReais.length} eventos carregados`);
            } else {
                eventosReais = [];
                console.log('⚠️ Nenhum evento encontrado na planilha');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar eventos:', error);
            eventosReais = [];
        }
    }
    
    function getProximosEventos() {
        if (eventosReais.length === 0) {
            return null;
        }
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        // Filtrar eventos futuros ou do dia atual
        const proximos = eventosReais.filter(evento => {
            if (!evento.INICIO) return false;
            
            const dataEvento = new Date(evento.INICIO);
            dataEvento.setHours(0, 0, 0, 0);
            
            return dataEvento >= hoje;
        });
        
        return proximos.slice(0, 3); // Retorna no máximo 3 próximos eventos
    }
    
    function formatarEventosParaChat(eventos) {
        if (!eventos || eventos.length === 0) {
            return `*Nenhum evento futuro cadastrado no momento.* 📭\n\nConfira a página "Eventos" para ver todos os eventos da escola!\n\n*Ou entre em contato:*\n📞 ${escolaInfo.telefone}\n✉️ ${escolaInfo.email}`;
        }
        
        let mensagem = `*PRÓXIMOS EVENTOS DA ESCOLA:* 📅\n\n`;
        
        eventos.forEach((evento, index) => {
            const dataFormatada = formatarData(evento.INICIO);
            const tipo = evento.TIPO || 'Evento';
            
            mensagem += `**${evento.EVENTO || 'Evento'}**\n`;
            mensagem += `📅 ${dataFormatada} | 🏷️ ${tipo}\n`;
            
            if (evento.DESCRICAO && evento.DESCRICAO.length > 60) {
                mensagem += `📝 ${evento.DESCRICAO.substring(0, 60)}...\n`;
            } else if (evento.DESCRICAO) {
                mensagem += `📝 ${evento.DESCRICAO}\n`;
            }
            
            if (evento.LOCAL) {
                mensagem += `📍 ${evento.LOCAL}\n`;
            }
            
            mensagem += '\n';
        });
        
        mensagem += `\n*Total de ${eventos.length} evento(s) programado(s)*\n\n*Confira a página "Eventos" para mais detalhes!*`;
        
        return mensagem;
    }
    
    // ========== INICIALIZAÇÃO ==========
    
    async function initChatbot() {
        // Notificação inicial
        if (isFirstTime) {
            chatbotNotification.style.display = 'flex';
            chatbotNotification.textContent = '👋';
            isFirstTime = false;
        }
        
        // Carregar eventos reais
        await carregarEventosReais();
        
        // Event Listeners
        chatbotToggle.addEventListener('click', toggleChat);
        chatbotClose.addEventListener('click', closeChat);
        chatbotSend.addEventListener('click', processUserInput);
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') processUserInput();
        });
        
        // Iniciar conversa quando abrir
        chatbotToggle.addEventListener('click', async function() {
            if (!isChatOpen) {
                // Recarregar eventos sempre que abrir
                await carregarEventosReais();
                setTimeout(startConversation, 300);
            }
        });
    }
    
    // Iniciar conversa
    function startConversation() {
        clearChat();
        currentStep = 'saudacao';
        userData = {};
        
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage(`Olá! Sou a *Mariana*, assistente virtual da ${escolaInfo.nome}. 😊

*Como posso te ajudar hoje?*`, 'saudacao');
            
            // Sugestões iniciais
            showSuggestions([
                { text: '📅 Informações sobre eventos', value: 'eventos' },
                { text: '🕐 Horários de funcionamento', value: 'horarios' },
                { text: '📞 Falar com secretaria', value: 'contato' },
                { text: '📍 Localização da escola', value: 'localizacao' }
            ]);
        }, 1500);
    }
    
    // Processar entrada do usuário
    function processUserInput() {
        const input = chatbotInput.value.trim();
        if (!input) return;
        
        // Adicionar mensagem do usuário
        addUserMessage(input);
        chatbotInput.value = '';
        
        // Processar baseado no passo atual
        setTimeout(() => {
            handleUserResponse(input.toLowerCase());
        }, 500);
    }
    
    // Lidar com resposta do usuário
    function handleUserResponse(input) {
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            
            switch(currentStep) {
                case 'saudacao':
                    handleSaudacao(input);
                    break;
                case 'horarios':
                    handleHorarios(input);
                    break;
                case 'contato':
                    handleContato(input);
                    break;
                case 'eventos':
                    handleEventos(input);
                    break;
                case 'localizacao':
                    handleLocalizacao(input);
                    break;
                case 'matricula':
                    handleMatricula(input);
                    break;
                case 'duvida':
                    handleDuvidaEspecifica(input);
                    break;
                default:
                    handleDefault(input);
            }
        }, 1000 + Math.random() * 1000);
    }
    
    // ========== FLUXOS DE CONVERSA ==========
    
    function handleSaudacao(input) {
        if (input.includes('evento') || input.includes('eventos') || input.includes('festa') || input.includes('atividade')) {
            currentStep = 'eventos';
            addBotMessage(`*Ótimo! Falando sobre eventos escolares...* 🎉

Na nossa escola temos diversos eventos durante o ano:
• Festas comemorativas
• Feiras de conhecimento
• Reuniões de pais
• Competições esportivas
• Atividades culturais

*O que te interessa mais?*`, 'eventos');
            
            showSuggestions([
                { text: '📅 Próximos eventos', value: 'proximos' },
                { text: '🖼️ Ver fotos dos eventos', value: 'fotos' },
                { text: '📝 Como participar', value: 'participar' },
                { text: '🔙 Voltar ao menu', value: 'voltar' }
            ]);
            
        } else if (input.includes('horário') || input.includes('funciona') || input.includes('aberto') || input.includes('hora')) {
            currentStep = 'horarios';
            addBotMessage(`*Horários da ${escolaInfo.nome}:* 🕐

🏫 **Funcionamento da Escola:**
• Segunda a sexta: 7h às 17h
• Sábado: Fechado para atividades gerais
• Domingo: Fechado

👨‍🏫 **Períodos de Aula:**
• Manhã: 7h30 às 11h30
• Tarde: 13h30 às 17h30

📞 **Atendimento Telefônico:**
• ${escolaInfo.horario}

*Precisa de algum horário específico?*`, 'horarios');
            
            showSuggestions([
                { text: '⏰ Horário da secretaria', value: 'secretaria' },
                { text: '📚 Horário das aulas', value: 'aulas' },
                { text: '🍎 Horário da merenda', value: 'merenda' },
                { text: '🔙 Voltar ao menu', value: 'voltar' }
            ]);
            
        } else if (input.includes('contato') || input.includes('telefone') || input.includes('email') || input.includes('falar') || input.includes('secretaria')) {
            currentStep = 'contato';
            addBotMessage(`*Contatos da Escola:* 📞

📍 **Endereço:** ${escolaInfo.endereco}
📞 **Telefone:** ${escolaInfo.telefone}
📧 **E-mail:** ${escolaInfo.email}
🕐 **Horário de Atendimento:** ${escolaInfo.horario}

👤 **Responsável:** ${escolaInfo.responsavel}

*Como prefere entrar em contato?*`, 'contato');
            
            showSuggestions([
                { text: '📱 Ligar agora', value: 'ligar' },
                { text: '✉️ Enviar e-mail', value: 'email' },
                { text: '🗺️ Ver no mapa', value: 'mapa' },
                { text: '🔙 Voltar ao menu', value: 'voltar' }
            ]);
            
        } else if (input.includes('local') || input.includes('endereço') || input.includes('onde fica') || input.includes('mapa')) {
            currentStep = 'localizacao';
            addBotMessage(`*Localização da Escola:* 📍

${escolaInfo.endereco}
CEP: ${escolaInfo.cep}
Cidade: Luís Gomes - RN

**Como chegar:**
🚗 **De carro:** Centro da cidade, próximo à praça principal
🚶 **A pé:** Fácil acesso do centro
🚌 **Transporte:** Várias linhas de ônibus passam próximas

*Quer ver no mapa ou precisa de mais orientações?*`, 'localizacao');
            
            showSuggestions([
                { text: '🗺️ Abrir no Google Maps', value: 'maps' },
                { text: '🚗 Melhor rota', value: 'rota' },
                { text: '🅿️ Estacionamento', value: 'estacionamento' },
                { text: '🔙 Voltar ao menu', value: 'voltar' }
            ]);
            
        } else if (input.includes('matrícula') || input.includes('matricular') || input.includes('aluno novo') || input.includes('inscrição')) {
            currentStep = 'matricula';
            addBotMessage(`*Processo de Matrícula:* 📝

Para matricular um aluno na nossa escola:

**📋 Documentos necessários:**
1. RG ou Certidão de Nascimento do aluno
2. CPF do responsável
3. Comprovante de residência
4. Histórico escolar (para transferência)
5. 2 fotos 3x4

**📅 Período de matrícula:**
• Novembro/Dezembro (pré-matrícula)
• Janeiro (matrícula regular)
• Durante o ano (vagas remanescentes)

**🏫 Local:** Secretaria da escola

*Tem alguma dúvida específica sobre matrícula?*`, 'matricula');
            
            showSuggestions([
                { text: '📋 Lista completa de documentos', value: 'documentos' },
                { text: '📅 Datas importantes', value: 'datas' },
                { text: '💰 Taxas e valores', value: 'valores' },
                { text: '🔙 Voltar ao menu', value: 'voltar' }
            ]);
            
        } else if (input.includes('calendario') || input.includes('calendário')) {
            // Novo tratamento para calendário
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola com todas as datas importantes do ano letivo!`, 'eventos');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
            
            showSuggestions([
                { text: '📅 Próximos eventos', value: 'proximos' },
                { text: '🔙 Voltar ao menu', value: 'voltar' }
            ]);
            
        } else {
            addBotMessage(`Entendi! Você disse: "*${input}*"

Posso te ajudar com diversas coisas da nossa escola. *Escolha uma opção abaixo ou me diga o que precisa:* 😊`, 'default');
            
            showMainSuggestions();
        }
    }
    
    function handleHorarios(input) {
        if (input.includes('secretaria') || input.includes('atendimento')) {
            addBotMessage(`*Horário da Secretaria:* 🏫

A secretaria atende no mesmo horário da escola:
${escolaInfo.horario}

**Melhor horário para atendimento:**
• Manhã: 8h às 11h
• Tarde: 14h às 16h

*Dica:* Evite os primeiros 30 minutos de cada período, pois costuma ser mais movimentado.`, 'horarios');
        } else if (input.includes('aula') || input.includes('aulas')) {
            addBotMessage(`*Horário das Aulas:* 📚

**Período Matutino:**
• Entrada: 7h00
• Intervalo: 9h30 às 9h45
• Saída: 11h15

**Período Vespertino:**
• Entrada: 13h00
• Intervalo: 15h30 às 15h45
• Saída: 17h15
**IMPORTANTE:** A tolerância de atraso na entrada é de 10 min
*Observação:* Os horários podem variar conforme as atividade desenvolvidas.`, 'horarios');
        } else if (input.includes('merenda') || input.includes('lanche')) {
            addBotMessage(`*Horário da Merenda:* 🍎

A merenda escolar é servida em dois horários:

**Para alunos do turno da manhã:**
• 9h30 às 09h45

**Para alunos do turno da tarde:**
• 15h30 às 15h45

*Importante:* A merenda é balanceada e supervisionada por nutricionista.`, 'horarios');
        } else if (input.includes('voltar')) {
            backToMainMenu();
            return;
        } else if (input.includes('calendario') || input.includes('calendário')) {
            // Tratamento para calendário nos horários
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola!`, 'horarios');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
        }
        
        showSuggestions([
            { text: '📅 Calendário escolar', value: 'calendario' },
            { text: '🔙 Menu principal', value: 'menu' },
            { text: '❌ Fechar conversa', value: 'fechar' }
        ]);
    }
    
    function handleContato(input) {
        if (input.includes('ligar') || input.includes('telefone')) {
            addBotMessage(`*Ligação Direta:* 📱

Para falar com a secretaria, disque:
**${escolaInfo.telefone}**
                
*Dica:* Se a linha estiver ocupada, tente novamente após alguns minutos ou envie um e-mail.`, 'contato');
            
            // Botão para ligar
            addActionButton('📱 Ligar Agora', () => {
                window.location.href = `tel:${escolaInfo.telefone.replace(/\D/g, '')}`;
            });
            
        } else if (input.includes('email') || input.includes('e-mail')) {
            addBotMessage(`*Enviar E-mail:* ✉️

Nosso e-mail oficial:
**${escolaInfo.email}**

*Assuntos recomendados para e-mail:*
• Documentação
• Informações gerais
• Agendamentos
• Dúvidas administrativas

*Respondemos em até 48 horas úteis.*`, 'contato');
            
            // Botão para enviar email
            addActionButton('✉️ Abrir E-mail', () => {
                window.location.href = `mailto:${escolaInfo.email}?subject=Contato via Site - Escola Mariana Cavalcanti`;
            });
            
        } else if (input.includes('mapa') || input.includes('maps')) {
            addBotMessage(`*Localização no Mapa:* 🗺️

Clique no botão abaixo para abrir no Google Maps:

*Endereço completo:*
${escolaInfo.endereco}
${escolaInfo.cep} - Luís Gomes/RN`, 'contato');
            
            // Botão para abrir mapa
            addActionButton('🗺️ Abrir no Google Maps', () => {
                const address = encodeURIComponent(`${escolaInfo.endereco}, Luís Gomes - RN`);
                window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
            });
            
        } else if (input.includes('voltar')) {
            backToMainMenu();
            return;
        } else if (input.includes('calendario') || input.includes('calendário')) {
            // Tratamento para calendário no contato
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola!`, 'contato');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
        }
        
        showSuggestions([
            { text: '📞 Outras formas de contato', value: 'outros' },
            { text: '👤 Falar com direção', value: 'direcao' },
            { text: '🔙 Menu principal', value: 'menu' },
            { text: '💬 Nova dúvida', value: 'nova' }
        ]);
    }
    
    function handleEventos(input) {
        if (input.includes('proximo') || input.includes('próximo')) {
            // BUSCAR EVENTOS REAIS DA PLANILHA
            const proximosEventos = getProximosEventos();
            
            if (!proximosEventos || proximosEventos.length === 0) {
                addBotMessage(`*Nenhum evento futuro cadastrado no momento.* 📭

Confira a página "Eventos" para ver todos os eventos da escola!

*Ou entre em contato:* 
📞 ${escolaInfo.telefone} 
✉️ ${escolaInfo.email}`, 'eventos');
            } else {
                const mensagemEventos = formatarEventosParaChat(proximosEventos);
                addBotMessage(mensagemEventos, 'eventos');
                
                // Botão para ver todos os eventos
                addActionButton('📅 Ver todos os eventos', () => {
                    window.location.href = 'eventos.html';
                });
            }
            
        } else if (input.includes('foto') || input.includes('imagem')) {
            addBotMessage(`*Fotos dos Eventos:* 📸

Todas as fotos dos nossos eventos estão disponíveis na página "Eventos" do site!

Lá você encontra:
• 📷 Galeria de fotos
• 🎥 Vídeos das atividades
• 👥 Registros das participações
• 🏆 Momentos especiais

*Quer ver as fotos agora?*`, 'eventos');            
            addActionButton('🖼️ Ver Galeria de Fotos', () => {
                window.location.href = 'eventos.html';
            });
            
        } else if (input.includes('participar') || input.includes('inscrever')) {
            addBotMessage(`*Como Participar dos Eventos:* 🎊

**Para alunos:**
1. Fique atento aos comunicados
2. Inscreva-se com o professor responsável
3. Participe dos ensaios/preparações

**Para pais/responsáveis:**
1. Acompanhe as datas no site
2. Confirme presença quando solicitado
3. Participe das reuniões preparatórias

**Para comunidade:**
• Eventos abertos serão divulgados
• Siga nossas redes sociais
• Consulte a secretaria

*Todos são bem-vindos!* 😊`, 'eventos');
        } else if (input.includes('voltar')) {
            backToMainMenu();
            return;
        } else if (input.includes('calendario') || input.includes('calendário')) {
            // Tratamento para calendário nos eventos
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola com todas as datas importantes!`, 'eventos');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
            
            showSuggestions([
                { text: '📅 Próximos eventos', value: 'proximos' },
                { text: '🔙 Voltar ao menu', value: 'voltar' }
            ]);
            return;
        }
        
        showSuggestions([
            { text: '📅 Ver calendário completo', value: 'calendario' },
            { text: '📸 Mais fotos', value: 'maisfotos' },
            { text: '🔙 Menu principal', value: 'menu' },
        ]);
    }
    
    function handleLocalizacao(input) {
        if (input.includes('maps') || input.includes('mapa')) {
            addBotMessage(`*Google Maps:* 🗺️

Clique no botão abaixo para abrir a localização exata da escola no Google Maps.`, 'localizacao');
            
            addActionButton('📍 Abrir no Google Maps', () => {
                const address = encodeURIComponent(`${escolaInfo.endereco}, Luís Gomes - RN`);
                window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
            });
            
        } else if (input.includes('rota') || input.includes('como chegar')) {
            addBotMessage(`*Melhor Rota:* 🚗

**Vindo do centro:**
1. Siga pela Avenida Principal
2. Vire na Rua da Matriz
3. Siga até a Praça Central
4. A escola fica ao lado da igreja

**Vindo de fora:**
• Use o aplicativo Waze ou Google Maps
• Digite: "${escolaInfo.nome}"
• Ou use o endereço completo

*Precisa de orientação específica de algum bairro?*`, 'localizacao');
            
        } else if (input.includes('estacionamento') || input.includes('parar') || input.includes('carro')) {
            addBotMessage(`*Estacionamento:* 🅿️

**Opções disponíveis:**
1. 🆓 *Frente da escola* - Vagas limitadas (15 minutos)
2. 🆓 *Rua lateral* - Estacionamento público
3. 🆓 *Praça Central* - A 100 metros da escola

**Recomendações:**
• Chegue com antecedência
• Respeite as vagas para idosos/PCD
• Evite horários de entrada/saída

*Observação:* Não temos estacionamento privativo.`, 'localizacao');
            
        } else if (input.includes('voltar')) {
            backToMainMenu();
            return;
        } else if (input.includes('calendario') || input.includes('calendário')) {
            // Tratamento para calendário na localização
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola!`, 'localizacao');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
        }
        
        showSuggestions([
            { text: '🗺️ Ver mapa ampliado', value: 'mapa' },
            { text: '🚗 Calcular rota', value: 'calcular' },
            { text: '🔙 Menu principal', value: 'menu' },
            { text: '📞 Pedir orientação', value: 'orientacao' }
        ]);
    }
    
    function handleMatricula(input) {
        if (input.includes('documento') || input.includes('papel')) {
            addBotMessage(`*Documentação Completa:* 📋

**PARA O ALUNO:**
1. RG original e cópia (ou Certidão de Nascimento)
2. CPF (se tiver)
3. Comprovante de vacinação
4. 2 fotos 3x4 recentes
5. Histórico escolar (para transferência)

**PARA O RESPONSÁVEL:**
1. RG original e cópia
2. CPF original e cópia
3. Comprovante de residência atualizado
4. Comprovante de renda (para programas sociais)

**DOCUMENTOS ADICIONAIS:**
• Declaração de transferência (se aplicável)
• Laudos médicos (se houver necessidades especiais)

*Dica:* Traga também cópias simples de todos os documentos.`, 'matricula');
            
        } else if (input.includes('data') || input.includes('quando') || input.includes('período')) {
            addBotMessage(`*Datas Importantes:* 📅

**CALENDÁRIO DE MATRÍCULAS 2024:**

🟢 **PRÉ-MATRÍCULA (Renovação):**
• Período: 20 a 30 de novembro
• Para: Alunos já matriculados

🟡 **MATRÍCULA REGULAR:**
• Período: 15 a 30 de janeiro
• Para: Novos alunos (vagas remanescentes)

🔴 **MATRÍCULA TARDIA:**
• Período: A partir de 1º de fevereiro
• Para: Vagas eventualmente disponíveis

*Importante:* As vagas são limitadas.`, 'matricula');
            
        } else if (input.includes('valor') || input.includes('taxa') || input.includes('custo') || input.includes('pagar')) {
            addBotMessage(`*Taxas e Valores:* 💰

A **Escola Estadual Mariana Cavalcanti** é uma instituição pública, portanto:

✅ **MATRÍCULA GRATUITA**
✅ **MENSALIDADE GRATUITA**
✅ **MATERIAL DIDÁTICO BÁSICO GRATUITO**

**Custos eventuais:**
• 📚 Material complementar (opcional)
• 👕 Uniforme escolar (compra única)
• 🎒 Itens pessoais do aluno
• 🚌 Transporte (se necessário)

*Valores específicos podem ser consultados na secretaria.*`, 'matricula');
            
        } else if (input.includes('voltar')) {
            backToMainMenu();
            return;
        } else if (input.includes('calendario') || input.includes('calendário')) {
            // Tratamento para calendário na matrícula
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola!`, 'matricula');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
        }
        
        showSuggestions([
            { text: '📋 Mais sobre documentos', value: 'maisdocs' },
            { text: '📅 Ver período de matrícula', value: 'periodo' },
            { text: '🔙 Menu principal', value: 'menu' },
            { text: '📞 Falar com secretaria', value: 'secretaria' }
        ]);
    }
    
    function handleDuvidaEspecifica(input) {
        // Respostas para dúvidas específicas
        if (input.includes('uniforme') || input.includes('farda')) {
            addBotMessage(`*Uniforme Escolar:* 👕

**Obrigatório para todos os alunos:**
• Camiseta branca com logo da escola
• Calça/bermuda jeans
• Tênis (qualquer cor)

**Onde comprar:**
📍 Secretaria da escola
💰 Valor: R$ 45,00 (kit completo)

**Importante:**
• Usar todos os dias
• Identificar com nome
• Manter limpo e em bom estado

*Dúvidas sobre tamanhos? Consulte a secretaria.*`, 'duvida');
            
        } else if (input.includes('merenda') || input.includes('lanche') || input.includes('comida')) {
            addBotMessage(`*Merenda Escolar:* 🍎

**Oferecemos diariamente:**
• Café da manhã (turno da manhã)
• Almoço (turno da tarde)
• Lanches nutritivos

**Cardápio supervisionado por nutricionista**
• Frutas e verduras frescas
• Proteínas balanceadas
• Hidratação adequada

**Para alunos com restrições:**
Informe na secretaria para adaptarmos o cardápio.`, 'duvida');
            
        } else if (input.includes('transporte') || input.includes('ônibus') || input.includes('busão')) {
            addBotMessage(`*Transporte Escolar:* 🚌

A escola não fornece transporte próprio, mas:

**Opções disponíveis:**
1. 🚌 *Ônibus municipal* - Linhas que passam próximas
2. 🚐 *Van escolar* - Serviços particulares
3. 🚗 *Carona solidária* - Organizada entre pais
4. 🚶 *A pé* - Para moradores próximos

**Sugestão:** Entre em contato com outros pais da sua região para combinar caronas.`, 'duvida');
            
        } else if (input.includes('calendario') || input.includes('calendário')) {
            // Tratamento para calendário nas dúvidas
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola!`, 'duvida');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
            
        } else {
            addBotMessage(`Entendi sua dúvida sobre *"${input}"*! 😊

Infelizmente não tenho informações específicas sobre isso no momento.

**Recomendo:**
1. 📞 Ligar para a secretaria: ${escolaInfo.telefone}
2. ✉️ Enviar e-mail: ${escolaInfo.email}
3. 🏫 Visitar a escola pessoalmente

*Posso te ajudar com outra coisa?*`, 'duvida');
        }
        
        showMainSuggestions();
    }
    
    function handleDefault(input) {
        if (input.includes('calendario') || input.includes('calendário')) {
            addBotMessage(`*Calendário Escolar Completo:* 🗓️

Clique no botão abaixo para ver o calendário completo da escola!`, 'default');
            
            addActionButton('🗓️ Abrir Calendário Completo', () => {
                window.location.href = 'calendario.html';
            });
            
            showMainSuggestions();
            return;
        }
        
        addBotMessage(`Entendi! Você mencionou: *"${input}"*

Vou te redirecionar para quem pode ajudar melhor:

**Para dúvidas específicas:**
📞 ${escolaInfo.telefone}
✉️ ${escolaInfo.email}

**Enquanto isso, posso te ajudar com:**`, 'default');
        
        showMainSuggestions();
    }
    
    // ========== FUNÇÕES AUXILIARES ==========
    
    function backToMainMenu() {
        currentStep = 'saudacao';
        addBotMessage(`*Voltando ao menu principal...* 🔄

*Como posso te ajudar agora?* 😊`, 'menu');
        
        showMainSuggestions();
    }
    
    function showMainSuggestions() {
        showSuggestions([
            { text: '📅 Eventos escolares', value: 'eventos' },
            { text: '🕐 Horários', value: 'horarios' },
            { text: '📞 Contato/Secretaria', value: 'contato' },
            { text: '📍 Localização', value: 'localizacao' },
            { text: '📝 Matrículas', value: 'matricula' },
            { text: '👕 Uniforme/Merenda', value: 'duvida' },
            { text: '❌ Encerrar atendimento', value: 'fechar' }
        ]);
    }
    
    // ========== FUNÇÕES DE UI ==========
    
    function addBotMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message bot ${type}`;
        
        const time = getCurrentTime();
        
        // Substituir *texto* por negrito
        const formattedText = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        
        messageDiv.innerHTML = `
            <div class="message-content">${formattedText.replace(/\n/g, '<br>')}</div>
            <div class="message-time">${time}</div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        const time = getCurrentTime();
        
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${time}</div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function showSuggestions(options) {
        // Remover sugestões anteriores
        const oldSuggestions = document.querySelectorAll('.suggestions-container');
        oldSuggestions.forEach(s => s.remove());
        
        const container = document.createElement('div');
        container.className = 'suggestions-container';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            button.innerHTML = option.text;
            button.onclick = () => {
                chatbotInput.value = option.value;
                if (option.value === 'fechar') {
                    addBotMessage(`*Atendimento encerrado.* Obrigada por conversar comigo! 😊

Qualquer dúvida, estarei aqui. Tenha um ótimo dia! 👋`, 'fechar');
                    setTimeout(closeChat, 2000);
                } else if (option.value === 'voltar') {
                    chatbotInput.value = 'voltar';
                } else if (option.value === 'menu') {
                    backToMainMenu();
                    return;
                } else if (option.value === 'calendario') {
                    // TRATAMENTO ESPECÍFICO PARA CALENDÁRIO
                    chatbotInput.value = 'calendario';
                    processUserInput();
                } else {
                    processUserInput();
                }
            };
            container.appendChild(button);
        });
        
        chatbotMessages.appendChild(container);
        scrollToBottom();
    }
    
    function addActionButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'action-btn';
        button.innerHTML = text;
        button.onclick = onClick;
        
        const container = document.createElement('div');
        container.className = 'action-container';
        container.appendChild(button);
        
        chatbotMessages.appendChild(container);
        scrollToBottom();
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="typing-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </span>
            </div>
        `;
        
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    function removeTypingIndicator() {
        const typing = document.querySelector('.typing');
        if (typing) typing.remove();
    }
    
    function clearChat() {
        chatbotMessages.innerHTML = '';
    }
    
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    }
    
    function scrollToBottom() {
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
    }
    
    function toggleChat() {
        if (isChatOpen) {
            closeChat();
        } else {
            openChat();
        }
    }
    
    function openChat() {
        chatbotContainer.classList.remove('chatbot-hidden');
        chatbotContainer.classList.add('chatbot-visible');
        isChatOpen = true;
        chatbotNotification.style.display = 'none';
        chatbotInput.focus();
    }
    
    function closeChat() {
        chatbotContainer.classList.remove('chatbot-visible');
        chatbotContainer.classList.add('chatbot-hidden');
        isChatOpen = false;
    }
    
    // Inicializar
    initChatbot();
    
    // Adicionar estilos dinâmicos
    const style = document.createElement('style');
    style.textContent = `
        .suggestions-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
            animation: fadeIn 0.3s ease;
        }
        
        .suggestion-btn {
            background: #f0f7ff;
            border: 2px solid #3498db;
            color: #2c3e50;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s;
            flex: 1;
            min-width: 120px;
            text-align: center;
        }
        
        .suggestion-btn:hover {
            background: #3498db;
            color: white;
            transform: translateY(-2px);
        }
        
        .action-container {
            margin: 10px 0;
            animation: fadeIn 0.5s ease;
        }
        
        .action-btn {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            transition: all 0.3s;
            font-weight: 600;
        }
        
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
        }
        
        .typing .message-content {
            display: flex;
            align-items: center;
            height: 20px;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots .dot {
            width: 8px;
            height: 8px;
            background: #3498db;
            border-radius: 50%;
            animation: bounce 1.4s infinite;
        }
        
        .typing-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .message.bot strong {
            color: #2c3e50;
            font-weight: 600;
        }
        
        .message.eventos {
            border-left: 4px solid #9b59b6;
        }
        
        .message.horarios {
            border-left: 4px solid #3498db;
        }
        
        .message.contato {
            border-left: 4px solid #2ecc71;
        }
        
        .message.localizacao {
            border-left: 4px solid #e74c3c;
        }
        
        .message.matricula {
            border-left: 4px solid #f39c12;
        }
        
        .message.duvida {
            border-left: 4px solid #1abc9c;
        }
        
        .message.fechar {
            border-left: 4px solid #95a5a6;
        }
    `;
    document.head.appendChild(style);
    
    // Expor funções globalmente
    window.chatbot = {
        open: openChat,
        close: closeChat,
        restart: startConversation
    };
    
    console.log('💬 Chatbot Teleatendimento carregado com sucesso!');
    console.log('👤 Assistente: Mariana (Virtual)');
    console.log('🏫 Escola: ' + escolaInfo.nome);
    console.log('📊 Eventos carregados: ' + eventosReais.length);
});