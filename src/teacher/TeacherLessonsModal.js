import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Modal,
  Button,
  Table,
  TableBody,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const TeacherLessonsModal = ({ open, lessons, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const modalRef = useRef();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const printDocument = () => {
    html2canvas(modalRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate the width and height keeping aspect ratio the same.
      const ratio = canvasWidth / canvasHeight;
      let width = pdfWidth;
      let height = pdfWidth / ratio;
      // Check whether PDF's height is sufficient
      if (height > pdfHeight) {
        height = pdfHeight;
        width = pdfHeight * ratio;
      }

      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save("download.pdf");
    });
  };
  const filterLessons = (lessons) => {
    if (!token) {
      navigate("/");
      return;
    }

    if (!startDate || !endDate) return lessons;

    return lessons.filter((lesson) => {
      const lessonDates = lesson.lessonDates.map((date) => new Date(date));
      const start = new Date(startDate);
      const end = new Date(endDate);

      return lessonDates.some((date) => date >= start && date <= end);
    });
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={printDocument}
          style={{ marginTop: "20px" }}
        >
          PDF Olarak İndir
        </Button>
        <h2>Öğretmenin Dersleri</h2>
        <TextField
          id="start-date"
          label="Başlangıç Tarihi"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          id="end-date"
          label="Bitiş Tarihi"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TableContainer component={Paper} ref={modalRef}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ders Türü</TableCell>
                <TableCell>Ders Miktarı</TableCell>
                <TableCell>Ders Sayısı</TableCell>
                <TableCell>Kalan Ders Sayısı</TableCell>
                <TableCell>Fiyat</TableCell>
                <TableCell>Kalan Fiyat</TableCell>
                <TableCell>Hoca Payı</TableCell>
                <TableCell>Öğrenci Adı</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterLessons(lessons)?.map((lesson) => {
                const lessonPricePerLesson = lesson.price / lesson.lessonAmount;
                const teachersLessonGiven =
                  lesson.lessonAmount - lesson.remainingLessonAmount;
                const teachersPayment =
                  lessonPricePerLesson * teachersLessonGiven;
                return (
                  <TableRow key={lesson._id}>
                    <TableCell>{lesson.isGroup ? "Grup" : "Özel"}</TableCell>

                    <TableCell>
                      {lesson.lessonKind === "kiteSurf" ? (
                        <p>Kite Surf</p>
                      ) : lesson.lessonKind === "windSurf" ? (
                        <p>Rüzgar Sörfü</p>
                      ) : (
                        <p>Foil Sörf</p>
                      )}
                    </TableCell>
                    <TableCell>{lesson.lessonAmount}</TableCell>
                    <TableCell>{lesson.remainingLessonAmount}</TableCell>
                    <TableCell>{lesson.price}</TableCell>
                    <TableCell>{lesson.remainingPrice}</TableCell>
                    <TableCell>{teachersPayment}</TableCell>
                    <TableCell>{lesson.memberName}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          style={{ marginTop: "20px" }}
        >
          Kapat
        </Button>
      </div>
    </Modal>
  );
};

export default TeacherLessonsModal;
