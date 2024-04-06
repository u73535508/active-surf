import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Radio,
  InputLabel,
  FormLabel,
  RadioGroup,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SaveLessonDialog = ({ open, member, onClose }) => {
  const [lessonType, setLessonType] = useState("group");
  const [lessonAmount, setLessonAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [teacher, setTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [lessonKind, setLessonKind] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    navigate("/");
  }
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "https://active-surf-api.onrender.com/api/teacher/getAllTeachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeachers(response.data);
      } catch (error) {
        console.error("Dersler veri tabanından çekilemedi.", error);
        alert("Dersler veri tabanından çekilemedi.");
      }
    };

    fetchTeachers();
  }, []);

  const handleAddLesson = async () => {
    try {
      if (!teacher) {
        alert("Lütfen bir öğretmen seçiniz.");
        return;
      }
      if (price <= 0) {
        alert("Fiyat 0'dan büyük olmalıdır.");
        return;
      }
      if (startDate > endDate) {
        alert("Başlangıç tarihi bitiş tarihinden büyük olamaz.");
        return;
      }
      const lessonData = {
        isGroup: lessonType === "group",
        lessonAmount: lessonAmount,
        startDate,
        endDate,
        description,
        lessonKind,
        remainingPrice: Number(price),
        remainingLessonAmount: Number(lessonAmount),
        price: Number(price),
        memberId: member._id,
        memberName: member.name,
        teacherId: teacher._id,
        teacherName: teacher.name,
      };
      await axios.post(
        `https://active-surf-api.onrender.com/api/lesson/saveLesson`,
        lessonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.post(
        `https://active-surf-api.onrender.com/api/member/saveMember`,
        {
          ...member,
          id: member._id,
          debt: member.debt + Number(price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error adding lesson:", error.response.data.error);
      alert(error.response.data.error);
    }
  };
  function handleChangeLessonType(e) {
    setLessonType(e.target.value);
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Yeni Ders Ekle</DialogTitle>
      <DialogContent>
        <FormLabel>Ders Tipi</FormLabel>
        <RadioGroup
          defaultValue="group"
          name="radio-buttons-group"
          value={lessonType}
          onChange={handleChangeLessonType}
        >
          <FormControlLabel value="group" control={<Radio />} label="Grup" />
          <FormControlLabel value="single" control={<Radio />} label="Özel" />
        </RadioGroup>
        <TextField
          required
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
          required
          margin="normal"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Ders Miktarı"
          fullWidth
          required
          type="number"
          margin="normal"
          value={lessonAmount}
          onChange={(e) => setLessonAmount(e.target.value)}
        />
        <TextField
          label="Fiyat"
          fullWidth
          required
          type="number"
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <InputLabel id="demo-simple-select-label">Ders Tipi</InputLabel>
        <Select
          required
          value={lessonKind}
          onChange={(e) => setLessonKind(e.target.value)}
          fullWidth
        >
          <MenuItem value="windSurf">Rüzgar Sörfü</MenuItem>
          <MenuItem value="kiteSurf">Kite Sörf</MenuItem>
          <MenuItem value="wingFoil">Foil Sörf</MenuItem>
        </Select>
        <InputLabel id="demo-simple-select-label">Öğretmen</InputLabel>
        <Select
          required
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          fullWidth
        >
          {teachers?.map((teacher) => (
            <MenuItem key={teacher._id} value={teacher}>
              {teacher.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Not"
          type="string"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleAddLesson}>
          Ekle
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveLessonDialog;
