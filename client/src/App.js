import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SingUp from "./pages/Authentication/Singup";
import Login from "./pages/Authentication/Login";
import Profie from "./pages/Profile/Profile";
import Createpost from "./pages/CreatePost/CreatePost";
import Home from "./pages/Home/Home";
import UserProfie from "./pages/userprofile/UserProfile";
import Following from "./pages/myfollowing/Following";
import ForgetPassword from "./pages/Authentication/ForgetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SingUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createPost" element={<Createpost />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profie />} />
        <Route path="/userprofile/:id" element={<UserProfie />} />
        <Route path="/myfollowing" element={<Following />} />
        <Route path="/forget-Password" element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
