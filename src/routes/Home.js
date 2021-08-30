import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Nwitt from "../components/Nwitt";
import { dbService, storageService } from "../fbase";

const Home = ({ userObj }) => {
  const [nwitt, setNwitt] = useState("");
  const [nwittArr, setNwittArr] = useState([]);
  const [attachment, setAttachment] = useState("");

  // const getNwitts = async () => {
  //   // 디비 nwitts 컬렉션에 있는 것을 가져옴
  //   const dbnwitts = await dbService.collection("nwitts").get();

  //   dbnwitts.forEach((doc) => {
  //     const nwittObj = {
  //       id: doc.id,
  //       ...doc.data(),
  //     };
  //     setNwittArr((prev) => [nwittObj, ...prev]);
  //     // 배열을 리턴할 건데 모든 이전 nwitts(prev) 에 대해
  //     // 배열을 리턴할 건데 그 배열은 새로 작성된 트윗과 그 이전 것들이다/
  //     // set이 붙은 것에 함수를 전달할 수 있는데함수를 전달하면 리액트는 이전 값에 접근할 수 있게 해준다.
  //   });

  // console.log(nwittArr);
  // };

  useEffect(() => {
    // getNwitts();
    // 실시간으로 나타내기
    dbService.collection("nwitts").onSnapshot((snapshot) => {
      const nwittSnapshotArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNwittArr(nwittSnapshotArr);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    let attachmentUrl = "";
    // const는 블록 안에서만 먹히기 떄문에 빼줘서 사용

    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // 이것은 collection이랑 아주 비슷해
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const nwittObj = {
      text: nwitt,
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("nwitts").add(nwittObj);
    setNwitt("");
    setAttachment("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNwitt(value);
  };

  // 파일 업로드
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];

    // fileReader API
    const fileReader = new FileReader();
    fileReader.readAsDataURL(theFile);
    // 여기서 파일을 읽기 시작하고 이게 끝나면 아래 loadend이벤트 시작
    fileReader.onloadend = (e) => {
      console.log(e);
      const {
        currentTarget: { result },
      } = e;
      setAttachment(result);
    };
  };

  const onClearImgClick = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        {/* 문자 인풋 */}
        <input
          type="text"
          onChange={onChange}
          value={nwitt}
          placeholder="무슨 생각해?"
          maxLength={120}
        />

        {/* 사진 업로드 */}
        <input type="file" accept="image/*" onChange={onFileChange} />

        <input type="submit" value="Nwitt" />
        {attachment && (
          <div>
            <img src={attachment} alt="userImg" />
            <button onClick={onClearImgClick}>Clear</button>
          </div>
        )}
      </form>

      <div className="">
        {/* 글자가 표시됨 */}
        {nwittArr.map((n) => (
          <Nwitt
            key={n.id}
            nwittObj={n}
            isOwner={n.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
