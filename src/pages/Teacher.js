import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  TableCell,
  TextField,
  TableBody,
  TableContainer,
  Table,
  Link,
  TableHead,
  TableRow,
  ButtonGroup,
  Paper,
} from "@mui/material";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
const LessonKinds = {
  windSurf: "Rüzgar Sörfü",
  kiteSurf: "Uçurtma Sörfü",
  wingFoil: "Kanat Sörfü",
};
const CampTypes = {
  beginner1: "Beginner 1",
  beginner2: "Beginner 2",
  advanved: "Advanced",
};
export default function Teacher() {
  const modalRef = useRef();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selected, setSelected] = useState("lesson");

  const handleSelection = (event, newSelection) => {
    console.log("newSelection", event);
    setSelected(event);
  };

  const [lessons, setLessons] = useState([]);
  const [camps, setCamps] = useState([]);
  const teacherId = window.location.pathname.split("/").pop();

  const getLessonsForTeacher = async () => {
    try {
      const response = await axios.get(
        `https://active-surf-api.onrender.com/api/lesson/getLessonsForTeacherInRange?teacherId=${teacherId}&startDate=${startDate}&endDate=${endDate}`
      );
      console.log("lessons", response.data);
      setLessons(response.data);
      setCamps([]);
    } catch (error) {
      console.error(error);
    }
  };

  const getCampsForTeacher = async () => {
    try {
      const response = await axios.get(
        `http://active-surf-api.onrender.com/api/camp/getCampsForTeacherInRange?teacherId=${teacherId}&startDate=${startDate}&endDate=${endDate}`
      );
      setCamps(response.data);
      setLessons([]);
    } catch (error) {
      console.error(error);
    }
  };
  function printDocument() {
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
  }
  return (
    <div>
      <div>
        <ButtonGroup
          style={{ marginTop: "25px", marginLeft: "30px", marginRight: "30px" }}
          value={selected}
          exclusive
          aria-label="lesson or camp"
        >
          <Button
            variant={selected === "lesson" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSelection("lesson")}
            aria-label="lesson"
          >
            Ders
          </Button>
          <Button
            variant={selected === "camp" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSelection("camp")}
            aria-label="camp"
          >
            Kamp
          </Button>
        </ButtonGroup>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard")}
          style={{ position: "absolute", right: 30, top: 30 }}
        >
          Anasayfaya Dön
        </Button>
        <TextField
          label="Başlangıç Tarihi"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginTop: "20px" }}
        />
        <TextField
          label="Bitiş Tarihi"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginTop: "20px" }}
        />

        <Button
          style={{ marginLeft: "30px" }}
          variant="contained"
          color="primary"
          onClick={
            selected === "lesson" ? getLessonsForTeacher : getCampsForTeacher
          }
        >
          Filtrele
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={printDocument}
          style={{ marginLeft: "30px" }}
        >
          PDF Olarak İndir
        </Button>
        <TableContainer component={Paper} ref={modalRef}>
          <Table>
            {selected === "lesson" ? (
              <TableHead>
                <TableRow>
                  <TableCell>Öğrenci Adı</TableCell>
                  <TableCell>Ders Tipi</TableCell>
                  <TableCell>Öğretmen Adı</TableCell>
                  <TableCell>Ders Tarihleri(Girilen Aralıktaki)</TableCell>
                  <TableCell>Ders Sayısı</TableCell>
                  <TableCell>Kalan Ders Sayısı</TableCell>
                  <TableCell>Ücret</TableCell>
                  <TableCell>Kalan Ücret</TableCell>
                  <TableCell>Sörf Tipi</TableCell>
                  <TableCell>Not</TableCell>
                  <TableCell>Hoca Payı</TableCell>
                </TableRow>
              </TableHead>
            ) : (
              <TableHead>
                <TableRow>
                  <TableCell>Öğrenci Adı</TableCell>
                  <TableCell>Kamp Tipi</TableCell>
                  <TableCell>Öğretmen Adı</TableCell>
                  <TableCell>Ücret</TableCell>
                  <TableCell>Kalan Ücret</TableCell>
                  <TableCell>Kamp Toplam Gün</TableCell>
                  <TableCell>Kamp Kalan Gün</TableCell>
                  <TableCell>Kamp Tarihleri</TableCell>
                  <TableCell>Hoca Payı</TableCell>
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {selected === "lesson"
                ? lessons?.map((lesson, index) => {
                    const lessonDates = lesson.lessonDates
                      .filter(
                        (r) =>
                          new Date(r).getTime() >=
                            new Date(startDate).getTime() &&
                          new Date(r).getTime() <= new Date(endDate).getTime()
                      )
                      .map((date) => new Date(date).toLocaleDateString());
                    const lessonPricePerLesson =
                      lesson.price / lesson.lessonAmount;
                    const teachersLessonGiven = lessonDates.length;
                    const teachersPayment =
                      lessonPricePerLesson * teachersLessonGiven;
                    const serviceType =
                      LessonKinds[lesson.lessonKind] || "Bilinmeyen";

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Link to={`/member/${lesson.memberId}`}>
                            {lesson.memberName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {lesson.isGroup ? "Grup" : "Özel"}
                        </TableCell>
                        <TableCell>{lesson.teacherName}</TableCell>
                        <TableCell>{lessonDates.join(", ")}</TableCell>
                        <TableCell>{lesson.lessonAmount}</TableCell>
                        <TableCell>{lesson.remainingLessonAmount}</TableCell>
                        <TableCell>{lesson.price}</TableCell>
                        <TableCell>{lesson.remainingPrice}</TableCell>
                        <TableCell>{serviceType}</TableCell>
                        <TableCell>{lesson.description}</TableCell>
                        <TableCell>{parseInt(teachersPayment)}</TableCell>
                      </TableRow>
                    );
                  })
                : camps?.map((camp, index) => {
                    const campType = CampTypes[camp.campType] || "Bilinmeyen";
                    const campDates = camp.campDates
                      .filter(
                        (r) =>
                          new Date(r).getTime() >=
                            new Date(startDate).getTime() &&
                          new Date(r).getTime() <= new Date(endDate).getTime()
                      )
                      .map((date) => new Date(date).toLocaleDateString());
                    const campAmount = camp.campAmountDay * camp.campAmountWeek;
                    const campPricePerLesson = camp.price / campAmount;
                    const teachersLessonGiven = campDates.length;
                    const teachersPayment =
                      campPricePerLesson * teachersLessonGiven;
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Link to={`/member/${camp.memberId}`}>
                            {camp.memberName}
                          </Link>
                        </TableCell>

                        <TableCell>{campType}</TableCell>
                        <TableCell>{camp.teacherName}</TableCell>
                        <TableCell>{camp.price}</TableCell>
                        <TableCell>{camp.remainingPrice}</TableCell>
                        <TableCell>
                          {camp.campAmountWeek * camp.campAmountDay}
                        </TableCell>
                        <TableCell>{camp.remainingCampAmount}</TableCell>

                        <TableCell>{campDates.join(", ")}</TableCell>
                        <TableCell>{parseInt(teachersPayment)}</TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
