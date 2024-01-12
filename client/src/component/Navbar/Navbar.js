import React from "react";
import logo from "../../assets/figma.png";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  
  const Navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    Navigate("/login");
  };

  const uiChange = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return [
        <>
          <Link to="/profile">
            <li key={3}>Profile</li>
          </Link>
          <Link to="/createPost">Create Post</Link>
          <Link style={{ marginLeft: "20px" }} to="/myfollowing">
            My Following
          </Link>
          <Link to={""}>
            <button className="primaryBtn" onClick={handleOpen}>
              Log Out
            </button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/">
            <li key={1}>SignUp</li>
          </Link>
          <Link to="/login">
            <li key={2}>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <div className="navbar">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: "1rem" }}
          >
            Are You Want To Sure Logout
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button color="error" variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
      <Link to="/home">
        <img src={logo} alt="" style={{ height: "60px", width: "40px" }} />
      </Link>
      <ul className="nav-menu">{uiChange()}</ul>
    </div>
  );
}
