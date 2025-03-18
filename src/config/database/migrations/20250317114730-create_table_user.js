'use strict';
const tableName = 'tb_user'
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
				name: {type: Sequelize.Sequelize.STRING, allowNull: false},
				email: {type: Sequelize.STRING, allowNull: false, unique: true,},
				username: {type: Sequelize.STRING, allowNull: false, unique: true,},
				password: {type: Sequelize.STRING},
				chatId: {type: Sequelize.STRING, unique: true,},
				phone: Sequelize.STRING,
				agree: Sequelize.BOOLEAN,
				approved: Sequelize.BOOLEAN,
				dtApproved: Sequelize.DATE,			
				obs: Sequelize.STRING,
				createdAt: Sequelize.DATE,
				updatedAt: Sequelize.DATE,
			}
		);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable({ tableName });
	},
};
