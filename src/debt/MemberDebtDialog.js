import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import PaymentForm from "../payment/PaymentForm";
import ShowPaymentForm from "../payment/ShowPaymentForm";
import DescriptionDialog from "../DescriptiptionDialog";

const MemberDebtDialog = ({ open, member, onClose }) => {
  console.log("member", member);
  const [debts, setDebts] = useState([]);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [showPaymentDialogVisible, setShowPaymentDialogVisible] =
    useState(false);
  const [descriptionDialogVisible, setDescriptionDialogVisible] =
    useState(false);
  useEffect(() => {
    const getDebts = async () => {
      try {
        const response = await axios.get(
          `https://active-surf-api.onrender.com/api/debt/getDebtsForMember/${member._id}`
        );
        setDebts(response.data.debts);
      } catch (error) {
        alert(error.response.data.error);
        console.error("Error getting debts:", error);
      }
    };

    if (member) {
      getDebts();
    }
  }, [member]);

  const handleDeleteDebt = async (debt) => {
    try {
      await axios.delete(
        `https://active-surf-api.onrender.com/api/debt/deleteDebt/${debt._id}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting debt:", error);
      alert(error.response.data.error);
    }
  };
  const handlePayment = (debt) => {
    setSelectedDebt(debt);
    setPaymentDialogVisible(true);
  };
  const handleShowPayment = (debt) => {
    setSelectedDebt(debt);
    setShowPaymentDialogVisible(true);
  };
  const handleAddDescription = (debt) => {
    setSelectedDebt(debt);
    setDescriptionDialogVisible(true);
  };
  return (
    <div>
      {descriptionDialogVisible && (
        <DescriptionDialog
          service={selectedDebt}
          onClose={() => setDescriptionDialogVisible(false)}
        />
      )}
      {paymentDialogVisible && (
        <PaymentForm
          member={member}
          service={selectedDebt}
          onClose={() => setPaymentDialogVisible(false)}
        />
      )}
      {showPaymentDialogVisible && (
        <ShowPaymentForm
          service={selectedDebt}
          member={member}
          onClose={() => setShowPaymentDialogVisible(false)}
        />
      )}
      <h2>Borç Detayları</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Tutar</TableCell>
              <TableCell>Kalan Tutar</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Not</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.map((debt, index) => (
              <TableRow key={index}>
                <TableCell>{debt.productName}</TableCell>
                <TableCell>{debt.price}</TableCell>

                <TableCell>{debt.remainingPrice}</TableCell>
                <TableCell>
                  {new Date(debt.debtDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{debt.description}</TableCell>
                <TableCell>
                  {!debt.isPaid && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePayment(debt)}
                    >
                      Ödeme Yap
                    </Button>
                  )}
                  {debt.remainingPrice !== debt.price && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleShowPayment(debt)}
                    >
                      Ödemeler
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteDebt(debt)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAddDescription(debt)}
                  >
                    Not Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MemberDebtDialog;
