import React from "react";
import {
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
} from "@mui/material";
import { IconButton } from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

const LessonDates = ({ lesson, onClose }) => {
  const handleDeleteDate = async (index) => {
    try {
      if (lesson.lessonKind) {
        const updatedDates = lesson.lessonDates.filter(
          (date, i) => i !== index
        );
        const updatedLesson = {
          ...lesson,
          lessonDates: updatedDates,
          remainingLessonAmount: lesson.remainingLessonAmount + 1,
        };
        await axios.post(`/api/lesson/saveLesson`, updatedLesson);
      } else if (lesson.campType) {
        const updatedDates = lesson.campDates.filter((date, i) => i !== index);
        const updatedLesson = {
          ...lesson,
          campDates: updatedDates,
          remainingCampAmount: lesson.remainingCampAmount + 1,
        };
        await axios.post(`/api/camp/saveCamp`, updatedLesson);
      } else {
        const updatedDates = lesson.rentDates.filter((date, i) => i !== index);
        const updatedLesson = {
          ...lesson,
          rentDates: updatedDates,
        };
        await axios.post(`/api/rent/saveRent`, updatedLesson);
      }

      window.location.reload();
    } catch (error) {
      console.error("Ders tarihi silinirken hata: ", error.response.data.error);
      alert(error.response.data.error);
    }
  };
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <h2>Tarihler</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tarih</TableCell>
                <TableCell>Sil</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(
                lesson?.lessonDates ||
                lesson?.rentDates ||
                lesson?.campDates
              )?.map((date, index) => (
                <TableRow key={index} hover>
                  <TableCell>{new Date(date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteDate(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDates;