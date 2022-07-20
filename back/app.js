const express = require("express");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const app = express();

db.sequelize.sync().then(() => {
  console.log("db 연결성공");
});

app.use(express.json()); // front 에서 보낸 데이터 req에 넣어줌
app.use(express.urlencoded({ extended: true })); // 둘다 미들웨어라서 실행될 놈들 (다른 라우터들) 보다 위에 와야한다

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/api", (req, res) => {
  res.send("hello api");
});

app.get("/api/posts", (req, res) => {
  res.json([
    { id: 1, content: "hello" },
    { id: 2, content: "hello2" },
    { id: 3, content: "hello3" },
  ]);
});

app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});
