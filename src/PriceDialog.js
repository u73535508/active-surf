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
export default function PriceDialog({ service, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handlePrice = async () => {
    if (!token) {
      navigate("/");
      return;
    }
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
      const priceDifference = service.price - price;
      // service was 1000 tl, now 500 tl => difference is positive (subtraction)
      // service was 1000 tl, now 1500 tl -> difference is negative (addition)
      const remainingPrice = service.remainingPrice - priceDifference;
      if (remainingPrice < 0) {
        alert(
          "Güncellemek istediğiniz fiyattan fazlasını üye ödemiş gözüküyor."
        );
        return;
      }
      if (serviceType === "Lesson") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/lesson/saveLesson`,
          {
            ...service,
            isPaid: remainingPrice === 0,
            price,
            remainingPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (serviceType === "Storage") {
        await axios.post(
          `https://active-surf-api.onrender.com/api/storage/saveStorage`,
          {
            ...service,
            isPaid: remainingPrice === 0,
            remainingPrice,
            price,
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
            isPaid: remainingPrice === 0,
            remainingPrice,
            price,
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
            remainingPrice,
            isPaid: remainingPrice === 0,
            price,
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
            price,
            remainingPrice,
            isPaid: remainingPrice === 0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      await axios.post(
        `https://active-surf-api.onrender.com/api/member/updateMembersDebt`,
        {
          memberId: service.memberId,
          amount: -1 * priceDifference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error saving description:", error.response.data.error);
      alert(error.response.data.error);
    }
  };

  const [price, setPrice] = useState(service.price);
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Fiyat Güncelle</DialogTitle>
      <DialogContent>
        <Box marginBottom={3} marginTop={4}>
          <TextField
            fullWidth
            required
            label="Not"
            type="number"
            defaultValue={service.price}
            onChange={(e) => setPrice(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handlePrice}>
          Fiyat Güncelle
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          İptal
        </Button>
      </DialogActions>
    </Dialog>
  );
}
