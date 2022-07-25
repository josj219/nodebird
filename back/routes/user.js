const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const passport = require("passport");
const router = express.Router();

router.post("/login", (req, res, next) => {
  console.log("LOGIN ROUTES RECEIVE API");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(error);
    }
    if (info) {
      console.log(info.reason);
      return res.status(401).send(info.reason); //http 상태코드 검색하면 알 수 잇음
    }
    return req.login(user, async (loginErr) => {
      // 패스포트 로그인 에러임 - 이건 우리 서비스랑 관계 ㄴㄴ 살면서 에러난지 없다
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.post("/user/logout", (req, res, next) => {
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
      return res.stats(403).send("이미 사용중인 아이디입니다.");
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
