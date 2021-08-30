import React, { useState } from "react";
import { dbService, storageService } from "../fbase";

const Nwitt = ({ nwittObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNwitt, setNewNwitt] = useState(nwittObj.text);

  const onDelClick = async () => {
    const delOk = window.confirm("정말 삭제하시겠습니까?");

    if (delOk) {
      await dbService.doc(`nwitts/${nwittObj.id}`).delete();
      await storageService.refFromURL(nwittObj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  //   에디팅상태인지 아닌지 가지고 잇는 상태를 부정한다.

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNwitt(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dbService.doc(`nwitts/${nwittObj.id}`).update({
      text: newNwitt,
    });
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nwitt"
              value={newNwitt}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Nwitt" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nwittObj.text}</h4>
          {nwittObj.attachmentUrl && <img src={nwittObj.attachmentUrl} />}
          {isOwner && (
            <>
              <button onClick={onDelClick}>delete Nwitt</button>
              <button onClick={toggleEditing}>edit Nwitt</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nwitt;
