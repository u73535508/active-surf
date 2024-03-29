import React, { useState } from "react";
import {
  Modal,
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import axios from "axios";

export default function LessonDateForm({ lesson, onClose }) {
  const [lessonDate, setLessonDate] = useState("");
  const handleLessonAdder = async () => {
    try {
      if (!lessonDate) {
        alert("Lütfen bir tarih seçiniz.");
        return;
      }
      if (lesson.lessonKind) {
        await axios.post(
          `https://active-surf-api.onrender.com/api/lesson/saveLesson`,
          {
            ...lesson,
            remainingLessonAmount: lesson.remainingLessonAmount - 1,
            lessonDates: [...lesson.lessonDates, new Date(lessonDate)],
          }
        );
      } else if (lesson.campType) {
        await axios.post(
          `https://active-surf-api.onrender.com/api/camp/saveCamp`,
          {
            ...lesson,
            remainingCampAmount: lesson.remainingCampAmount - 1,
            campDates: [...lesson.campDates, lessonDate],
          }
        );
      } else {
        await axios.post(
          `https://active-surf-api.onrender.com/api/rent/saveRent`,
          {
            ...lesson,
            rentDates: [...lesson.rentDates, lessonDate],
          }
        );
      }

      window.location.reload();
    } catch (error) {
      // Ödeme tarihini belirledikten sonra, lesson'ın isPaid değerini güncelle

      console.error("Ders tarihi eklenirken hata:", error);
      alert(error.response.data.error);
    }
  };
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Tarih Ekle</DialogTitle>
      <DialogContent>
        <Box marginBottom={3} marginTop={4}>
          <TextField
            required
            label="Ders Tarihi"
            type="date"
            value={lessonDate}
            onChange={(e) => setLessonDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleLessonAdder}>
          Tarih Ekle
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          İptal
        </Button>
      </DialogActions>
    </Dialog>
  );
}
