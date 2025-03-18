const mongoose = require('mongoose');
// Definindo um modelo
const strategySchema = new mongoose.Schema({    
    strategy: {type: String},
    isOpened: {type: Boolean},
    symbol: {type: String},
    buyPrice: {type: Number},
    sellPrice: {type: Number},
    quantity: {type: String},
    period: {type: Number},
    active: {type: Boolean, default: false},
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Nome do modelo referenciado 
    }
});

// Criar o modelo
module.exports = mongoose.model('Strategy', strategySchema);


const Sequelize = require('sequelize');
class Strategy extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        strategy: Sequelize.STRING,
        isOpened: Sequelize.BOOLEAN,
        symbol: Sequelize.STRING,
        buyPrice: Sequelize.DOUBLE,
        sellPrice: Sequelize.DOUBLE,
        quantity: Sequelize.STRING,
        period: Sequelize.INTEGER,
        active: {type: Sequelize.BOOLEAN, defaultValue: false},
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
        }
      },
      {
        sequelize,			
        tableName: 'tb_strategy',
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

module.exports = Strategy
