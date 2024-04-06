import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SaveRentDialog = ({ open, member, onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [item, setItem] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const handleAddRent = async () => {
    if (!token) {
      navigate("/");
      return;
    }
    try {
      if (price <= 0) {
        alert("Fiyat 0'dan büyük olmalıdır.");
        return;
      }
      if (startDate > endDate) {
        alert("Başlangıç tarihi bitiş tarihinden büyük olamaz.");
        return;
      }
      await axios.post(
        `https://active-surf-api.onrender.com/api/rent/saveRent`,
        {
          remainingPrice: Number(price),
          item,
          startDate,
          endDate,
          price,
          description,
          memberName: member.name,
          memberId: member._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.post(
        `https://active-surf-api.onrender.com/api/member/saveMember`,
        {
          ...member,
          id: member._id,
          debt: member.debt + Number(price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error adding rent:", error);
      alert(error.response.data.error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Yeni Kiralama Ekle</DialogTitle>
      <DialogContent>
        <TextField
          label="Ürün"
          fullWidth
          margin="normal"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <TextField
          label="Başlangıç Tarihi"
          type="date"
          fullWidth
          margin="normal"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Bitiş Tarihi"
          type="date"
          fullWidth
          margin="normal"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Fiyat"
          fullWidth
          type="number"
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Not"
          type="string"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddRent}>
          Ekle
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Kapat
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SaveRentDialog;
