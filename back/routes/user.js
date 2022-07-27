const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Post } = require("../models");
const passport = require("passport");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

router.post("/login", isNotLoggedIn, (req, res, next) => {
  console.log("LOGIN ROUTES RECEIVE API");
  //isAuthenticated.. 이런거 왜 여기다 넣으면 되지 따로 파일 만들어서 미들웨어?
  // 밑에도 쓰일거니... 중복 방지 -> 미들웨어는 대부분 중복 방지하려고 만든거다.
  passport.authenticate("local", (err, user, info) => {
    console.log("authenticate 완료");
    if (err) {
      console.error(err);
      console.log(err);
      return next(error);
    }
    if (info) {
      console.log(info);
      return res.status(401).send(info.reason); //http 상태코드 검색하면 알 수 잇음
    }
    return req.login(user, async (loginErr) => {
      // 패스포트 로그인 에러임 - 이건 우리 서비스랑 관계 ㄴㄴ 살면서 에러난지 없다
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        // 다시 찾아서 그놈이랑 연결된 DB 다 들고옴
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  console.log("LOGOUT 시도");
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.post("/", async (req, res, next) => {
  //POST  /user
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 숫자 높을 수록 보안 세진다
    //const hashedPassword = req.body.password; // 숫자 높을 수록 보안 세진다
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.send("ok");
  } catch (error) {
    console.log(error);
    next(error); // status 500
  }
});

router.delete("/", (req, res) => {
  res.json({ id: 1, content: "hello" });
});

module.exports = router;
