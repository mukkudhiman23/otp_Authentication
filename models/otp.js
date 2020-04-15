'use strict';
module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define('Otp', {
    
    user_id: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    tries: DataTypes.INTEGER
  }, {});
  Otp.associate = function(models) {
    // associations can be defined here
  };
  return Otp;
};