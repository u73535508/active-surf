import { styled, css } from "@mui/system";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SaveExpense = ({ onClose }) => {
  const [expenseName, setExpenseName] = useState("");
  const [price, setPrice] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  async function submitExpense() {
    if (!token) {
      navigate("/");
      return;
    }
    if (!expenseName || !price || !expenseDate) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }
    if (price <= 0) {
      alert("Ücret negatif olamaz.");
      return;
    }
    try {
      await axios.post(
        "https://active-surf-api.onrender.com/api/expense/saveExpense",
        {
          expenseName,
          price,
          expenseDate,

          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving expense:", error);
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
          label="Gider Adı"
          fullWidth
          margin="normal"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label="Ödeme Tarihi"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Ücret"
          fullWidth
          type="number"
          onWheel={() => document.activeElement.blur()}
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <TextField
          label="Açıklama"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={submitExpense}
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

export default SaveExpense;
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
