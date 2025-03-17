'use strict';
const tableName = 'tb_fill'
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
				price: Sequelize.STRING,
				qty: Sequelize.STRING,
				commission: Sequelize.STRING,
				commissionAsset: Sequelize.STRING,
				tradeId: Sequelize.INTEGER,
				operationId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'tb_operation',
						key: 'id'
					},
					onDelete: 'cascade',
					onUpdate: 'cascade'
				}
			}
		);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable({ tableName });
	},
};
