import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import svg from "../assets/send.svg";
import StartChating from "./StartChating";

export default function ChatScreen() {
  const [allMsg, setAllMsg] = useState([]);
  const auth = "Arun";
  const bottomRef = useRef(null);
  const location = useLocation();
  const msgs = [
    {
      id: 1,
      sentBy: "Arun",
      message: "hellow, how are you... 1!",
      time: "05:00",
      date: "2023:03:03",
    },
    {
      id: 2,
      sentBy: "Amal",
      message: " 2 hellow, i am Fine, what about you",
      time: "05:30",
      date: "2023:02:02",
    },
  ];
  const addMsg = () => {
    let newMsg = [
      {
        id: 18,
        sentBy: "Arun",
        message: "brooooooooooooo",
      },
      {
        id: 19,
        sentBy: "Arun",
        message: "brooooooooooooo",
      },
      {
        id: 20,
        sentBy: "Arun",
        message: "brooooooooooooo",
      },
    ];
    const newAllmsg = [...msgs, ...newMsg];
    setAllMsg(newAllmsg);
    console.log(allMsg);
  };

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMsg]);
  console.log(location.state.isLoading);
  return (
    <div className="w-3/4 relative scrollbar-thumb-red-50 scrollbar-track-gray-900 scrollbar-thin scrollbar-corner-rose-900  ">
      {location.state == null ? (
        <StartChating />
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
            {msgs.map((item) => (
              <div key={item.id}>
                {item.sentBy === auth ? (
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
              />
            </div>
            <div onClick={addMsg} className="h-10 w-10 cursor-pointer ml-3   ">
              <img src={svg} alt="" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
