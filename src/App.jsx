import { useState } from "react";
import "./App.css";
import ChatScreen from "./components/ChatScreen";
import MemberListItem from "./components/MemberListItem";

function App() {
  return (
    <main className=" bg-slate-500 w-screen h-screen flex items-center justify-center font-sans">
      <div className="  bg-slate-900  flex h-5/6 w-screen m-5">
        <MemberListItem />
        <ChatScreen />
      </div>
    </main>
  );
}

export default App;
