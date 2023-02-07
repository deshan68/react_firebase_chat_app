import React from "react";
import face from "../assets/face.jpg";

export default function MemberListItem() {
  return (
    <div className="w-1/4 overflow-auto  scrollbar-thumb-red-50 scrollbar-track-gray-900 scrollbar-thin scrollbar-corner-rose-900 ">
      <header className="pl-2 bg-zinc-800 h-1-10 sticky top-0 flex items-center text-white">
        <div className="w-14 ">
          <img
            src={
              "https://images.unsplash.com/photo-1675441420404-855140358e38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
            }
            className="h-10 w-10 rounded-full object-cover"
            alt=""
          />
        </div>
        <div className="h-8 text-sm">Arun Deshan</div>
      </header>
      <section>
        <div className=" pl-1 border-solid border-b-1 border-sky-500 bg-slate-900 h-20 text-white flex items-center cursor-pointer ">
          <div className="w-16 ">
            <img
              src={face}
              className="h-14 w-14 rounded-full object-cover"
              alt=""
            />
          </div>
          <div className="h-12 text-lg">Arun Deshan</div>
        </div>
        <div className="pl-1 border-solid border-b-1 border-sky-500 bg-slate-900 h-20 text-white flex items-center cursor-pointer">
          <div className="w-16 ">
            <img
              src={
                "https://images.unsplash.com/photo-1675332911384-b55fc27f54ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
              }
              className="h-14 w-14 rounded-full object-cover"
              alt=""
            />
          </div>
          <div className="h-12 text-lg">Arun Deshan</div>
        </div>{" "}
      </section>
    </div>
  );
}
