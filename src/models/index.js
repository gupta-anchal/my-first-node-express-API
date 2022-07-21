const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const mongo_uri = "mongodb://localhost:27017/training";
const basename = path.basename(__filename);
const db = {};
mongoose
  .connect(mongo_uri, { useNewUrlParser: true })
  .then((result) =>
    console.log("✅ Database connection has been established successfully.")
  )
  .catch((err) => console.error("Unable to connect to the database:", err));

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;