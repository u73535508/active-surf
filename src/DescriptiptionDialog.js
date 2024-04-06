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
import { useNavigate } from "react-router-dom";
export default function DescriptionDialog({ service, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }
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
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (serviceType === "Storage") {
        await axios.post(
          `https://active-surf-api.onrender.com/storage/saveStorage`,
          {
            ...service,

            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (serviceType === "Debt") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/debt/saveDebt`,

          {
            ...service,

            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (serviceType === "Rent") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/rent/saveRent`,
          {
            ...service,

            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (serviceType === "Camp") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/camp/saveCamp`,
          {
            ...service,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      window.location.reload();
    } catch (error) {
      console.error("Error saving description:", error.response.data.error);
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
