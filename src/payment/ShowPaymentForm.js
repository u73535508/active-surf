import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  if (!token) {
    navigate("/");
  }
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://active-surf-api.onrender.com/api/payment/getPaymentsForService/${service._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPayments(response.data.payments);
      });
  }, []);
  const handleDeletePayment = async (payment) => {
    try {
      const paymentAmount = payment.amount;
      await axios.delete(
        `https://active-surf-api.onrender.com/api/payment/deletePayment/${payment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (service.lessonKind) {
        await axios.post(
          "https://active-surf-api.onrender.com/api/lesson/saveLesson",
          {
            ...service,
            id: service._id,
            isPaid: false,
            remainingPrice: service.remainingPrice + paymentAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (service.productName) {
        await axios.post(
          "https://active-surf-api.onrender.com/api/debt/saveDebt",
          {
            ...service,
            isPaid: false,
            id: service._id,
            remainingPrice: service.remainingPrice + paymentAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (service.storedPlace) {
        await axios.post(
          "https://active-surf-api.onrender.com/api/storage/saveStorage",
          {
            ...service,
            isPaid: false,
            id: service._id,
            remainingPrice: service.remainingPrice + paymentAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (service.campType) {
        await axios.post(
          "https://active-surf-api.onrender.com/api/camp/saveCamp",
          {
            ...service,
            isPaid: false,
            id: service._id,
            remainingPrice: service.remainingPrice + paymentAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://active-surf-api.onrender.com/api/rent/saveRent",
          {
            ...service,
            isPaid: false,
            id: service._id,
            remainingPrice: service.remainingPrice + paymentAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      await axios.post(
        "https://active-surf-api.onrender.com/api/member/saveMember",
        {
          ...member,
          id: member._id,
          debt: member.debt + paymentAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
