import svg from "../assets/send.svg";
import { signOut } from "firebase/auth";
import StartChating from "./StartChating";
import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie/cjs/Cookies";
import { auth, db } from "../firbase/config";
import { useNavigate } from "react-router-dom";
import { Digital, Spinner } from "react-activity";

export default function Homes() {
  const cookies = new Cookies();
  const [memberList, setMemberList] = useState([]);
  const authInfo = cookies.get("auth");
  const navigate = useNavigate();
  const [friendDetails, setFriendDetails] = useState();
  const [clickedId, setClickedId] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [allMsg, setAllMsg] = useState([]);
  const bottomRef = useRef(null);
  const [message, setMessage] = useState("");
  const [groupID, setGroupID] = useState("");
  const [friendName, setFriendName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let dateObject = new Date();

  const memberRefQuery = query(
    collection(db, "users"),
    where("userId", "!=", authInfo?.id)
  );

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
    } catch (err) {
      console.log(err);
    }
  };

  const memberHandler = (friendId, name, imgUrl) => {
    setIsLoading(true);
    setFriendName(friendId);
    setAllMsg([]);
    const data = { id: friendId, name: name, imgUrl: imgUrl };
    setFriendDetails(data);
    console.log(friendDetails);
    setClickedId(friendId);
    setIsActive(!isActive);
    setClicked(true);
    getGroups(friendId, name, imgUrl);
  };

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
      setGroupID(filterData[0].id);
      getMessages(filterData[0].id, friendId, name, imgUrl);
    }
  };

  const getMessages = async (groupId, friendId, name, imgUrl) => {
    const messageRef = collection(db, "messageRoom/" + groupId + "/messages");
    const q = query(messageRef, orderBy("fullDateTime"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setAllMsg(msgs);
      // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsLoading(false);
    });
    // bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // try {
    //   const data = await getDocs(q);
    //   const filterDate = data.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //   console.log(filterDate);
    //   setAllMsg(filterDate);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    getMembers();
  }, [allMsg]);

  const submitMessage = async () => {
    const messageCollectionRef = collection(
      db,
      "messageRoom" + "/" + groupID + "/" + "messages"
    );

    try {
      await addDoc(messageCollectionRef, {
        message: message,
        sentBy: authInfo.name,
        reciever: friendName,
        time: dateObject.toLocaleTimeString(),
        date: dateObject.toLocaleDateString(),
        fullDateTime: serverTimestamp(),
      });
      getMessages(groupID);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
          <>
            {memberList.length != 0 ? (
              <>
                {memberList.map((item) => (
                  <div
                    onClick={() =>
                      memberHandler(item.id, item.userName, item.imgUrl)
                    }
                    key={item.id}
                    className="border-solid border-b-1 border-b-sky-900  h-16 text-white flex items-center cursor-pointer "
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
              </>
            ) : (
              <div className="flex justify-center items-center w-full h-full mt-3">
                <Digital color="white" size={20} />
              </div>
            )}
          </>
        </section>
      </div>

      <div className="w-3/4 relative scrollbar-thumb-red-50 scrollbar-track-gray-900 scrollbar-thin scrollbar-corner-rose-900  ">
        {clicked == false ? (
          <StartChating />
        ) : (
          <>
            {isLoading == true ? (
              <div className="flex justify-center items-center w-full h-full">
                <Spinner color="white" size={20} />
              </div>
            ) : (
              <>
                <header className="pl-2 bg-slate-800 h-1-10 sticky top-0 flex items-center text-white">
                  <div className="w-14 ">
                    <img
                      src={friendDetails.imgUrl}
                      className="h-10 w-10 rounded-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="h-8 text-sm">{friendDetails.name}</div>
                </header>
                <div className="h-8-10 pt-1 bg-slate-900 o-c overflow-auto  scrollbar-thumb-red-50 scrollbar-track-gray-900 scrollbar-thin scrollbar-corner-rose-900 ">
                  {allMsg.map((item) => (
                    <div key={item.id}>
                      {item.sentBy === authInfo.name ? (
                        <div className="flex  items-center justify-end">
                          <div className="flex flex-col items-end h-fit mb-1 mr-3 max-w-sm w-fit p-2 bg-gray-200 rounded-md font-semibold">
                            <span>{item.message}</span>
                            <span className="text-xs text-gray-600">
                              {item.date} {item.time}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex  items-center justify-start">
                          <div className="flex flex-col items-start h-fit mb-1 ml-3 w-fit max-w-sm p-2 bg-gray-200 rounded-md font-semibold">
                            <span>{item.message}</span>
                            <span className="text-xs text-gray-600">
                              {item.date} {item.time}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div className="text-white h-1-10  bg-slate-800 flex justify-center items-center">
                  <div className="w-11/12 ">
                    <input
                      className="text-black placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-1 pr-1 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                      placeholder="Type Here..."
                      type="text"
                      name="search"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div
                    onClick={submitMessage}
                    className="h-10 w-10 cursor-pointer ml-3  hover:bg-black "
                  >
                    <img src={svg} alt="" />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
