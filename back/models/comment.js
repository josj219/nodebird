module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment", // Comment 는 모델 이름 -> Comments테이블 자동 생성
    {
      //id 기본적으로 들어있음
      content: {
        type: DataTypes.TEXT,
        allowNull: false, // 필수
      },
      //UserId:{}  belnogTo가 있는 애한테 이게 생김
      //PostID:{}  belnogTo가 있는 애한테 이게 생김
    },
    {
      charset: "utf8mb4", // 한글에 이모티콘까지
      collate: "utf8mb4_general_ci", // 한글저장
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
