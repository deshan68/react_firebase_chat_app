import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie/cjs/Cookies";
import face from "../assets/face.jpg";
import { auth } from "../firbase/config";
import ChatScreen from "./ChatScreen";
import LogIn from "./LogIn";

export default function MemberListItem() {
  const [clickedId, setClickedId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const authInfo = cookies.get("auth");
  const members = [
    {
      id: 1,
      name: "Amal Perara",
      imgUrl:
        "https://images.unsplash.com/photo-1675441420404-855140358e38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Dilan Lakmal",
      imgUrl:
        "https://images.unsplash.com/photo-1675685828034-be58f6f986c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    },
  ];
  const memberHandler = (id, name, imgUrl) => {
    setClickedId(id);
    setIsActive(!isActive);
    navigate("/home", { state: { name: name, id: id, imgUrl: imgUrl } });
  };
  const logOutHandler = async () => {
    try {
      await signOut(auth);
      cookies.remove("auth");
      navigate("/", (Option = { replace: true }));
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
        {members.map((item) => (
          <div
            onClick={() => memberHandler(item.id, item.name, item.imgUrl)}
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
            <div className=" text-sm">{item.name}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
