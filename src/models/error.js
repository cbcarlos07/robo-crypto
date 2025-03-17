
const Sequelize = require('sequelize');
class Error extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,			
        tableName: 'tb_error',
        timestamps: true,
        underscored: false,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      }
    );
    
    return this;
  }

  static associate(models){
    const { User } = models
    
    this.belongsTo( User, {
      foreignKey: {
          name:  'userId'
      },
      as: '_user'
    }) 
    
  }


}

module.exports = Error
