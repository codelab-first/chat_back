const Sequelize = require("sequelize");
module.exports = class Air extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // lat: { type: Sequelize.FLOAT, allowNull: false },
        // lon: { type: Sequelize.FLOAT, allowNull: false },
        so2Grade: { type: Sequelize.INTEGER, allowNull: true },
        o3Grade: { type: Sequelize.INTEGER, allowNull: true },
        khaiGrade: { type: Sequelize.INTEGER, allowNull: true },
        no2Grade: { type: Sequelize.INTEGER, allowNull: true },
        pm25Grade: { type: Sequelize.INTEGER, allowNull: true },
        pm10Grade: { type: Sequelize.INTEGER, allowNull: true },

        sidoName: { type: Sequelize.STRING, allowNull: true },
        stationName: { type: Sequelize.STRING, allowNull: true },
        dataTime: { type: Sequelize.STRING, allowNull: false },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        paranoid: false,
        modelName: "Air",
        tableName: "airs",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Air.belongsTo(db.Position);
  }
};
