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

export default function Expense() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const modalRef = useRef();
  const [expenses, setExpenses] = useState([]);
  const handleDeleteExpense = async (expenseId) => {
    if (!token) {
      navigate("/");
      return;
    }
    try {
      await axios.delete(
        `https://active-surf-api.onrender.com/api/expense/deleteExpense/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert(error.response.data.error);
    }
  };
  const getExpensesInRange = async () => {
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
        `https://active-surf-api.onrender.com/api/expense/getExpensesInRange?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error getting expenses:", error.response.data.error);
      alert("Giderler alınırken bir hata oluştu.");
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
      pdf.save("expenses.pdf");
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
        onClick={getExpensesInRange}
      >
        Giderleri Filtrele
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
              <TableCell>Ücret</TableCell>
              <TableCell>Gider Adı</TableCell>
              <TableCell>Gider Notu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses?.map((expense, index) => {
              const date = new Date(expense.expenseDate).toLocaleDateString();

              return (
                <TableRow key={index}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{expense.price}</TableCell>
                  <TableCell>{expense.expenseName}</TableCell>
                  <TableCell style={{ whiteSpace: "pre-line" }}>
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="print-hide" // Bu sınıfı tanımlamanız gerekiyor
                    >
                      Sil
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
