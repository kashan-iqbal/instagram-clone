import React, { useCallback, useEffect, useState } from "react";
import "../Profile/Profile.css";
import { useParams } from "react-router-dom";
import Layout from "../../component/Layout";
import axios from "axios";

export default function UserProfie() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { id } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const[changeFollow,setChangeFollow] = useState("")

 

  // to unfollow user
  const unfollowUser = useCallback( async (id) => {
    try {
      const { data } = await axios.put(`/api/v1/user/unfollow/${id}`, null, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(data,`i am un follow`);
      setChangeFollow(data)
      setIsFollow(false)
    } catch (error) {
      console.log(error);
    }
  },[])

  // to follow user
  const followUser =useCallback( async (id) => {
    try {
      const { data } = await axios.put(`/api/v1/user/follow/${id}`, null, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(data,`iam follow`);
      setChangeFollow(data)
      setIsFollow(true)
    } catch (error) {
      console.log(error);
    }
  },[])

  useEffect(() => {
    const getsingleUserProfile = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/user/singleUserProfile/${id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(data.user);
        setPosts(data.post);
        console.log(data,`iiam user`);
        if (data.user.follower.includes(localStorage.getItem("id"))) {
          setIsFollow(true);
        } 
      } catch (error) {
        console.log(error);
      }
    };
    getsingleUserProfile();
   
  },[changeFollow]);



  return (
    <Layout>
      <div className="profile">
        {/* Profile frame */}
        <div className="profile-frame">
          {/* profile-pic */}
          <div className="profile-pic">
            <img src={user.Photo ? user.Photo : picLink} alt="" />
          </div>
          {/* profile-data */}
          <div className="pofile-data">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1>{user.userName}</h1>
              <button
                className="followBtn"
                onClick={() => {isFollow?
             unfollowUser(user._id) : followUser(user._id)
                }}
              >
                {isFollow ? "Unfollow" : "Follow"}
              </button>
            </div>
            <div className="profile-info" style={{ display: "flex" }}>
              <p>{posts.length} posts</p>
              <p>{user.follower ? user.follower.length : "0"} followers</p>
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
          {posts.map((pics) => {
            return (
              <img
                key={pics._id}
                src={pics.photo}
                alt=""
                // onClick={() => {
                //     toggleDetails(pics)
                // }}
                className="item"
              ></img>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
