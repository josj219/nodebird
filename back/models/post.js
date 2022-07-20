module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post", // Post 는 모델 이름 -> posts테이블 자동 생성
    {
      //id 기본적으로 들어있음
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      //Retweet
    },
    {
      charset: "utf8mb4", // 한글에 이모티콘까지
      collate: "utf8mb4_general_ci", // 한글저장
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); //1대다에서 1입장
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // 다대다 관계
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // 리트윗용
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
  };
  return Post;
};
