import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from "./user";
import post from "./post";

// //action creator
// const changeNickname = (data) => {
//   return {
//     type: "CHANGE_NICKNAME",
//     data,
//   };
// };

/*
const changeNickname = {
    type : 'CHANGE_NICKNAME',
    data : 'boogicho'
}

const changeNickname = {
    type : 'CHANGE_NICKNAME',
    data : 'neuezeal'
}
*/

// 리듀서 : (이전 상태, 액션) => 다음 상태  ... 축소 - 리듀스
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log("HYDRATE", action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
