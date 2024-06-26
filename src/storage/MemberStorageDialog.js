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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentForm from "../payment/PaymentForm";
import ShowPaymentForm from "../payment/ShowPaymentForm";
import DescriptionDialog from "../DescriptiptionDialog";
import PriceDialog from "../PriceDialog";

const MemberStorageDialog = ({ open, member, onClose }) => {
  const [storages, setStorages] = useState([]);
  const [showPaymentDialogVisible, setShowPaymentDialogVisible] =
    useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [descriptionDialogVisible, setDescriptionDialogVisible] =
    useState(false);
  const [priceDialogVisible, setPriceDialogVisible] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    const getStorages = async () => {
      try {
        const response = await axios.get(
          `https://active-surf-api.onrender.com/api/storage/getStoragesForMember/${member._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  const handleChangePrice = (storage) => {
    setSelectedStorage(storage);
    setPriceDialogVisible(true);
  };
  const handleDelete = async (storage) => {
    try {
      await axios.delete(
        `https://active-surf-api.onrender.com/api/storage/deleteStorage/${storage._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      {priceDialogVisible && (
        <PriceDialog
          service={selectedStorage}
          onClose={() => setPriceDialogVisible(false)}
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
                <TableCell style={{ whiteSpace: "pre-line" }}>
                  {storage.description}
                </TableCell>
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
                    onClick={() => handleChangePrice(storage)}
                  >
                    Fiyat Düzenle
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
