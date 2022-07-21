const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

router.post("/", async (req, res, next) => {
  //POST  /user
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      console.log("이미 사용중인 아이디");
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 숫자 높을 수록 보안 세진다
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    console.log("아이디 생성 완료");
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
