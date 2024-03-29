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

const SaveCampDialog = ({ open, member, onClose }) => {
  const [campType, setCampType] = useState("beginner1");
  const [campAmountWeek, setCampAmountWeek] = useState("");
  const [campAmountDay, setCampAmountDay] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [price, setPrice] = useState("");
  const [teacher, setTeacher] = useState("");
  const [description, setDescription] = useState("");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "https://active-surf-api.onrender.com/api/teacher/getAllTeachers"
        );
        setTeachers(response.data);
      } catch (error) {
        console.error("Öğretmenler veri tabanından çekilemedi.", error);
        alert("Öğretmenler veri tabanından çekilemedi.");
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
        campType,
        lessonAmount: campAmountDay * campAmountWeek,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        teacherName: teacher.name,
        memberName: member.name,
        campAmountDay,
        campAmountWeek,
        remainingPrice: Number(price),
        remainingCampAmount: Number(campAmountDay) * Number(campAmountWeek),
        price: Number(price),
        memberId: member._id,
        teacherId: teacher._id,
        description,
      };
      await axios.post(
        `https://active-surf-api.onrender.com/api/camp/saveCamp`,
        lessonData
      );
      await axios.post(
        `https://active-surf-api.onrender.com/api/member/saveMember`,
        {
          ...member,
          id: member._id,
          debt: member.debt + Number(price),
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error adding lesson:", error.response.data.error);
      alert(error.response.data.error);
    }
  };
  function handleChangeCampType(e) {
    setCampType(e.target.value);
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Yeni Kamp Dersi Ekle</DialogTitle>
      <DialogContent>
        <FormLabel>Kamp Tipi</FormLabel>
        <RadioGroup
          defaultValue="group"
          name="radio-buttons-group"
          value={campType}
          onChange={handleChangeCampType}
        >
          <FormControlLabel
            value="beginner1"
            control={<Radio />}
            label="Beginner 1"
          />
          <FormControlLabel
            value="beginner2"
            control={<Radio />}
            label="Beginner 2"
          />
          <FormControlLabel
            value="advanced"
            control={<Radio />}
            label="Advanced"
          />
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
          label="Hafta"
          fullWidth
          required
          type="number"
          margin="normal"
          value={campAmountWeek}
          onChange={(e) => setCampAmountWeek(e.target.value)}
        />
        <TextField
          label="Gün"
          fullWidth
          required
          type="number"
          margin="normal"
          value={campAmountDay}
          onChange={(e) => setCampAmountDay(e.target.value)}
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

export default SaveCampDialog;
