import React, { useEffect } from "react";
import { authService, dbService } from "../fbase";
import { useHistory } from "react-router";

const Profile = ({ userObj }) => {
  const history = useHistory();

  const onLogOutClick = () => {
    authService.signOut();

    history.push("/");
  };

  const getMyNwitts = async () => {
    const nwitts = await dbService
      .collection("nwitts")
      .where("createrId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
  };

  useEffect(() => {
    getMyNwitts();
  }, []);
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
