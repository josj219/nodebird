const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Post, Comment, Image } = require("../models");
const passport = require("passport");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

router.get("/", async (req, res, next) => {
  //console.log(req.headers);
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        // 다시 찾아서 그놈이랑 연결된 DB 다 들고옴
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"], // 정보 아이디만 가져오는거! 데이터 효율 위해서 다 들고 올 필요 없어서!!
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
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      const where = {};
      if (parseInt(req.query.lastId, 10)) {
        // 초기 로딩이 아닐 때
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
      } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
      const posts = await user.getPosts({
        where,
        limit: 10,
        include: [
          {
            model: Image,
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ["id", "nickname"],
              },
            ],
          },
          {
            model: User,
            attributes: ["id", "nickname"],
          },
          {
            model: User,
            through: "Like",
            as: "Likers",
            attributes: ["id"],
          },
          {
            model: Post,
            as: "Retweet",
            include: [
              {
                model: User,
                attributes: ["id", "nickname"],
              },
              {
                model: Image,
              },
            ],
          },
        ],
      });
      console.log(posts);
      res.status(200).json(posts);
    } else {
      res.status(404).send("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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
      //console.log(info);
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
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우 삭제하려고 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 차단하려고 하시네요?");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  //console.log(req.headers);
  try {
    const fullUserWithoutPassword = await User.findOne({
      // 다시 찾아서 그놈이랑 연결된 DB 다 들고옴
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"], // 정보 아이디만 가져오는거! 데이터 효율 위해서 다 들고 올 필요 없어서!!
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
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    }
    res.status(404).json("존재하지 않는 사용자입니다.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
