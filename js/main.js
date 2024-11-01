// Função para buscar coordenadas (latitude e longitude) de uma cidade a partir de seu nome usando a API Nominatim
function buscarCoordenadas(nomeCidadeId, latitudeId, longitudeId) {
    // Obtém o nome da cidade a partir do campo de entrada (input)
    const nomeCidade = document.getElementById(nomeCidadeId).value;
    
    // Monta a URL para fazer a requisição à API Nominatim
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeCidade)}&format=json&limit=1`;
    
    // Faz a requisição à API
    fetch(url)
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            // Se a API retornar resultados, preenche os campos de latitude e longitude
            if (data.length > 0) {
                const location = data[0];
                document.getElementById(latitudeId).value = location.lat;
                document.getElementById(longitudeId).value = location.lon;
            } else {
                // Exibe alerta se não encontrar a cidade
                alert('Não foi possível encontrar as coordenadas. Verifique o nome da cidade.');
            }
        })
        .catch(error => {
            // Exibe erro em caso de falha na requisição
            console.error('Erro ao buscar coordenadas:', error);
            alert('Ocorreu um erro ao buscar as coordenadas.');
        });
}

// Função para calcular o ângulo da sombra a partir da altura do objeto e do comprimento da sombra
function calcularAnguloSombra(altura, comprimentoSombra) {
    // Calcula o ângulo da sombra em radianos e converte para graus
    const anguloRad = Math.atan( comprimentoSombra / altura );
    const anguloGraus = anguloRad * (180 / Math.PI);
    return anguloGraus; // Retorna o valor do ângulo em graus
}

// Função para calcular a distância entre duas coordenadas (latitude e longitude) usando a fórmula do haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio médio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Diferença de latitude convertida para radianos
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Diferença de longitude convertida para radianos
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2); // Fórmula do haversine
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Calcula o arco entre os pontos
    const distancia = R * c; // Calcula a distância em km
    console.log(distancia)
    return distancia;
}

// Função para calcular a circunferência da Terra a partir da distância entre as cidades e o ângulo entre elas
function calcularCircunferencia(distancia, anguloEmGraus) {
    return (360 / anguloEmGraus) * distancia; // Calcula a circunferência proporcional ao ângulo
}

// Função principal que realiza os cálculos ao clicar no botão "Calcular"
function calcular() {
    // Obtém valores de altura e sombra das duas cidades e suas coordenadas
    const alturaObjeto1 = parseFloat(document.getElementById('alturaObjeto1').value);
    const comprimentoSombra1 = parseFloat(document.getElementById('comprimentoSombra1').value);
    const latitudeCidade1 = parseFloat(document.getElementById('latitudeCidade1').value);
    const longitudeCidade1 = parseFloat(document.getElementById('longitudeCidade1').value);

    const alturaObjeto2 = parseFloat(document.getElementById('alturaObjeto2').value);
    const comprimentoSombra2 = parseFloat(document.getElementById('comprimentoSombra2').value);
    const latitudeCidade2 = parseFloat(document.getElementById('latitudeCidade2').value);
    const longitudeCidade2 = parseFloat(document.getElementById('longitudeCidade2').value);

    const latitudeCidade3 = parseFloat(document.getElementById('latitudeCidade3').value);
    const longitudeCidade3 = parseFloat(document.getElementById('longitudeCidade3').value);

    // Calcula os ângulos das sombras das duas cidades
    const anguloSombra1 = calcularAnguloSombra(alturaObjeto1, comprimentoSombra1);
    const anguloSombra2 = calcularAnguloSombra(alturaObjeto2, comprimentoSombra2);

    // Calcula as distâncias das duas cidades até a cidade de referência (cidade 3)
    const distancia1 = calcularDistancia(latitudeCidade1, longitudeCidade1, latitudeCidade3, longitudeCidade3);
    const distancia2 = calcularDistancia(latitudeCidade2, longitudeCidade2, latitudeCidade3, longitudeCidade3);

    // Calcula o ângulo entre as latitudes das duas cidades
    const anguloEntreCidades = Math.abs(latitudeCidade1 - latitudeCidade2);

    // Calcula a circunferência da Terra dividindo o resultado por 10 para ajuste de escala
    const circunferenciaTerra = calcularCircunferencia(distancia1, anguloEntreCidades) / 10;
    
    // Calcula o raio da Terra a partir da circunferência
    const raioTerra = circunferenciaTerra / (2 * Math.PI);

    // Exibe os resultados no HTML
    document.getElementById('resultadoAnguloSombra1').textContent = `Ângulo da sombra da Minha Cidade: ${anguloSombra1.toFixed(2)} graus`;
    document.getElementById('resultadoAnguloSombra2').textContent = `Ângulo da sombra da Cidade Escolhida: ${anguloSombra2.toFixed(2)} graus`;
    document.getElementById('resultadoCircunferenciaTerra').textContent = `Circunferência da Terra: ${circunferenciaTerra.toFixed(2)} km`;
    document.getElementById('resultadoRaioTerra').textContent = `Raio da Terra: ${raioTerra.toFixed(2)} km`;
}

// Função para limpar os campos e resultados na interface
function limpar() {
    // Limpa todos os campos de entrada (inputs) de texto e número
    const campos = document.querySelectorAll('input[type="text"], input[type="number"]');
    campos.forEach(campo => campo.value = '');

    // Reseta os resultados exibidos no HTML
    document.getElementById('resultadoAnguloSombra1').textContent = 'Ângulo da sombra da Minha Cidade:';
    document.getElementById('resultadoAnguloSombra2').textContent = 'Ângulo da sombra da Cidade Escolhida:';
    document.getElementById('resultadoCircunferenciaTerra').textContent = 'Circunferência da Terra:';
    document.getElementById('resultadoRaioTerra').textContent = 'Raio da Terra:';
}
