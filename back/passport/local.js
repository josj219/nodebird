const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

module.exports = () => {
  console.log("검증들어갑니다");
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.xxx 에 대한 설정
        passwordField: "password",
      },
      async (email, password, done) => {
        // 비동기 요청은 서버에러 발생할 거 대비해서 try catch 해줘야 한다
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            console.log("존재하지 않는 이메일");

            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
            // passport 는 응답 보내지 않음. done으로 결과 정함
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            console.log("result");

            return done(null, user); // 두번째 자리가 성공
          }
          console.log("비밀번호 틀림");
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          console.log("error 칸임다");
          return done(error);
        }
      }
    )
  );
};
