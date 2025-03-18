'use strict';
const { Op, fn } = require('sequelize');
const tableName = 'tb_strategy'
module.exports = {
	up: async (queryInterface, Sequelize) => {
    try {
        await queryInterface.bulkInsert(
          { tableName },
          [
            {
              strategy: 'PRICE',
              isOpened: false,
              symbol: 'BTCUSDT',
              buyPrice: 81320,
              sellPrice: 83257,
              quantity: '0.001',
              userId: 1,
              active: true,
              url: 'https://testnet.binance.vision',
              apiKey: 'MSHfKzRyNzU6PmAAVgWFllzQg4sRWHvgaqCFwzxDpWqxN1cXD9X9kjqIjF133NLS',
              secretKey: '2TO5XBYYGRNa6szJhWxGeqaZG6T7FQPoaxTTubPsqCm7GRfWVU47XEL7XBYP0MXH',
              createdAt: fn('NOW'),
              updatedAt: fn('NOW')
            },
            {
              strategy: 'RSI',
              isOpened: false,
              symbol: 'BTCUSDT',
              buyPrice: 30,
              sellPrice: 70,
              quantity: '0.001',
              userId: 1,
              active: true,
              period: 14,
              url: 'https://testnet.binance.vision',
              apiKey: 'MSHfKzRyNzU6PmAAVgWFllzQg4sRWHvgaqCFwzxDpWqxN1cXD9X9kjqIjF133NLS',
              secretKey: '2TO5XBYYGRNa6szJhWxGeqaZG6T7FQPoaxTTubPsqCm7GRfWVU47XEL7XBYP0MXH',
              createdAt: fn('NOW'),
              updatedAt: fn('NOW')
            },
            
          ]
          
          
        )
        Promise.resolve()
    } catch (error) {
      
      Promise.reject(error)
    }
	},
	down: queryInterface => {
    return queryInterface.bulkDelete(
      { schema, tableName },
      { id: { [Op.in]: [1,2] } }
    );
  },

};
