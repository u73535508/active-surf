import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import TeacherLessonsModal from "../teacher/TeacherLessonsModal";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [lessons, setLessons] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    axios
      .get("https://active-surf-api.onrender.com/api/teacher/getAllTeachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error.response.data.error);
        alert("Öğretmenler alınırken bir hata oluştu.");
      });
  }, []);

  const handleTeacherClick = (teacherId) => {
    console.log("xx", teacherId);
    navigate(`/teacher/${teacherId}`);
  };
  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Öğretmenler</h1>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGoHome}
        style={{ marginTop: "20px" }}
      >
        Anasayfaya Dön
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <Button
                    onClick={() => handleTeacherClick(teacher._id)}
                    style={{ textDecoration: "none" }}
                  >
                    {teacher.name}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TeacherLessonsModal
        open={openModal}
        lessons={lessons}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default Teachers;
