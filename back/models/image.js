module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      //id 기본적으로 들어있음
      src: {
        type: DataTypes.STRING(200),
        allowNull: false, //
      },
    },
    {
      charset: "utf8", // 한글에 이모티콘까지
      collate: "utf8_general_ci", // 한글저장
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
};
