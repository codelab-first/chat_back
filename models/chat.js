const Sequelize = require("sequelize");
module.exports = class Chat extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: { type: Sequelize.STRING(10) },
        chat: { type: Sequelize.STRING(150) },
        image: { type: Sequelize.STRING(200) },
         createdAt: { type: Sequelize.DATE, allowNull: true,
          allowNull: true,
          type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"), },
        updatedAt: { type: Sequelize.DATE, allowNull: true,
          allowNull: true,
          type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"), },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        paranoid: false,
        modelName: "Chat",
        tableName: "chats",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Chat.belongsTo(db.User);
  }
};
