import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import PaymentForm from "../payment/PaymentForm";
import LessonDateForm from "./LessonDateForm";
import LessonDates from "./LessonDates";
import ShowPaymentForm from "../payment/ShowPaymentForm";
import DescriptionDialog from "../DescriptiptionDialog";

const MemberLessonDialog = ({ open, member, onClose }) => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [showPaymentDialogVisible, setShowPaymentDialogVisible] =
    useState(false);
  const [lessonDatesVisible, setLessonDatesVisible] = useState(false);
  const [lessonDateDialogVisible, setLessonDateDialogVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [descriptionDialogVisible, setDescriptionDialogVisible] =
    useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/api/teacher/getAllTeachers");
        setTeachers(response.data);
      } catch (error) {
        console.error(error);
        console.error("Öğretmenler veri tabanından çekilemedi");
      }
    };
    const fetchLessons = async () => {
      try {
        const response = await axios.get(
          `/api/lesson/getLessonsForMember/${member._id}`
        );
        setLessons(response.data.lessons);
      } catch (error) {
        console.error("Dersler veri tabanından çekilemedi");
        console.error(error);
      }
    };
    if (member) {
      fetchTeachers();
      fetchLessons();
    }
  }, []);

  const handlePayment = async (lesson) => {
    setSelectedLesson(lesson);
    setPaymentDialogVisible(true);
  };
  const handleShowPayment = (lesson) => {
    setSelectedLesson(lesson);
    setShowPaymentDialogVisible(true);
  };
  const handleDelete = async (lessonId) => {
    try {
      await axios.delete(`/api/lesson/deleteLesson/${lessonId}`);
      window.location.reload();
    } catch (error) {
      console.error("Ders silinirken hata oluştu.", error);
      alert(error.response.data.error);
    }
  };
  const addLessonDate = (lesson) => {
    setSelectedLesson(lesson);
    setLessonDateDialogVisible(true);
  };
  const showLessonDates = (lesson) => {
    setSelectedLesson(lesson);
    setLessonDatesVisible(true);
  };
  const handleAddDescription = (lesson) => {
    setSelectedLesson(lesson);
    setDescriptionDialogVisible(true);
  };
  const handleTableRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };
  return (
    <div>
      {descriptionDialogVisible && (
        <DescriptionDialog
          service={selectedLesson}
          onClose={() => setDescriptionDialogVisible(false)}
        />
      )}
      {paymentDialogVisible && (
        <PaymentForm
          member={member}
          service={selectedLesson}
          onClose={() => setPaymentDialogVisible(false)}
        />
      )}
      {showPaymentDialogVisible && (
        <ShowPaymentForm
          member={member}
          service={selectedLesson}
          onClose={() => setShowPaymentDialogVisible(false)}
        />
      )}
      {lessonDateDialogVisible && (
        <LessonDateForm
          lesson={selectedLesson}
          onClose={() => setLessonDateDialogVisible(false)}
        />
      )}
      {lessonDatesVisible && (
        <LessonDates
          lesson={selectedLesson}
          onClose={() => setLessonDatesVisible(false)}
        />
      )}
      <h2>Ders Detayları</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ders Tipi</TableCell>
              <TableCell>Ders Sayısı</TableCell>
              <TableCell>Kalan Ders Sayısı</TableCell>
              <TableCell>Ücret</TableCell>
              <TableCell>Kalan Ücret</TableCell>
              <TableCell>Öğretmen</TableCell>
              <TableCell>Ders Çeşidi</TableCell>
              <TableCell>Başlangıç Tarihi</TableCell>
              <TableCell>Bitiş Tarihi</TableCell>
              <TableCell>Not</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons?.map((lesson, index) => (
              <TableRow
                key={index}
                onClick={() => handleTableRowClick(index)}
                selected={selectedRow === index}
                hover
              >
                <TableCell>
                  <p>{lesson.isGroup ? "Grup" : "Özel"}</p>
                </TableCell>
                <TableCell>{lesson.lessonAmount}</TableCell>
                <TableCell>{lesson.remainingLessonAmount}</TableCell>
                <TableCell>{lesson.price}</TableCell>
                <TableCell>{lesson.remainingPrice}</TableCell>
                <TableCell>
                  <p>
                    {
                      teachers.find((teacher) => {
                        return teacher._id === lesson.teacherId;
                      })?.name
                    }
                  </p>
                </TableCell>
                <TableCell>
                  {lesson.lessonKind === "kiteSurf" ? (
                    <p>Kite Surf</p>
                  ) : lesson.lessonKind === "windSurf" ? (
                    <p>Rüzgar Sörfü</p>
                  ) : (
                    <p>Foil Sörf</p>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(lesson.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(lesson.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{lesson.description}</TableCell>
                <TableCell>
                  {!lesson.isPaid && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePayment(lesson)}
                    >
                      Ödeme Yap
                    </Button>
                  )}
                  {lesson.remainingPrice !== lesson.price && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleShowPayment(lesson)}
                    >
                      Ödemeler
                    </Button>
                  )}
                  {lesson.remainingLessonAmount > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => addLessonDate(lesson)}
                    >
                      Ders Tamamlama
                    </Button>
                  )}
                  {lesson.lessonDates.length > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => showLessonDates(lesson)}
                    >
                      Tamamlanan Dersler
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(lesson._id)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAddDescription(lesson)}
                  >
                    Not Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MemberLessonDialog;
