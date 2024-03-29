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
import { ModalContent } from "../member/SaveMember";
import axios from "axios";
import PaymentForm from "../payment/PaymentForm";
import ShowPaymentForm from "../payment/ShowPaymentForm";
import DescriptionDialog from "../DescriptiptionDialog";
import LessonDates from "../lesson/LessonDates";
import LessonDateForm from "../lesson/LessonDateForm";

const MemberRentDialog = ({ open, member, onClose }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rentDatesVisible, setRentDatesVisible] = useState(false);
  const [rentDateDialogVisible, setRentDateDialogVisible] = useState(false);
  const [rents, setRents] = useState([]);
  const [selectedRent, setSelectedRent] = useState(null);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [showPaymentDialogVisible, setShowPaymentDialogVisible] =
    useState(false);
  const [descriptionDialogVisible, setDescriptionDialogVisible] =
    useState(false);
  useEffect(() => {
    const getRents = async () => {
      try {
        const response = await axios.get(
          `https://active-surf-api.onrender.com/api/rent/getRentsForMember/${member._id}`
        );

        setRents(response.data.rents);
      } catch (error) {
        console.error("Error getting debts:", error);
        alert(error.response.data.error);
      }
    };

    if (member) {
      getRents();
    }
  }, [member]);
  const handlePayment = async (rent) => {
    setSelectedRent(rent);
    setPaymentDialogVisible(true);
  };
  const handleDelete = async (rent) => {
    try {
      await axios.delete(
        `https://active-surf-api.onrender.com/api/rent/deleteRent/${rent._id}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting rent:", error);
      alert(error.response.data.error);
    }
  };

  const handleTableRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };
  const handleAddDescription = (rent) => {
    setSelectedRent(rent);
    setDescriptionDialogVisible(true);
  };
  const handleShowPayment = (rent) => {
    setSelectedRent(rent);
    setShowPaymentDialogVisible(true);
  };
  const showRentDates = (rent) => {
    setSelectedRent(rent);
    setRentDatesVisible(true);
  };
  const addRentDate = (rent) => {
    setSelectedRent(rent);
    setRentDateDialogVisible(true);
  };
  return (
    <div>
      {rentDateDialogVisible && (
        <LessonDateForm
          lesson={selectedRent}
          onClose={() => setRentDateDialogVisible(false)}
        />
      )}
      {rentDatesVisible && (
        <LessonDates
          lesson={selectedRent}
          onClose={() => setRentDatesVisible(false)}
        />
      )}
      {paymentDialogVisible && (
        <PaymentForm
          member={member}
          service={selectedRent}
          onClose={() => setPaymentDialogVisible(false)}
        />
      )}
      {descriptionDialogVisible && (
        <DescriptionDialog
          service={selectedRent}
          onClose={() => setDescriptionDialogVisible(false)}
        />
      )}
      {showPaymentDialogVisible && (
        <ShowPaymentForm
          member={member}
          service={selectedRent}
          onClose={() => setShowPaymentDialogVisible(false)}
        />
      )}
      <h2>Kiralama Detayları</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              <TableCell>Başlangıç Tarihi</TableCell>
              <TableCell>Bitiş Tarihi</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Kalan Fiyat</TableCell>
              <TableCell>Not</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rents?.map((rent, index) => (
              <TableRow
                key={index}
                onClick={() => handleTableRowClick(index)}
                selected={selectedRow === index}
                hover
              >
                <TableCell>{rent.item}</TableCell>
                <TableCell>
                  {new Date(rent.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(rent.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{rent.price}</TableCell>
                <TableCell>{rent.remainingPrice}</TableCell>
                <TableCell>{rent.description}</TableCell>
                <TableCell>
                  {rent.remainingPrice !== rent.price && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleShowPayment(rent)}
                    >
                      Ödemeler
                    </Button>
                  )}
                  {rent.rentDates.length > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => showRentDates(rent)}
                    >
                      Kiralama Tarihleri
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => addRentDate(rent)}
                  >
                    Kiralama Tarihi Ekle
                  </Button>
                  {!rent.isPaid && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePayment(rent)}
                    >
                      Ödeme Yap
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(rent)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAddDescription(rent)}
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

export default MemberRentDialog;
