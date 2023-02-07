import { signInWithPopup } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import Cookies from "universal-cookie";
import { auth, db, googleProvider } from "../firbase/config";

export default function LogIn() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const logInHandler = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      cookies.set("auth", {
        name: auth?.currentUser?.displayName,
        id: auth?.currentUser?.uid,
        imgUrl: auth?.currentUser?.photoURL,
      });
      creatUserCollection(auth?.currentUser?.uid);
      navigate("/home");
    } catch (err) {}
  };

  const creatUserCollection = async (uid) => {
    // const userCollection = collection(db, "user");
    const userCollection = doc(db, "users", uid);
    try {
      await setDoc(userCollection, {
        userName: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        imgUrl: auth.currentUser.photoURL,
      });
      console.log("Added");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center items-center w-full">
      <Link>
        <button
          onClick={logInHandler}
          className="bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Login Using Google
        </button>
      </Link>
    </div>
  );
}
