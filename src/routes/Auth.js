import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    //   만약 name이 이메일이면 setEmail에 값을 보내고
    // ㅇㅏ니면 패스워드에 보낸다.
    // set으로 값을 보내야 내가 치는 글자가 나타남
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      if (newAccount) {
        //   create Account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        //   login
        data = await authService.signInWithEmailAndPassword(email, password);
      }

      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  // 소셜 로그인

  const socialClick = async(e) => {
    // console.log(e.target.name);
    const {target: {name}} = e;
    let provider;
    if(name === "google"){
      provider = new firebaseInstance.auth.GoogleAuthProvider()
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();

    }

   const data = await authService.signInWithPopup(provider); 
  console.log(data);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          value={email}
          required
          placeholder="E-mail"
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          value={password}
          required
          placeholder="Password"
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Login"} />
        <p>{error}</p>
      </form>
      <span onClick={toggleAccount}>{newAccount ? "Log In" : "Create Account"}</span>
      <div className="">
        <button name="google" onClick={socialClick} >Continue with Google</button>
        <button name="github" onClick={socialClick} >Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
