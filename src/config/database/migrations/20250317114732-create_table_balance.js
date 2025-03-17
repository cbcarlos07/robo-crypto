'use strict';
const tableName = 'tb_balance'
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			tableName,
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				buyPrice: Sequelize.DOUBLE ,
				sellPrice: Sequelize.DOUBLE ,
				quantity: Sequelize.STRING,
				buyTotal: Sequelize.DOUBLE,
				sellTotal: Sequelize.DOUBLE,
				profit: Sequelize.DOUBLE,
				percentageProfit: Sequelize.DOUBLE,
				production: Sequelize.BOOLEAN,
				userId: { 
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'tb_user',
						key: 'id'
					},
					onDelete: 'restrict',
					onUpdate: 'cascade'
				},
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE,
			}
		);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable({ tableName });
	},
};
