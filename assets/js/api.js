// ============================================
// CONFIGURAÇÃO DA API
// ============================================

// NOVA URL DO GOOGLE APPS SCRIPT (com FOTOS ESCOLA)
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwn9fKWJZyH3LaDiZqk-XkSbUdVgICnUNig4kuTGpbDFtU5WV0e2qLx6kOwgg5uBTf5yg/exec';

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Busca dados de uma planilha específica
 * @param {string} planilha - Nome da planilha (EVENTOS, HORARIOS, COMUNICADOS, FOTOS ESCOLA)
 * @param {string} aba - Nome da aba na planilha
 * @returns {Promise<Array>} Array com os dados da planilha
 */
async function fetchData(planilha, aba) {
    try {
        console.log(`Buscando dados: planilha="${planilha}", aba="${aba}"`);
        
        const response = await fetch(`${WEBAPP_URL}?planilha=${encodeURIComponent(planilha)}&aba=${encodeURIComponent(aba)}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica se a API retornou um erro
        if (data.error) {
            console.error('Erro da API:', data.error);
            return [];
        }
        
        // Verifica se é um array
        if (!Array.isArray(data)) {
            console.error('Resposta não é array:', data);
            return [];
        }
        
        console.log(`Dados recebidos: ${data.length} registros`);
        
        // Remove linhas COMPLETAMENTE VAZIAS
        const dadosFiltrados = data.filter(item => {
            return Object.values(item).some(valor => 
                valor !== null && 
                valor !== undefined && 
                valor.toString().trim() !== ''
            );
        });
        
        console.log(`Dados filtrados: ${dadosFiltrados.length} registros`);
        return dadosFiltrados;
        
    } catch (error) {
        console.error(`Erro ao buscar dados de ${planilha}:`, error);
        return [];
    }
}

/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 * @param {string} dataString - Data em formato string
 * @returns {string} Data formatada
 */
function formatarData(dataString) {
    if (!dataString) return '';
    
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) {
            return dataString; // Retorna a string original se não for data válida
        }
        return data.toLocaleDateString('pt-BR');
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dataString;
    }
}

/**
 * Converte links do Google Drive para links de imagem diretos
 * @param {string} urlString - String com URLs (pode ter múltiplas separadas por vírgula)
 * @returns {Array} Array com URLs convertidas
 */
function converterLinksDrive(urlString) {
    if (!urlString || urlString.trim() === '') return [];
    
    const urls = urlString.split(',').map(url => url.trim()).filter(url => url !== '');
    const urlsConvertidas = [];
    
    urls.forEach(url => {
        // Extrai ID do Google Drive (padrão: /d/ID/)
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        
        if (match) {
            // Formato que funciona para imagens públicas do Google Drive
            const imageUrl = `https://lh3.googleusercontent.com/d/${match[1]}=w800-h500-p`;
            urlsConvertidas.push(imageUrl);
        }
        // Se já for um link direto de imagem, mantém
        else if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp)/i) || 
                 url.includes('lh3.googleusercontent.com') ||
                 url.includes('drive.google.com/uc')) {
            urlsConvertidas.push(url);
        }
        // Tenta outros padrões comuns do Google Drive
        else if (url.includes('drive.google.com')) {
            const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/) || 
                           url.match(/file\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch) {
                urlsConvertidas.push(`https://lh3.googleusercontent.com/d/${idMatch[1]}=w800`);
            }
        }
    });
    
    return urlsConvertidas.length > 0 ? urlsConvertidas : [];
}

/**
 * Busca fotos da escola (função específica)
 * @returns {Promise<Array>} Array com as fotos da escola
 */
async function buscarFotosEscola() {
    console.log('Buscando fotos da escola...');
    
    try {
        // Usa "FOTOS ESCOLA" como nome da planilha e da aba
        const fotos = await fetchData("FOTOS ESCOLA", "FOTOS ESCOLA");
        
        if (fotos.length === 0) {
            console.log('Nenhuma foto encontrada na planilha');
            return [];
        }
        
        console.log(`Encontradas ${fotos.length} fotos na planilha`);
        
        // Filtra apenas fotos com links válidos
        const fotosValidas = fotos.filter(foto => {
            const temLink = foto.LINK && foto.LINK.trim() !== '';
            if (!temLink) {
                console.log('Foto sem link válido:', foto);
            }
            return temLink;
        });
        
        console.log(`${fotosValidas.length} fotos com links válidos`);
        return fotosValidas;
        
    } catch (error) {
        console.error('Erro ao buscar fotos da escola:', error);
        return [];
    }
}

// ============================================
// FUNÇÕES AUXILIARES PARA DEBUG
// ============================================

/**
 * Testa a conexão com todas as planilhas (apenas para desenvolvimento)
 * @returns {Promise<void>}
 */
async function testarConexoesAPI() {
    if (window.location.hostname === 'localhost' || 
        window.location.hostname.includes('127.0.0.1')) {
        
        console.log('=== TESTE DE CONEXÃO DA API ===');
        
        // Testa eventos
        const eventos = await fetchData("EVENTOS", "EVENTOS");
        console.log(`✅ EVENTOS: ${eventos.length} registros`);
        
        // Testa fotos
        const fotos = await buscarFotosEscola();
        console.log(`✅ FOTOS ESCOLA: ${fotos.length} fotos`);
        
        if (fotos.length > 0) {
            console.log('Exemplo de link convertido:', converterLinksDrive(fotos[0].LINK || ''));
        }
        
        console.log('=== FIM DO TESTE ===');
    }
}

// Testa automaticamente em ambiente de desenvolvimento
if (window.location.hostname === 'localhost' || 
    window.location.hostname.includes('127.0.0.1')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(testarConexoesAPI, 1000);
    });
}
async function buscarFotosEstrutura() {
    console.log('🏫 Buscando fotos da estrutura...');
    const fotos = await fetchData("FOTOS ESCOLA", "FOTOS ESCOLA ESTRUTURA");
    return fotos.filter(foto => foto.LINK && foto.LINK.trim() !== '');
}

window.buscarFotosEstrutura = buscarFotosEstrutura;
// ============================================
// EXPORTAÇÕES (se necessário para módulos)
// ============================================

// Se estiver usando módulos ES6:
// export { fetchData, formatarData, converterLinksDrive, buscarFotosEscola };

// Para uso global (compatibilidade com código existente):
window.fetchData = fetchData;
window.formatarData = formatarData;
window.converterLinksDrive = converterLinksDrive;
window.buscarFotosEscola = buscarFotosEscola;

console.log('API.js carregado com sucesso!');