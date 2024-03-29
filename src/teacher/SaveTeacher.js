import { styled, css } from "@mui/system";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const SaveTeacher = ({ onClose }) => {
  const [name, setName] = useState("");

  async function submitMember() {
    try {
      await axios.post("/api/teacher/saveTeacher", {
        name: name,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert(error.response.data.error);
    }
  }

  return (
    <ModalContent>
      <div
        style={{
          minWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          label="İsim"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={submitMember}
          >
            Kaydet
          </Button>
          <Button variant="outlined" onClick={onClose}>
            İptal
          </Button>
        </div>
      </div>
    </ModalContent>
  );
};

export default SaveTeacher;
export const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

export const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);
