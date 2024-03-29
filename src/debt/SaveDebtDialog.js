import React, { useState } from "react";
import { Button, TextField, Dialog, DialogContent } from "@mui/material";
import axios from "axios";

const SaveDebtDialog = ({ open, member, onClose }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [debtDate, setDebtDate] = useState("");

  const handleAddDebt = async () => {
    try {
      if (price <= 0) {
        alert("Tutar 0'dan büyük olmalıdır.");
        return;
      }
      await axios.post(
        `https://active-surf-api.onrender.com/api/debt/saveDebt`,
        {
          memberName: member.name,
          debtDate: debtDate,
          price: price,
          productName,
          memberId: member._id,
          remainingPrice: Number(price),
          description: description,
        }
      );
      await axios.post(
        `https://active-surf-api.onrender.com/api/member/saveMember`,
        {
          ...member,
          id: member._id,
          debt: member.debt + Number(price),
        }
      );
      window.location.reload();
    } catch (error) {
      console.error(error.response.data.error);
      alert(error.response.data.error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <h2>Yeni Borç Ekle</h2>
        <TextField
          label="Ürün Adı"
          fullWidth
          margin="normal"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          label="Tutar"
          type="number"
          fullWidth
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
        <TextField
          required
          label="Borç Tarihi"
          type="date"
          fullWidth
          margin="normal"
          value={debtDate}
          onChange={(e) => setDebtDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleAddDebt}>
          Ekle
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Kapat
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDebtDialog;
