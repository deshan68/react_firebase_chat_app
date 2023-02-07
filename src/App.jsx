import { useState } from "react";
import "./App.css";
import ChatScreen from "./components/ChatScreen";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import MemberListItem from "./components/MemberListItem";
import { Route, Routes, NavLink, useLocation } from "react-router-dom";

function App() {
  return (
    <main className=" bg-slate-500 w-screen h-screen flex items-center justify-center font-sans">
      <div className="  bg-slate-900  flex h-5/6 w-screen m-5">
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
