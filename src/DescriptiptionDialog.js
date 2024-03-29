import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  Box,
  DialogTitle,
  TextField,
  DialogActions,
} from "@mui/material";
import axios from "axios";
export default function DescriptionDialog({ service, onClose }) {
  const handleDescription = async () => {
    try {
      const serviceType = service.lessonKind
        ? "Lesson"
        : service.storedPlace
        ? "Storage"
        : service.productName
        ? "Debt"
        : service.campType
        ? "Camp"
        : "Rent";

      if (serviceType === "Lesson") {
        await axios.post(
          `https://active-surf-api.onrender.com/lesson/saveLesson`,
          {
            ...service,
            description,
          }
        );
      } else if (serviceType === "Storage") {
        await axios.post(
          `https://active-surf-api.onrender.com/storage/saveStorage`,
          {
            ...service,

            description,
          }
        );
      } else if (serviceType === "Debt") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/debt/saveDebt`,
          {
            ...service,

            description,
          }
        );
      } else if (serviceType === "Rent") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/rent/saveRent`,
          {
            ...service,

            description,
          }
        );
      } else if (serviceType === "Camp") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/camp/saveCamp`,
          {
            ...service,
            description,
          }
        );
      }

      window.location.reload();
    } catch (error) {
      console.error("Error making payment:", error.response.data.error);
      alert(error.response.data.error);
    }
  };

  const [description, setDescription] = useState("");
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Not Ekle</DialogTitle>
      <DialogContent>
        <Box marginBottom={3} marginTop={4}>
          <TextField
            fullWidth
            required
            label="Not"
            type="string"
            defaultValue={service.description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleDescription}>
          Notu Kaydet
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          İptal
        </Button>
      </DialogActions>
    </Dialog>
  );
}
