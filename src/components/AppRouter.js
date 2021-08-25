import React from "react";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      {/* && 의 의미는 Navigation이 존재하려면 앞에것이 true여야한다. */}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj}/>
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Redirect form="*" to="/" />
            {/* /이route에 없으면 /로 돌아가라는 뜻 */}
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
            <Redirect form="*" to="/" />
          </>
        )}
      </Switch>
    </Router>

    // 이제 우리가 렌더 시킬 라우츠 는 우리의 인증(로그인)여부에 따라 달라짐
    //   Switch는 한번에 하나의 Route만 볼수 있게 함
  );
};
export default AppRouter;
