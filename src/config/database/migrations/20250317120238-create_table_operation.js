'use strict';
const tableName = 'tb_operation'
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
				symbol: { type: Sequelize.STRING, allowNull: false },
				orderId: { type: Sequelize.INTEGER, allowNull: false },
				clientOrderId: { type: Sequelize.STRING, allowNull: false },
				price: { type: Sequelize.STRING, allowNull: false },
				status: Sequelize.STRING ,
				side: Sequelize.STRING ,
				type: Sequelize.STRING ,
				executedQty:  Sequelize.DOUBLE,
				strategy: Sequelize.STRING,
				date: {type: Sequelize.STRING},
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
