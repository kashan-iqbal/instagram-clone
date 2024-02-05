import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";

const usePositionedSnackbar = () => {
  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });

  const handleClick = (newState) => () => {
    setSnackbarState({ ...newState, open: true });
  };

  const handleClose = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };
  const showSnackbar = (message, option = {}) => {
    const newState = {
      vertical: option.vertical || "top",
      horizontal: option.vertical || "center",
      message: message,
      open: true,
    };

    setSnackbarState(newState);
  };

  const PositionedSnackbar = () => (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        open={snackbarState.open}
        onClose={handleClose}
        message={snackbarState.message}
        key={snackbarState.vertical + snackbarState.horizontal}
        autoHideDuration={2000}
      />
    </Box>
  );

  return { PositionedSnackbar, showSnackbar };
};

export default usePositionedSnackbar;
