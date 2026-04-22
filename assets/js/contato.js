// ================================
// CONTATO.JS
// Formulário de contato via WhatsApp + Mapa Leaflet
// Compatível com GitHub Pages
// ================================

document.addEventListener('DOMContentLoaded', function () {

    // ================================
    // PARTE 1: FORMULÁRIO DE CONTATO
    // ================================
    const formContato = document.getElementById('formContato');
    
    if (formContato) {
        const telefoneWhatsApp = "5584999746224";

        // ENVIO DO FORMULÁRIO
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

            // Limpar formulário
            formContato.reset();
        });

        // MÁSCARA DE TELEFONE (BR)
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
    }

    // ================================
    // PARTE 2: MAPA LEAFLET (SATÉLITE)
    // ================================
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        // Coordenadas da escola
        const lat = -6.415931806025811;
        const lng = -38.386494279584966;
        
        // Criar o mapa com zoom 18 (mais estável)
        const map = L.map('map').setView([lat, lng], 18);
        
        // =============================================
        // CAMADA DE SATÉLITE - GOOGLE SATELLITE (HÍBRIDO)
        // =============================================
        // Esta camada tem melhor cobertura e não some no zoom
        L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            attribution: '&copy; <a href="https://maps.google.com/">Google Maps</a>',
            maxZoom: 20,
            maxNativeZoom: 19  // Zoom máximo nativo que o Google oferece
        }).addTo(map);
        
        // =============================================
        // CAMADA DE RÓTULOS (NOMES DE RUAS)
        // =============================================
        L.tileLayer('https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}', {
            attribution: '&copy; <a href="https://maps.google.com/">Google Maps</a>',
            maxZoom: 20,
            maxNativeZoom: 19,
            opacity: 0.7  // Leve transparência para os rótulos
        }).addTo(map);
        
        // Ícone personalizado com o logo da escola
        const schoolIcon = L.divIcon({
            html: '<img src="assets/img/LOGO.png" class="marker-logo" alt="Escola Mariana Cavalcanti" style="width: 45px; height: 45px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); object-fit: cover; background-color: white;">',
            className: 'custom-marker',
            iconSize: [45, 45],
            iconAnchor: [22, 45],
            popupAnchor: [0, -45]
        });
        
        // Adicionar marcador da escola (popup fechado por padrão)
        const marker = L.marker([lat, lng], { icon: schoolIcon }).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center;">
                <img src="assets/img/LOGO.png" alt="Logo" style="width: 40px; height: 40px; margin-bottom: 5px;"><br>
                <strong>Escola Estadual Mariana Cavalcanti</strong><br>
                AV. SENHORA SANTANA, 09 - CENTRO<br>
                Luís Gomes - RN<br>
                <a href="https://maps.google.com/maps?q=-6.415931806025811,-38.386494279584966&z=19&t=k" target="_blank" style="color: #2c5282; display: inline-block; margin-top: 5px;">
                    <i class="fas fa-satellite"></i> Ver no Google Maps (Satélite)
                </a>
            </div>
        `);
        
        // Ajustar o mapa quando a janela for redimensionada
        window.addEventListener('resize', function() {
            map.invalidateSize();
        });
        
        console.log('🗺️ Mapa satélite (Google) carregado com sucesso!');
    }

});