import React from "react";
import logo from "../../assets/figma.png";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
    handleClose()
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Warning"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          By accessing and using our platform, you agree to comply with our Terms of Service. Please review the terms carefully. If you do not agree, kindly refrain from using our services.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogout} autoFocus color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <Link to="/home">
        <img src={logo} alt="" style={{ height: "60px", width: "40px" }} />
      </Link>
      <ul className="nav-menu">{uiChange()}</ul>
    </div>
  );
}
