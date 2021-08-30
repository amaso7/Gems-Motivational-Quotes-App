'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavoriteQuote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  FavoriteQuote.init({
    quote: DataTypes.STRING,
    author: DataTypes.STRING,
    tag: DataTypes.STRING,
    quoteID: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FavoriteQuote',
  });
  return FavoriteQuote;
};