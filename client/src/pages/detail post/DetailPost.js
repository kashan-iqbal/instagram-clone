import React from "react";
import "./Detailpost.css";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { Modal } from "@mui/material";

export default function PostDetail({ modal,setModal, post }) {
  const navigate = useNavigate();

  const deletePost = async (id) => {
    try {
      const { data } = await axios.delete(`/api/v1/post/delete/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(data);
      if (data.success) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  console.log(post);
  return (
    // <div className="showComment">
    //   <div className="container">
    //     <div className="postPic">
    //       <img src={post.photo.image} alt="" />
    //     </div>
    //     <div className="details">
    //       {/* card header */}
    //       <div
    //         className="card-header"
    //         style={{ borderBottom: "1px solid #00000029" }}
    //       >
    //         <div className="card-pic">
    //           <img
    //             src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    //             alt=""
    //           />
    //         </div>
    //         {/* <h5></h5> */}
    //         <div
    //           className="deletePost"
    //           onClick={() => {
    //             deletePost(post._id);
    //           }}
    //         >
    //           <span className="material-symbols-outlined">
    //             <DeleteOutlineIcon />
    //           </span>
    //         </div>
    //       </div>

    //       {/* commentSection */}
    //       <div
    //         className="comment-section"
    //         style={{ borderBottom: "1px solid #00000029" }}
    //       >
    //         <p className="comm">
    //           <span className="commenter" style={{ fontWeight: "bolder" }}>
    //             name
    //           </span>
    //           <span className="commentText">comment off me</span>
    //         </p>
    //       </div>

    //       {/* card content */}
    //       <div className="card-content">
    //         <p>{post.likes.length} otp Likes</p>
    //         <p>{post.body}</p>
    //       </div>

    //       {/* add Comment */}
    //     </div>
    //   </div>
    //   <div
    //     className="close-comment"
    //     onClick={() => {
    //       setModal((prev) => !prev);
    //     }}
    //   >
    //     <span className="material-symbols-outlined material-symbols-outlined-comment">
    //       iiiiiiiiii
    //       <CloseIcon />
    //     </span>
    //   </div>
    // </div>
    <Modal open={modal}>
      <div className="container">
        <div className="header">
          <h4>Posts Detail</h4>
          <p onClick={() => setModal((prev) => !prev)}>
            <CloseIcon />
          </p>
        </div>
        <hr
          style={{
            width: "100%",
            opacity: "0.8",
            margin: "0px",
          }}
        />
        <div className="profile_header">
          <div style={{ display: "flex" }}>
            <div className="image">
              <img src={picLink} alt="other" />
            </div>
            <div>
              <p>{post && post.postedBy?.userName}</p>
            </div>
          </div>
          <div>
            <button onClick={() => deletePost(post._id)}>
            <DeleteOutlineIcon />
            </button>
          </div>
        </div>
        <div className="post_body">
          <p className="padding">{post.body}</p>
        </div>
        <div className="post_img">
          <img src={post.photo ? post.photo.image : picLink} alt="other" />
        </div>
        <hr
          style={{
            width: "100%",
            opacity: "0.8",
            margin: "5px 0px",
          }}
        />
        <div className="like_section">
          <p>Likes {post.likes?.length} </p>
          <p>commit {post?.comments?.length}</p>
        </div>
        <hr
          style={{
            width: "100%",
            opacity: "0.8",
            margin: "10px 0px",
          }}
        />

        <div className="commit_continer">
          {post &&
            post.comments?.map((comt) => (
              <div className="single_commit" key={comt._id}>
                <p>{comt.postedBy.userName}</p>
                <p>{comt.comment}</p>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}
