import { async } from "@firebase/util";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie/cjs/Cookies";
import face from "../assets/face.jpg";
import { auth, db } from "../firbase/config";
import ChatScreen from "./ChatScreen";
import LogIn from "./LogIn";

export default function MemberListItem() {
  const [clickedId, setClickedId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const [allMsg, setAllMsg] = useState([]);

  const navigate = useNavigate();
  const cookies = new Cookies();
  const authInfo = cookies.get("auth");
  const [memberList, setMemberList] = useState([]);
  // const [gruopList, setGruopList] = useState([]);
  const memberRefQuery = query(
    collection(db, "users"),
    where("userId", "!=", authInfo?.id)
  );

  const memberHandler = (friendId, name, imgUrl) => {
    navigate("/home", {
      state: { isLoading: true, name: name, id: friendId, imgUrl: imgUrl },
    });
    setClickedId(friendId);
    setIsActive(!isActive);
    getGroups(friendId, name, imgUrl);
  };
  const logOutHandler = async () => {
    try {
      await signOut(auth);
      cookies.remove("auth");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const getMembers = async () => {
    try {
      const data = await getDocs(memberRefQuery);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMemberList(filterData);
      getMessages();

      console.log(isLoading);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getMembers();
  }, []);

  const getGroups = async (friendId, name, imgUrl) => {
    const groupCollectionRef = collection(db, "groups");
    try {
      const data = await getDocs(groupCollectionRef);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      createGroupHandler(friendId, name, imgUrl, filterData);
    } catch (err) {
      console.log(err);
    }
  };

  const createGroupHandler = (friendId, name, imgUrl, gruopList) => {
    console.log(gruopList);
    const filterData = gruopList.filter(
      (item) =>
        (item.members[0] == friendId && item.members[1] == authInfo.id) ||
        (item.members[0] == authInfo.id && item.members[1] == friendId)
    );
    console.log(filterData.length);
    if (filterData.length == 0) {
      createGroup(friendId, name, imgUrl);
    } else {
      // navigate("/home", {
      //   state: {
      //     isLoading: false,
      //     name: name,
      //     id: friendId,
      //     imgUrl: imgUrl,
      //     groupId: filterData[0].id,
      //     allMsg: allMsg,
      //   },
      // });
      getMessages(filterData[0].id, friendId, name, imgUrl);
    }
  };

  const createGroup = async (friendId, name, imgUrl) => {
    console.log("creating Group");
    const groupCollectionRef = doc(db, "groups", friendId + authInfo?.id);
    try {
      await setDoc(groupCollectionRef, {
        id: friendId + authInfo?.id,
        members: [friendId, authInfo?.id],
      });
      // navigate("/home", {
      //   state: {
      //     isLoading: false,
      //     name: name,
      //     id: friendId,
      //     imgUrl: imgUrl,
      //     groupId: friendId + authInfo?.id,
      //   },
      // });
      getMessages(friendId + authInfo?.id, friendId, name, imgUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const getMessages = async (groupId, friendId, name, imgUrl) => {
    const messageRef = collection(db, "messageRoom/" + groupId + "/messages");
    const q = query(messageRef, orderBy("fullDateTime"));

    try {
      const data = await getDocs(q);
      const filterDate = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      console.log(filterDate);
      setAllMsg(filterDate);
      navigate("/home", {
        state: {
          isLoading: false,
          name: name,
          id: friendId,
          imgUrl: imgUrl,
          groupId: friendId + authInfo?.id,
          allMsg: filterDate,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-1/4  overflow-auto border-solid border-r border-b-sky-900 scrollbar-thumb-red-50 scrollbar-track-gray-900 scrollbar-thin scrollbar-corner-rose-900 ">
      <header className="pl-2 pr-2  bg-slate-800 h-1-10 sticky top-0 flex items-center text-white justify-between">
        <div className="w-12 ">
          <img
            src={authInfo?.imgUrl}
            className="h-10 w-10 rounded-full object-cover"
            alt=""
          />
        </div>
        <div className="text-sm">{authInfo?.name}</div>
        <button
          onClick={logOutHandler}
          className=" text-sm bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
        >
          Logout
        </button>
      </header>
      <section>
        {memberList.map((item) => (
          <div
            onClick={() => memberHandler(item.id, item.userName, item.imgUrl)}
            key={item.id}
            className={
              isActive && clickedId === item.id
                ? "  border-solid border-b-1 border-b-sky-900  h-16 text-white flex items-center cursor-pointer bg-sky-900 "
                : "  border-solid border-b-1 border-b-sky-900 bg-slate-900 h-16 text-white flex items-center cursor-pointer hover:bg-sky-800 "
            }
          >
            <div className="w-16 ">
              <img
                src={item.imgUrl}
                className="h-10 w-10 rounded-full object-cover ml-2"
                alt=""
              />
            </div>
            <div className=" text-sm">{item.userName}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
