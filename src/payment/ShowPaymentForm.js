import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "axios";
const PaymentTypes = {
  credit_card: "Kredi Kartı",
  cash: "Nakit",
  iban: "IBAN",
  currency: "Döviz",
  // Diğer ödeme türlerini buraya ekleyin
};
const ShowPaymentForm = ({ member, service, onClose }) => {
  console.log("member", member);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/payment/getPaymentsForService/${service._id}`)
      .then((response) => {
        setPayments(response.data.payments);
      });
  }, []);
  const handleDeletePayment = async (payment) => {
    try {
      const paymentAmount = payment.amount;
      await axios.delete(`/api/payment/deletePayment/${payment._id}`);
      if (service.lessonKind) {
        await axios.post("/api/lesson/saveLesson", {
          ...service,
          id: service._id,
          isPaid: false,
          remainingPrice: service.remainingPrice + paymentAmount,
        });
      } else if (service.productName) {
        await axios.post("/api/debt/saveDebt", {
          ...service,
          isPaid: false,
          id: service._id,
          remainingPrice: service.remainingPrice + paymentAmount,
        });
      } else if (service.storedPlace) {
        await axios.post("/api/storage/saveStorage", {
          ...service,
          isPaid: false,
          id: service._id,
          remainingPrice: service.remainingPrice + paymentAmount,
        });
      } else if (service.campType) {
        await axios.post("/api/camp/saveCamp", {
          ...service,
          isPaid: false,
          id: service._id,
          remainingPrice: service.remainingPrice + paymentAmount,
        });
      } else {
        await axios.post("/api/rent/saveRent", {
          ...service,
          isPaid: false,
          id: service._id,
          remainingPrice: service.remainingPrice + paymentAmount,
        });
      }
      await axios.post("/api/member/saveMember", {
        ...member,
        id: member._id,
        debt: member.debt + paymentAmount,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting payment:", error.response.data.error);
      alert(error.response.data.error);
    }
  };
  console.log(service);
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <h2>Ödemeler</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tarih</TableCell>
                <TableCell>Miktar</TableCell>
                <TableCell>Ödeme Tipi</TableCell>
                <TableCell>Kur</TableCell>
                <TableCell>Sil</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments?.map((payment, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{PaymentTypes[payment.type]}</TableCell>
                  <TableCell>{payment.rate}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeletePayment(payment)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ShowPaymentForm;
