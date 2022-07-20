module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", // User 는 모델 이름 -> users테이블 자동 생성
    {
      //id 기본적으로 들어있음
      email: {
        type: DataTypes.STRING(30), //많이 쓰는거, STRING, TEXt, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100), //암호화 하면 길이가 늘어나서 이래놓음
        allowNull: false, // 필수
      },
      //Post:{}    hasMany 인 쪽은 이런 애들 올 수 있따 - 여러 개 못가짐
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글저장
    }
  );
  User.associate = (db) => {
    //1대 다 관계
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    // through 는 중간테이블, as는 위 Post 랑 관계있는거 에랑 구분하려고
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  };
  return User;
};
