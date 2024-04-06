import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LessonKinds = {
  windSurf: "Rüzgar Sörfü",
  kiteSurf: "Uçurtma Sörfü",
  wingFoil: "Kanat Sörfü",
};
export default function Rent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const modalRef = useRef();
  const [rents, setRents] = useState([]);
  const getRentsInRange = async () => {
    if (!token) {
      navigate("/");
      return;
    }
    if (!startDate || !endDate) {
      alert("Lütfen başlangıç ve bitiş tarihlerini girin.");
      return;
    }
    if (startDate > endDate) {
      alert("Başlangıç tarihi bitiş tarihinden büyük olamaz.");
      return;
    }
    try {
      const response = await axios.get(
        `https://active-surf-api.onrender.com/api/rent/getRentsInRange?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data", response.data);
      setRents(response.data);
    } catch (error) {
      console.error("Error getting rents:", error.response.data.error);
      alert("Kiralamalar alınırken bir hata oluştu.");
    }
  };
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

  return (
    <div>
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
        style={{ marginTop: "27px", marginLeft: "30px" }}
        variant="contained"
        color="primary"
        onClick={getRentsInRange}
      >
        Kiralamaları Filtrele
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={printDocument}
        style={{ marginTop: "27px", marginLeft: "30px" }}
      >
        PDF Olarak İndir
      </Button>
      <TableContainer component={Paper} ref={modalRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Öğrenci Adı</TableCell>
              <TableCell>Kiralanan Ürün</TableCell>
              <TableCell>Kiralama Tarihi</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Kalan Fiyat</TableCell>
              <TableCell>Kiralama Notu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rents?.map((rent, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link to={`/member/${rent.memberId}`}>
                      {rent.memberName}
                    </Link>
                  </TableCell>
                  <TableCell>{rent.item}</TableCell>
                  <TableCell>
                    {rent.rentDates
                      .filter(
                        (r) =>
                          new Date(r).getTime() >=
                            new Date(startDate).getTime() &&
                          new Date(r).getTime() <= new Date(endDate).getTime()
                      )
                      .map((date) => new Date(date).toLocaleDateString())
                      .join(", ")}
                  </TableCell>
                  <TableCell>{rent.price}</TableCell>
                  <TableCell>{rent.remainingPrice}</TableCell>
                  <TableCell>{rent.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
