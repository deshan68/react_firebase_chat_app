import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import svg from "../assets/send.svg";
import StartChating from "./StartChating";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import Cookies from "universal-cookie";
import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firbase/config";

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const cookies = new Cookies();
  const authInfo = cookies.get("auth");
  const bottomRef = useRef(null);
  const location = useLocation();
  let dateObject = new Date();

  // const getMessages = async () => {
  //   const messageRef = collection(
  //     db,
  //     "messageRoom/" + location?.state?.groupId + "/messages"
  //   );
  //   const q = query(messageRef, orderBy("fullDateTime"));

  //   try {
  //     const data = await getDocs(q);
  //     const filterDate = data.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     console.log(filterDate);
  //     setAllMsg(filterDate);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const submitMessage = async () => {
    console.log(message);
    console.log(location.state.groupId);
    const messageCollectionRef = collection(
      db,
      "messageRoom" + "/" + location.state.groupId + "/" + "messages"
    );

    try {
      await addDoc(messageCollectionRef, {
        message: message,
        sentBy: authInfo.name,
        reciever: location.state.name,
        time: dateObject.toLocaleTimeString(),
        date: dateObject.toLocaleDateString(),
        fullDateTime: serverTimestamp(),
      });
      getMessages();
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.log(err);
    }
  };
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    // getMessages();
    // 👇️ scroll to bottom every time messages change
  }, []);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [allMsg]);

  return (
    <div className="w-3/4 relative scrollbar-thumb-red-50 scrollbar-track-gray-900 scrollbar-thin scrollbar-corner-rose-900  ">
      {location.state == null ? (
        <StartChating />
      ) : (
        <>
          {location.state.isLoading == true ? (
            <div className="flex justify-center items-center w-full h-full">
              <Spinner color="white" size={20} />
            </div>
          ) : (
            <>
              <header className="pl-2 bg-slate-800 h-1-10 sticky top-0 flex items-center text-white">
                <div className="w-14 ">
                  <img
                    src={location?.state?.imgUrl}
                    className="h-10 w-10 rounded-full object-cover"
                    alt=""
                  />
                </div>
                <div className="h-8 text-sm">{location?.state?.name}</div>
              </header>
              <div className="h-8-10 pt-1 bg-slate-900 o-c overflow-auto  scrollbar-thumb-red-50 scrollbar-track-gray-900 scrollbar-thin scrollbar-corner-rose-900 ">
                {location.state.allMsg.map((item) => (
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
  );
}
