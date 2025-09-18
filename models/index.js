const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const db = {};
const User = require("./user");
const Chat = require("./chat");
const Air = require("./air");
const Position = require("./position");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Chat = Chat;
db.Air = Air;
db.Position = Position;

User.init(sequelize);
Chat.init(sequelize);
Air.init(sequelize);
Position.init(sequelize);

User.associate(db);
Chat.associate(db);
Air.associate(db);
Position.associate(db);
module.exports = db;
