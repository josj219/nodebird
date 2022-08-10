const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");

const hashtagRouter = require("./routes/hashtag");
const postsRouter = require("./routes/posts");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결성공");
  })
  .catch(console.error);
passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // 배포일 떄 로그 다양하게 들고올 수 있음 - 누가 로그인 관련 등
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}

app.use(morgan("dev"));
//front에서 back 요청 보낼 때 어떤 요청 보냈는지 기록!! 디버깅 용

app.use(
  cors({ origin: ["http://localhost:3000", "nodebird.com"], credentials: true })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
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

// app.get("/api/posts", (req, res) => {
//   res.json([
//     { id: 1, content: "hello" },
//     { id: 2, content: "hello2" },
//     { id: 3, content: "hello3" },
//   ]);
// });

app.get("/", (req, res) => {
  res.send("hello express");
});

app.use("/posts", postsRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

//에러 처리 미들웨어 만드는거
// app.use((err,req,res,next)=>{

// })

app.listen(80, () => {
  console.log("서버 실행 중");
});
