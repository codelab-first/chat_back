const Sequelize = require("sequelize");
module.exports = class Position extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        dmX: { type: Sequelize.FLOAT(10, 3), allowNull: false },
        dmY: { type: Sequelize.FLOAT(10, 3), allowNull: false },
        addr: { type: Sequelize.STRING, allowNull: false },
        sidoName: { type: Sequelize.STRING, allowNull: true },
        stationName: { type: Sequelize.STRING, unique: true },
        dataTime: { type: Sequelize.STRING, allowNull: false },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        paranoid: false,
        modelName: "Position",
        tableName: "positions",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Position.hasMany(db.Air);
  }
};
