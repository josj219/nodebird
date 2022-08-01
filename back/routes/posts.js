const express = require("express");

const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      //where : {UserId:1}, //특정 아이디의 게시물만 들고와라는 조건
      limit: 10, // 10개만 가져와라는 조건 ... 페북같은거 생각해봐라
      //offset: 100, // 101~110 번 가져와라
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ], // 최신게시물이 위라 DESC 로 바꿔줌 페북같은거는
      // ㄴ 실무에서는 limit offset 이거 잘 안쓴다 중간에 사람이 게시물 지우거나 추가하면 반영 ㄴㄴ
      //       ㄴ 대신 lastId 많이 씀 !!!
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
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
        { model: User, as: "Likers", attributes: ["id"] },
      ],
    });
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
