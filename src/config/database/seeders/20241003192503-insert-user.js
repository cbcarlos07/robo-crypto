'use strict';
const { Op, fn } = require('sequelize');
const tableName = 'tb_user'
module.exports = {
	up: async (queryInterface, Sequelize) => {
    try {
        await queryInterface.bulkInsert(
          { tableName },
          [
            {
              name: 'Carlos Bruno',
              email: 'cbcarlos07@gmail.com',
              username: 'cbcarlos',
              password: '0cf98cefee12737417461ebdd5c02027',
              chatId: '7294909585',
              phone: '22981290226',
              agree: true,
              approved: true,
              dtApproved: fn('NOW'),
              apiKey: 'MSHfKzRyNzU6PmAAVgWFllzQg4sRWHvgaqCFwzxDpWqxN1cXD9X9kjqIjF133NLS',
              secretKey: '2TO5XBYYGRNa6szJhWxGeqaZG6T7FQPoaxTTubPsqCm7GRfWVU47XEL7XBYP0MXH',
              obs: '-',
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
      { id: { [Op.in]: [1] } }
    );
  },

};
