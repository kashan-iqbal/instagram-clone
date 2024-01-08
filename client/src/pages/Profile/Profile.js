import React, { useEffect, useState } from "react";
import "./Profile.css";
import Layout from "../../component/Layout";
import axios from "axios";
import PostDetail from "../detail post/DetailPost";

export default function Profie() {
  const [user, setUser] = useState("");
  const [userPost, setUserPost] = useState("");
  const [modal ,setModal ]= useState(false)
  const [detailPost, setDetailPost] = useState("")

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const pic = [];
  const show = false;
  const posts = [];
  const changePic = false;

  useEffect(() => {
    const gettingProfileData = async () => {
      try {
        const { data } = await axios.get("api/v1/user/userprofile", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(data);
      } catch (error) {}
    };

    const gettingUserPost = async () => {
      try {
        const {data} = await axios.get("api/v1/post/myposts", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserPost(data.data)
      } catch (error) {
        console.log(error);
      }
    };

    gettingProfileData();
    gettingUserPost();
  }, []);

  // console.log(userPost,`iam `);
  
  const detailpost = (posts) => {
    setDetailPost(posts);
    setModal((prev)=>!prev)
  };

  const changeprofile = () => {
    // Toggle profile change logic
  };



  return (
    <Layout>
      {modal &&
        <PostDetail setModal={setModal} post={detailPost}  />

      }
      <div className="profile">
        {/* Profile frame */}
        <div className="profile-frame">
          {/* profile-pic */}
          <div className="profile-pic">
            <img
              onClick={changeprofile}
              src={user.Photo ? user.Photo : picLink}
              alt=""
            />
          </div>
          {/* profile-data */}
          <div className="pofile-data">
            <h1>{user.userName}</h1>
            <div className="profile-info" style={{ display: "flex" }}>
              <p>{userPost ? userPost.length : "0"} posts</p>
              <p>{user.followers ? user.followers.length : "0"} followers</p>
              <p>{user.following ? user.following.length : "0"} following</p>
            </div>
          </div>
        </div>
        <hr
          style={{
            width: "90%",
            opacity: "0.8",
            margin: "25px auto",
          }}
        />
        {/* Gallery */}
        <div className="gallery">
          {userPost && userPost.map((pics) => (
            <img
              key={pics._id}
              src={pics.photo}
              onClick={()=>detailpost(pics)}
              className="item"
              alt=""
            />
          ))}
        </div>
        {show && <div>{/* Render post details UI */}</div>}
        {changePic && <div>{/* Render profile picture change UI */}</div>}
      </div>
    </Layout>
  );
}