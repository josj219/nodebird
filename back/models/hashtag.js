module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      //id 기본적으로 들어있음
      name: {
        type: DataTypes.STRING(20),
        allowNull: false, //
      },
    },
    {
      charset: "utf8mb4", // 한글에 이모티콘까지
      collate: "utf8mb4_general_ci", // 한글저장
    }
  );
  Hashtag.associate = (db) => {};
  return Hashtag;
};
