const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Account = sequelize.define("account", {
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
