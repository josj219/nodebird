import { fork, all } from "redux-saga/effects";

import postSaga from "./post";
import userSaga from "./user";

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
//all 동시 실행하게 해준다 - all로 한방에 등록함

//fork 는 실행
//call 도 실행인데, 조금 다름 -

/*
generator 는 중단점 만들어 주는거
let i = 0;
cons gen = function*() {
    while(true){
        yield i++;
    }
}
g.next() 실행

=> 이벤트 리스너랑 비슷!!!!!
=> 무한 이벤트 리스너로 활용 가능 @@@@@@@@@
*/
