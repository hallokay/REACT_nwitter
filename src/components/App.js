import "./App.css";
import AppRouter from "./AppRouter";
import React, { useState, useEffect } from "react";
import { authService } from "../fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 인증상태는 초기에 false--> 로그인 하지 않은 상태여야함
  const [userObj, setUserObj] = useState(null)

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
        // 유저가 생기면 유저를 오브젝트에 보내줌
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <div className="App">
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "initializing..."}
      
    </div>
  );
}

export default App;
