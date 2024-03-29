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
export default function Debt() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const modalRef = useRef();
  const [debts, setDebts] = useState([]);
  const getDebtsInRange = async () => {
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
        `https://active-surf-api.onrender.com/api/debt/getDebtsInRange?startDate=${startDate}&endDate=${endDate}`
      );
      console.log("response.data", response.data);
      setDebts(response.data);
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
        onClick={getDebtsInRange}
      >
        Borçları Filtrele
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
              <TableCell>Ürün adı</TableCell>
              <TableCell>Borç Tarihi</TableCell>
              <TableCell>Borç Tutarı</TableCell>
              <TableCell>Kalan Borç Tutarı</TableCell>
              <TableCell>Borç Notu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts?.map((debt, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Link to={`/member/${debt.memberId}`}>
                      {debt.memberName}
                    </Link>
                  </TableCell>
                  <TableCell>{debt.productName}</TableCell>
                  <TableCell>
                    {new Date(debt.debtDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{debt.price}</TableCell>
                  <TableCell>{debt.remainingPrice}</TableCell>
                  <TableCell>{debt.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
