const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwN7aGelD0RxDhY6RZZYi6PI2kS0mdbvcMjFKugJ6beyy6p7s3aGeeN-PN9E9t2V5Ke/exec';

async function fetchData(planilha, aba) {
    try {
        const response = await fetch(`${WEBAPP_URL}?planilha=${planilha}&aba=${aba}`);
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
        
        // Remove linhas COMPLETAMENTE VAZIAS (todas as células vazias)
        return data.filter(item => {
            return Object.values(item).some(valor => 
                valor !== null && valor !== undefined && valor.toString().trim() !== ''
            );
        });
        
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return [];
    }
}

// Função para formatar data (converte UTC para dd/mm/aaaa)
function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para converter links do Google Drive
function converterLinksDrive(urlString) {
    if (!urlString || urlString.trim() === '') return [];
    
    const urls = urlString.split(',').map(url => url.trim());
    
    return urls.map(url => {
        // Extrai ID do Google Drive (padrão: /d/ID/)
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
            // Formato que funciona para imagens públicas
            return `https://lh3.googleusercontent.com/d/${match[1]}=w400`;
        }
        
        // Se já for um link direto de imagem, mantém
        if (url.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
            return url;
        }
        
        return null;
    }).filter(url => url !== null);
}