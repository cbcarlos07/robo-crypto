'use strict';
const tableName = 'tb_error'
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
				code: Sequelize.INTEGER ,
				msg: Sequelize.STRING ,
				date: Sequelize.STRING ,
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
