const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    origin: {type: String, required: true, unique: true},
    token: {type: String, required: true,},
    
})

module.exports = mongoose.model('token', tokenSchema)


const Sequelize = require('sequelize');
class Error extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,			
        tableName: 'tb_fill',
        timestamps: false,
        underscored: false
      }
    );
    
    return this;
  }

  static associate(models){
    const { Operation } = models
    
    this.belongsTo( Operation, {
      foreignKey: {
          name:  'operationId'
      },
      as: '_operation'
    }) 
    
  }


}

module.exports = Error
