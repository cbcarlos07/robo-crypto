'use strict';
const tableName = 'tb_strategy'
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
				strategy: Sequelize.STRING,
				isOpened: Sequelize.BOOLEAN,
				symbol: Sequelize.STRING,
				buyPrice: Sequelize.DOUBLE,
				sellPrice: Sequelize.DOUBLE,
				quantity: Sequelize.STRING,
				period: Sequelize.INTEGER,
				active: {type: Sequelize.BOOLEAN, defaultValue: false},
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
