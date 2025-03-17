
const Sequelize = require('sequelize');
class Balance extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        buyPrice: Sequelize.DOUBLE ,
        sellPrice: Sequelize.DOUBLE ,
        quantity: Sequelize.STRING,
        buyTotal: Sequelize.DOUBLE,
        sellTotal: Sequelize.DOUBLE,
        profit: Sequelize.DOUBLE,
        percentageProfit: Sequelize.DOUBLE,
        production: Sequelize.BOOLEAN,
        url: Sequelize.STRING,
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
        tableName: 'tb_balance',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        underscored: false
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

module.exports = Balance
