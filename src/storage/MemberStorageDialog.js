import React, { useState, useEffect } from "react";
import {
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

const MemberStorageDialog = ({ open, member, onClose }) => {
  const [storages, setStorages] = useState([]);
  const [showPaymentDialogVisible, setShowPaymentDialogVisible] =
    useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [descriptionDialogVisible, setDescriptionDialogVisible] =
    useState(false);
  useEffect(() => {
    const getStorages = async () => {
      try {
        const response = await axios.get(
          `https://active-surf-api.onrender.com/api/storage/getStoragesForMember/${member._id}`
        );

        setStorages(response.data.storages);
      } catch (error) {
        alert(error.response.data.error);
        console.error("Error getting storages:", error);
      }
    };

    if (member) {
      getStorages();
    }
  }, [member]);
  const handlePayment = async (storage) => {
    setSelectedStorage(storage);
    setPaymentDialogVisible(true);
  };
  const handleShowPayment = (storage) => {
    setSelectedStorage(storage);
    setShowPaymentDialogVisible(true);
  };
  const handleAddDescription = (storage) => {
    setSelectedStorage(storage);
    setDescriptionDialogVisible(true);
  };
  const handleDelete = async (storage) => {
    try {
      await axios.delete(
        `https://active-surf-api.onrender.com/api/storage/deleteStorage/${storage._id}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting storage:", error);
      alert(error.response.data.error);
    }
  };

  return (
    <div>
      {paymentDialogVisible && (
        <PaymentForm
          member={member}
          service={selectedStorage}
          onClose={() => setPaymentDialogVisible(false)}
        />
      )}
      {showPaymentDialogVisible && (
        <ShowPaymentForm
          member={member}
          service={selectedStorage}
          onClose={() => setShowPaymentDialogVisible(false)}
        />
      )}
      {descriptionDialogVisible && (
        <DescriptionDialog
          service={selectedStorage}
          onClose={() => setDescriptionDialogVisible(false)}
        />
      )}
      <h2>Depolama Detayları</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün</TableCell>
              <TableCell>Depolanan Yer</TableCell>
              <TableCell>Başlangıç Tarihi</TableCell>
              <TableCell>Bitiş Tarihi</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Kalan Fiyat</TableCell>
              <TableCell>Not</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storages?.map((storage, index) => (
              <TableRow key={index}>
                <TableCell>{storage.item}</TableCell>
                <TableCell>{storage.storedPlace}</TableCell>
                <TableCell>
                  {new Date(storage.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(storage.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{storage.price}</TableCell>
                <TableCell>{storage.remainingPrice}</TableCell>
                <TableCell>{storage.description}</TableCell>
                <TableCell>
                  {storage.remainingPrice !== storage.price && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleShowPayment(storage)}
                    >
                      Ödemeler
                    </Button>
                  )}
                  {!storage.isPaid && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePayment(storage)}
                    >
                      Ödeme Yap
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(storage)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAddDescription(storage)}
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

export default MemberStorageDialog;
