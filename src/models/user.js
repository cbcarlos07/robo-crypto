const Sequelize = require('sequelize');
class User extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,			
        tableName: 'tb_user',
        timestamps: true,
        underscored: false,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        defaultScope: {
          attributes: {
            exclude: ['password']
          },
        },
        scopes: {
          withPassword: {
            attributes: {
            include: ['password']
            }
          }
        }
      }
    );
    
    return this;
  }


}

module.exports = User
