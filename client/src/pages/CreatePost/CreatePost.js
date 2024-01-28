import React, { useEffect, useRef, useState } from "react";
import Layout from "../../component/Layout";
import axios from "axios";
import "./CreatePost.css";
import { CircularProgress, Dialog, Snackbar } from "@mui/material";

export default function Createpost({ asOpen, closeHandle }) {
  const [body, setBody] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const imageref = useRef(null);
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
    console.log(body, file);
    if (!body && !file) {
      setLoading(false);
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: `All fields Required`,
      });
      return;
    }
    if (!body) {
      setLoading(false);
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: `caption is required`,
      });
      return;
    }
    if (!file) {
      setLoading(false);
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: `upload Image`,
      });
      return;
    }
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
      imageref.current.src = null;
      setBody("");
      closeHandle();
      setSnackBarStatus({
        open: true,
        vertical: "top",
        horizontal: "center",
        message: result.data.message,
      });
      setLoading(false);
      window.location.reload();
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
  const handleChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imageref.current) {
          imageref.current.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    setBody("");
    setFile("");
  }, [closeHandle]);
  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal, vertical }}
        open={open}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
        autoHideDuration={2000}
      />
      <Dialog open={asOpen} onClose={closeHandle}>
        <div className="createPost">
          {/* header */}
          <div className="post-header">
            <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
            {loading ? (
              <CircularProgress sx={{ height: "5px" }} />
            ) : (
              <button onClick={submitHandler} id="post-btn">
                Post
              </button>
            )}
          </div>
          {/* image preview */}
          <div className="main-div">
            <img ref={imageref} alt="" id="output" />
            {loading ? (
              ""
            ) : (
              <input
                type="file"
                onChange={(e) => handleChange(e)}
                id="post-btn"
              />
            )}
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
      </Dialog>
    </>
  );
}
