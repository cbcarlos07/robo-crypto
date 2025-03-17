
const Sequelize = require('sequelize');
class Operation extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,			
        tableName: 'tb_operation',
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

module.exports = Operation
