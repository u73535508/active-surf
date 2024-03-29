import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Select,
  MenuItem,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  Box,
} from "@mui/material";
import axios from "axios";

export default function PaymentForm({ member, service, onClose }) {
  console.log(service);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [rate, setRate] = useState("");
  const handlePayment = async () => {
    try {
      if (paymentAmount > service.remainingPrice) {
        alert("Ödeme miktarı kalan ücretten fazla olamaz.");
        return;
      }
      if (paymentAmount <= 0) {
        alert("Ödeme miktarı 0'dan büyük olmalıdır.");
        return;
      }
      if (!paymentType) {
        alert("Lütfen bir ödeme türü seçiniz.");
        return;
      }
      if (!paymentDate) {
        alert("Lütfen bir ödeme tarihi seçiniz.");
        return;
      }
      if (paymentType === "currency" && !rate) {
        alert("Lütfen bir kur giriniz.");
        return;
      }
      const isServicePaid = service.remainingPrice - paymentAmount === 0;
      const serviceRemainingPrice = service.remainingPrice - paymentAmount;

      const serviceType = service.lessonKind
        ? "Lesson"
        : service.storedPlace
        ? "Storage"
        : service.productName
        ? "Debt"
        : service.campType
        ? "Camp"
        : "Rent";
      const serviceId = service._id;
      const memberName = member.name;
      await axios.post(`/api/payment/savePayment`, {
        memberId: member._id,
        date: paymentDate,
        amount: paymentAmount,
        type: paymentType,
        serviceId: serviceId,
        serviceType: serviceType,
        rate: rate,
        memberName,
      });

      if (serviceType === "Lesson") {
        await axios.post(`/api/lesson/saveLesson`, {
          ...service,
          remainingPrice: serviceRemainingPrice,

          isPaid: isServicePaid,
        });
      } else if (serviceType === "Camp") {
        await axios.post(`/api/camp/saveCamp`, {
          ...service,
          isPaid: isServicePaid,
          remainingPrice: serviceRemainingPrice,
        });
      } else if (serviceType === "Storage") {
        await axios.post(`/api/storage/saveStorage`, {
          ...service,
          isPaid: isServicePaid,
          remainingPrice: serviceRemainingPrice,
        });
      } else if (serviceType === "Debt") {
        await axios.post(`/api/debt/saveDebt`, {
          ...service,
          isPaid: isServicePaid,
          remainingPrice: serviceRemainingPrice,
        });
      } else if (serviceType === "Rent") {
        await axios.post(`/api/rent/saveRent`, {
          ...service,
          isPaid: isServicePaid,
          remainingPrice: serviceRemainingPrice,
        });
      }
      console.log("member", member);
      await axios.post(`/api/member/saveMember`, {
        id: member._id,
        debt: member.debt - Number(paymentAmount),
      });

      window.location.reload();
    } catch (error) {
      console.error("Error making payment:", error.response.data.error);
      alert(error.response.data.error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Ödeme Yap</DialogTitle>
      <DialogContent>
        <Box marginBottom={3} marginTop={4}>
          <TextField
            fullWidth
            required
            label="Ödeme Tarihi"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box marginBottom={3}>
          <Select
            fullWidth
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <MenuItem value={"credit_card"}>Kredi Kartı</MenuItem>
            <MenuItem value={"cash"}>Nakit</MenuItem>
            <MenuItem value={"iban"}>IBAN</MenuItem>
            <MenuItem value={"currency"}>Döviz</MenuItem>
          </Select>
        </Box>
        <Box marginBottom={2}>
          <TextField
            fullWidth
            required
            label="Ödeme Miktarı"
            type="Number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box marginBottom={2}>
          <TextField
            fullWidth
            required
            label="Kur"
            type="String"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handlePayment}>
          Ödeme Yap
        </Button>
        <Button variant="contained" color="secondary" onClick={onClose}>
          İptal
        </Button>
      </DialogActions>
    </Dialog>
  );
}
