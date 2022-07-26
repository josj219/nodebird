const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const app = express();
const passportConfig = require("./passport");
const dotenv = require("dotenv");

dotenv.config();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결성공");
  })
  .catch(console.error);
passportConfig();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // front 에서 json 형식으로 data 보낼 때
app.use(express.urlencoded({ extended: true })); // form submit 했을 때
// ㄴfront 에서 보낸 데이터 req에 넣어줌
// ㄴ둘다 미들웨어라서 실행될 놈들 (다른 라우터들) 보다 위에 와야한다

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

//에러 처리 미들웨어 만드는거
// app.use((err,req,res,next)=>{

// })

app.listen(3065, () => {
  console.log("서버 실행 중");
});
