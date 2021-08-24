import React,{useEffect, useState} from "react";
import { dbService } from "../fbase";

const Home = () => {
    const [nwitt, setNwitt] = useState('');
    const [nwittArr, setNwittArr] = useState([]);

const getNwitts = async () => {
    // 디비 nwitts 컬렉션에 있는 것을 가져옴
    const dbnwitts = await dbService.collection("nwitts").get();

    dbnwitts.forEach((doc) => {

        const nwittObj = {
          ...doc.data(),
          id: doc.id,
        };
        setNwittArr((prev) => [nwittObj, ...prev]);
// 배열을 리턴할 건데 모든 이전 nwitts(prev) 에 대해
// 배열을 리턴할 건데 그 배열은 새로 작성된 트윗과 그 이전 것들이다/
// set이 붙은 것에 함수를 전달할 수 있는데함수를 전달하면 리액트는 이전 값에 접근할 수 있게 해준다.

    });

console.log(nwittArr);
}

    useEffect(()=> {
        getNwitts();
    }, [])

  const onSubmit = async(e) => {
    e.preventDefault();
   await dbService.collection('nwitts').add({
        nwitt,
        createdAt: Date.now(),
    })
    setNwitt('');
  };

  const onChange = (e) => {

    const {target : {value}} = e;
    setNwitt(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={nwitt}
          placeholder="무슨 생각해?"
          maxLength={120}
        />
        <input type="submit" value="Nwitt" />
      </form>
      <div className="">
        {nwittArr.map((n) => (
          <div key={n.id}>
            <h4>{n.nwitt}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
