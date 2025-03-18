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
