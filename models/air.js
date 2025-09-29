const Sequelize = require("sequelize")
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
        coGrade: { type: Sequelize.INTEGER, allowNull: true },
        sidoName: { type: Sequelize.STRING, allowNull: false },
        so2Value: { type: Sequelize.FLOAT(10, 3), allowNull: true },
        o3Value: { type: Sequelize.FLOAT(10, 3), allowNull: true },
        khaiValue: { type: Sequelize.INTEGER, allowNull: true },
        no2Value: { type: Sequelize.FLOAT(10, 3), allowNull: true },
        pm25Value: { type: Sequelize.INTEGER, allowNull: true },
        pm10Value: { type: Sequelize.INTEGER, allowNull: true },
        coValue: { type: Sequelize.FLOAT(10, 3), allowNull: true },
        stationName: { type: Sequelize.STRING, unique: true, allowNull: false },
        dataTime: { type: Sequelize.STRING, allowNull: true },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: true,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
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
    )
  }
  static associate(db) {
    db.Air.belongsTo(db.Position, {
      targetKey: "stationName",
      foreignKey: "stationName",
    })
  }
}
