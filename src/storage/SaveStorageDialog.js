import React, { useState } from "react";
import { Button, TextField, Dialog, DialogContent } from "@mui/material";
import axios from "axios";

const SaveStorageDialog = ({ open, onClose, member }) => {
  const [item, setItem] = useState("");
  const [storedPlace, setStoredPlace] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const handleAddStorage = async () => {
    try {
      if (price <= 0) {
        alert("Fiyat 0'dan büyük olmalıdır.");
        return;
      }
      if (startDate > endDate) {
        alert("Başlangıç tarihi bitiş tarihinden büyük olamaz.");
        return;
      }

      await axios.post(`/api/storage/saveStorage`, {
        item,
        storedPlace,
        startDate,
        remainingPrice: Number(price),
        endDate,
        price,
        description,
        memberId: member._id,
        memberName: member.name,
      });
      await axios.post(`/api/member/saveMember`, {
        ...member,
        id: member._id,
        debt: member.debt + Number(price),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding storage:", error);
      alert(error.response.data.error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <h2>Yeni Depolama Ekle</h2>
        <TextField
          label="Ürün"
          fullWidth
          margin="normal"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <TextField
          label="Depolanan Yer"
          fullWidth
          margin="normal"
          value={storedPlace}
          onChange={(e) => setStoredPlace(e.target.value)}
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
          margin="normal"
          value={price}
          type="number"
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
        <Button variant="contained" color="primary" onClick={handleAddStorage}>
          Ekle
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Kapat
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SaveStorageDialog;
