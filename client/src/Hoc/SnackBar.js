import { Slide, Snackbar } from '@mui/material'
import React, { useState } from 'react'

const SnackBar = (props) => {
    const {children,onOpen,handleClose} = props
    const [snackBarStatus, setSnackBarStatus] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        message: "",
      });

      const { open, vertical, horizontal, message } = snackBarStatus;

      const TransitionBottom = (props) => {
        return <Slide {...props} direction="up" />;
      };
      const handleClick = (newState) => {
        setSnackBarStatus({ ...newState, open: true });
      };
    //   const handleClose = () => {
    //     setSnackBarStatus({ ...snackBarStatus, open: false });
    //   };
  return (
    <>
       <Snackbar
        anchorOrigin={{ horizontal, vertical }}
        open={onOpen}
        onClose={handleClose}
        message={children}
        key={vertical + horizontal}
        autoHideDuration={2000}
        TransitionComponent={TransitionBottom}
      />
    </>
  )
}

export default SnackBar