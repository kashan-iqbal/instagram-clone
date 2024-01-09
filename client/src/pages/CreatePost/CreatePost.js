import React, { useState } from "react";
import Layout from "../../component/Layout";
import axios from "axios";
import "./CreatePost.css";
import { CircularProgress, Snackbar } from "@mui/material";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBarStatus, setSnackBarStatus] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  // For Show Image
  const loadfile = (event) => {
    if (event.target.files.length > 0) {
      var output = document.getElementById("output");
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
      };
    }
  };

  // snack bar notification
  const { open, vertical, horizontal, message } = snackBarStatus;

  const handleClose = () => {
    setSnackBarStatus({ ...snackBarStatus, open: false });
  };

  const submitHandler = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const result = await axios.post(
        "/api/v1/post/createPost",
        { body, file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result.data);
      setFile(null);
      setBody("");
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: result.data.message,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: `some thing went wrong`,
      });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Snackbar
        anchorOrigin={{ horizontal, vertical }}
        open={open}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
        autoHideDuration={2000}
      />
      <div className="createPost">
        {/* header */}
        <div className="post-header">
          <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
          {loading ? (
            <CircularProgress />
          ) : (
            <button onClick={submitHandler} id="post-btn">
              Share
            </button>
          )}
        </div>
        {/* image preview */}
        <div className="main-div">
          <img
            id="output"
            src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
            alt=""
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              loadfile(e);
              setFile(e.target.files[0]);
            }}
          />
        </div>
        {/* details */}
        <div className="details">
          <div className="card-header">
            {/* <div className="card-pic">
              <img
                style={{ height: "30px", width: "30px", borderRadius: "50%" }}
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <h5>Ramesh</h5> */}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a caption...."
          ></textarea>
        </div>
      </div>
    </Layout>
  );
}
