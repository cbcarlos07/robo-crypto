require('dotenv').config()
const axios = require('axios');
const crypto = require('crypto');
const {API_KEY, SECRET_KEY} = process.env
const API_URL = 'https://testnet.binance.vision'; // URL da API da Binance Testnet


const requestTestnetFunds = async () => {
    const endpoint = '/api/v3/user/fund/transfer';

    // Parâmetros da solicitação
    const params = {
        asset: 'BTC', // ou qualquer outro ativo que você deseja
        amount: 1, // quantidade que você deseja depositar
        type: 1, // tipo de transferência: 1 para depósito
        timestamp: Date.now()
    };

    // Criando a assinatura
    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(new URLSearchParams(params).toString())
        .digest('hex');

    params.signature = signature;

    try {
        const response = await axios.post(
            `${API_URL}${endpoint}`,
            new URLSearchParams(params).toString(),
            {
                headers: { 'X-MBX-APIKEY': API_KEY }
            }
        );
        console.log('Fundos adicionados com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao adicionar fundos:', error.response);
    }
};

requestTestnetFunds();