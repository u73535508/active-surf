import React, { useState, useRef } from "react";
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

const PaymentTypes = {
  credit_card: "Kredi Kartı",
  cash: "Nakit",
  iban: "IBAN",
  currency: "Döviz",
  // Diğer ödeme türlerini buraya ekleyin
};
const ServiceTypes = {
  Lesson: "Ders",
  Storage: "Depolama",
  Rent: "Kira",
  Debt: "Borç",
  Camp: "Kamp",
};
export default function Report() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const modalRef = useRef();
  const [payments, setPayments] = useState([]);
  const getPaymentsInRange = async () => {
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
        `https://active-surf-api.onrender.com/api/payment/getPaymentsInRange?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Payments:", response.data.payments);
      setPayments(response.data.payments);
    } catch (error) {
      console.error("Error getting payments:", error.response.data.error);
      alert("Ödemeler alınırken bir hata oluştu.");
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
        onClick={getPaymentsInRange}
      >
        Gelirleri Filtrele
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
              <TableCell>Tarih</TableCell>
              <TableCell>Miktar</TableCell>
              <TableCell>Ödeme Tipi</TableCell>
              <TableCell>Kur</TableCell>
              <TableCell>Hizmet Adı</TableCell>
              <TableCell>Hizmet Alan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments?.map((payment, index) => {
              const date = new Date(payment.date).toLocaleDateString();
              const paymentType = PaymentTypes[payment.type] || "Bilinmeyen";
              const serviceType =
                ServiceTypes[payment.serviceType] || "Bilinmeyen";

              return (
                <TableRow key={index}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{paymentType}</TableCell>
                  <TableCell>{payment.rate}</TableCell>
                  <TableCell>{serviceType}</TableCell>
                  <TableCell>{payment.memberName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
