import React, { useCallback, useEffect } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import useInput from "../hooks/useInput";
import { loginRequestAction } from "../reducers/user";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

//usecallback 은 함수를 캐싱
//usememo 는 값을 캐싱 - 이거 하면 리랜더링 최적화 된다 = 리랜더링 되도 같은 객체 유지
//객체 {} = {} 이거 false => 객체는 계속 새로 만들어버림
//인라인 스타일링 보다 style 빼서 하는게 좋다. - 스타일 인라인으로 하면 리랜더링  계쇡 됨

const LoginForm = () => {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);

  //  const [nickname, onChangeNickname] = useInput("");

  //   const [id, setId] = useState("");
  //   const [password, setPassword] = useState("");

  //   const onChangeId = useCallback((e) => {
  //     setId(e.target.value);
  //   }, []);

  //   const onChangePassword = useCallback((e) => {
  //     setPassword(e.target.value);
  //   }, []);
  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmitForm = useCallback(() => {
    //component에 넣는거는 이렇게 해줘야
    console.log(email, password);
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input
          name="user-email"
          value={email}
          onChange={onChangeEmail}
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">패스워드</label>
        <br />
        <Input
          name="user-password"
          value={password}
          type="password"
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>회원가입</a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

// LoginForm.propTypes = {
//   setIsLoggedIn: PropTypes.func.required,
// };

export default LoginForm;
