import produce from "../util/produce";

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

// export const generateDummyPost = (number) =>
//   Array(number)
//     .fill()
//     .map(() => ({
//       id: shortId.generate(),
//       User: {
//         id: shortId.generate(),
//         nickname: faker.name.findName(),
//       },
//       content: faker.lorem.paragraph(),
//       Images: [
//         {
//           src: "https://picsum.photos/seed/picsum/200/100",
//         },
//       ],
//       Comments: [
//         {
//           User: {
//             id: shortId.generate(),
//             nickname: faker.name.findName(),
//           },
//           content: faker.lorem.sentence(),
//         },
//       ],
//     }));

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

// const dummyPost = (data) => ({
//   id: data.id,
//   content: data.content,
//   User: {
//     id: 1,
//     nickname: "제로초",
//   },
//   Images: [],
//   Comments: [],
// });

// const dummyComment = (data) => ({
//   id: shortId.generate(),
//   content: data,
//   User: {
//     id: 1,
//     nickname: "제로초",
//   },
// });

//reducer는 이전 상태를 액션을 통해 다음 상태로 만들어 내는 함수(불변성 지키면서)
const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    //draft
    //state 가 draft 로 이름 바뀐다 생각하면 됨 - 막 바뀌어도 불변성 지켜서 다음 상태로 바꿈

    switch (action.type) {
      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS:
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers.push({ id: action.data.UserId });
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;
      case UNLIKE_POST_REQUEST: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers = post.Likers.filter((v) => v.id === action.data.UserId);
        draft.unLikeLoading = true;
        draft.unLikeDone = false;
        break;
      }
      case UNLIKE_POST_SUCCESS:
        draft.unLikeLoading = false;
        draft.unLikeDone = true;
        break;
      case UNLIKE_POST_FAILURE:
        draft.unLikeLoading = false;
        draft.unLikeError = action.error;
        break;
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        // draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.hasMorePosts = draft.mainPosts.length < 11; // bool 이다
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data);
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostDone = true;
        draft.removePostLoading = false;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentError = null;
        draft.addCommentDone = false;
        draft.addCommentLoading = true;
        break;
      case ADD_COMMENT_SUCCESS: {
        // action.data.content, userid, postid
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Comments.unshift(action.data);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
        //불변성 지킬라고 아래 코드 처럼 길게 썼는데 immer 쓰면 이렇게 간단!!!! unshift 활용

        // 불변성 핵심 : 바뀌는거만 새로운 객체로 만들고, 나머지 객체는 참조 유지 해야한다 - 메모리 절약 가능하고자
        /*
        const postIndex = state.mainPosts.findIndex(
          (v) => v.id === action.data.postId
        );
        console.log("@@@@@@@@@@@@@ postindex");
        console.log(postIndex);
        console.log(action.data);
        console.log(action.data.content);
        const post = { ...state.mainPosts[postIndex] };
        post.Comments = [dummyComment(action.data.content), ...post.Comments];
        const mainPosts = [...state.mainPosts];
        mainPosts[postIndex] = post;
        return {
          ...state,
          mainPosts,
          addCommentLoading: false,
          addCommentDone: true,
        };
        */
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        return state;
    }
  });
};

export default reducer;
