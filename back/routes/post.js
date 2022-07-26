const express = require("express");

const router = express.Router();
const { Post, Comment } = require("../models");
const { isLoggedIn } = require("./middlewares");

router.post("/", async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    res.status(201).json(post); // result.data로 들어감
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
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    res.status(201).json(comment); // result.data로 들어감
  } catch (error) {
    console.error(error);
    next(error);
    //res.json({ id: 1, content: "hello" });
  }
});

router.delete("/", (req, res) => {
  res.json({ id: 1, content: "hello" });
});

module.exports = router;
