const express = require("express");

const router = express.Router();
const { Post, Comment, Image, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

router.post("/", async (req, res, next) => {
  try {
    console.log("POST REQUEST API RECEIVED");
    console.log(req.body.content);
    console.log(req.user.id);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
        { model: User, attributes: ["id", "nickname"] }, // 게시글 작성자
        { model: User, as: "Likers", attributes: ["id"] }, // 좋아요 누른 사람
      ],
    });
    res.status(201).json(fullPost); // result.data로 들어감
  } catch (error) {
    console.error(error);
    next(error);
    //res.json({ id: 1, content: "hello" });
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    //게시글 없는 데, 댓글 단다면..?
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    console.log("PARAMSS@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(req.params.postId);
    console.log(post);
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment); // result.data로 들어감
  } catch (error) {
    console.error(error);
    next(error);
    //res.json({ id: 1, content: "hello" });
  }
});

router.patch("/:postId/like", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch("/:postId/like", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.delete("/", (req, res) => {
  res.json({ id: 1, content: "hello" });
});

module.exports = router;
