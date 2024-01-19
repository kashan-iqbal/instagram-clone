import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";
import Layout from "../../component/Layout";
import axios from "axios";
import PostDetail from "../detail post/DetailPost";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

export default function Profie() {
  const [user, setUser] = useState("");
  const [userPost, setUserPost] = useState("");
  const [modal, setModal] = useState(false);
  const [detailPost, setDetailPost] = useState("");
  const [image, setImage] = useState("");
  const imageRef = useRef();

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  // const pic = [];
  const show = false;
  // const posts = [];
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
        const { data } = await axios.get("api/v1/post/myposts", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserPost(data.data);
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
    setModal((prev) => !prev);
  };

  const updateProfilePic = async () => {
    try {
      const data = new FormData();
      data.append("file", image);

      const result = await axios.put(`/api/v1/user/upload-image`, data, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProfileImage = async () => {
    try {
      const data = new FormData();
      data.append("file", image);

      const result = await axios.put(`/api/v1/user/delete-image`, null, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setImage(e.target.files[0]);

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imageRef.current) {
          imageRef.current.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      {modal && <PostDetail setModal={setModal} post={detailPost} />}
      <div className="profile">
        {/* Profile frame */}
        <div className="profile-frame">
          {/* profile-pic */}
          <div className="box">
            <div className="profile-pic">
              <img src={user.photo ? user.photo : picLink} alt="" />
              <img ref={imageRef} src={picLink} />
            </div>
            <input
              type="file"
              placeholder="profile image"
              onChange={(e) => handleChange(e)}
            />
            {image === "" ? (
              ""
            ) : (
              <button onClick={updateProfilePic}>update</button>
            )}
          </div>
          {/* profile-data */}
          <div className="pofile-data">
            <h1>{user.userName}</h1>
            <div className="profile-info" style={{ display: "flex" }}>
              <p>{userPost ? userPost.length : "0"} posts</p>
              <p>{user.followers ? user.followers.length : "0"} followers</p>
              <p>{user.following ? user.following.length : "0"} following</p>
            </div>
            {user.photo ? (
              <button onClick={deleteProfileImage}>delete profile Pic</button>
            ) : (
              ""
            )}
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
          <ImageList
            sx={{ width: 600, height: 450 }}
            cols={3}
            rowHeight={164}
            className="scrolbar"
          >
            {userPost &&
              userPost.map((pics) => (
                <ImageListItem key={userPost._id}>
                  <img
                    key={pics._id}
                    srcSet={`${pics.photo.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${pics.photo.image}?w=164&h=164&fit=crop&auto=format`}
                    alt="net porblem"
                    loading="lazy"
                    onClick={() => detailpost(pics)}
                  />
                </ImageListItem>
              ))}
          </ImageList>
        </div>
        {show && <div>{/* Render post details UI */}</div>}
        {changePic && <div>{/* Render profile picture change UI */}</div>}
      </div>
    </Layout>
  );
}
