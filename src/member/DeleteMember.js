import { styled, css } from "@mui/system";
import { Button } from "@mui/material";
import { ButtonGroup } from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function DeleteMember({ memberToDelete, onClose }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    navigate("/");
  }
  const deleteMember = async () => {
    console.log(memberToDelete, "deleted");
    try {
      axios.delete(
        `https://active-surf-api.onrender.com/api/member/deleteMember/${memberToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting member:", error);
      alert(error.response.data.error);
    }
    window.location.reload();
  };
  return (
    <ModalContent>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          height: "150px",
        }}
      >
        <Alert severity="warning">
          {memberToDelete.name} isimli üyeyi silmek istediğinize emin misiniz?
        </Alert>
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ButtonGroup variant="outlined">
            <Button
              style={{ marginRight: "10px" }}
              type="submit"
              variant="contained"
              color="warning"
              onClick={deleteMember}
            >
              Sil
            </Button>
            <Button variant="outlined" color="info" onClick={onClose}>
              Vazgeç
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </ModalContent>
  );
}

const grey = {
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

const ModalContent = styled("div")(
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
