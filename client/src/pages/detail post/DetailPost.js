import React from "react";
import "./Detailpost.css";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";

export default function PostDetail({ setModal, post }) {
  const navigate = useNavigate();

  const deletePost = async (id) => {
    try {
      const { data } = await axios.delete(`/api/v1/post/delete/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(data);
          if(data.success){
            navigate("/home")
          }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(post);
  return (
    <div className="showComment">
      <div className="container">
        <div className="postPic">
          <img src={post.photo} alt="" />
        </div>
        <div className="details">
          {/* card header */}
          <div
            className="card-header"
            style={{ borderBottom: "1px solid #00000029" }}
          >
            <div className="card-pic">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            {/* <h5></h5> */}
            <div
              className="deletePost"
              onClick={() => {
                deletePost(post._id);
              }}
            >
              <span className="material-symbols-outlined">
                <DeleteOutlineIcon />
              </span>
            </div>
          </div>

          {/* commentSection */}
          <div
            className="comment-section"
            style={{ borderBottom: "1px solid #00000029" }}
          >
            <p className="comm">
              <span className="commenter" style={{ fontWeight: "bolder" }}>
                name
              </span>
              <span className="commentText">comment off me</span>
            </p>
          </div>

          {/* card content */}
          <div className="card-content">
            <p>{post.likes.length} Likes</p>
            <p>{post.body}</p>
          </div>

          {/* add Comment */}
        </div>
      </div>
      <div
        className="close-comment"
        onClick={() => {
          setModal((prev) => !prev);
        }}
      >
        <span className="material-symbols-outlined material-symbols-outlined-comment">
          <CloseIcon />
        </span>
      </div>
    </div>
  );
}
