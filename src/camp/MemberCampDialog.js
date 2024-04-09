import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import LessonDateForm from "../lesson/LessonDateForm";
import LessonDates from "../lesson/LessonDates";
import ShowPaymentForm from "../payment/ShowPaymentForm";
import DescriptionDialog from "../DescriptiptionDialog";
import PriceDialog from "../PriceDialog";

const MemberCampDialog = ({ open, member, onClose }) => {
  const [camps, setCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [showPaymentDialogVisible, setShowPaymentDialogVisible] =
    useState(false);
  const [campDatesVisible, setCampDatesVisible] = useState(false);
  const [campDateDialogVisible, setCampDateDialogVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [descriptionDialogVisible, setDescriptionDialogVisible] =
    useState(false);
  const [priceDialogVisible, setPriceDialogVisible] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "https://active-surf-api.onrender.com/api/teacher/getAllTeachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeachers(response.data);
      } catch (error) {
        console.error(error);
        console.error("Öğretmenler veri tabanından çekilemedi");
      }
    };
    const fetchLessons = async () => {
      try {
        const response = await axios.get(
          `https://active-surf-api.onrender.com/api/camp/getCampsForMember/${member._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCamps(response.data.camps);
      } catch (error) {
        console.error("Kamplar veri tabanından çekilemedi");
        console.error(error);
      }
    };
    if (member) {
      fetchTeachers();
      fetchLessons();
    }
  }, []);

  const handlePayment = async (camp) => {
    setSelectedCamp(camp);
    setPaymentDialogVisible(true);
  };
  const handleShowPayment = (camp) => {
    setSelectedCamp(camp);
    setShowPaymentDialogVisible(true);
  };
  const handleDelete = async (campId) => {
    try {
      await axios.delete(
        `https://active-surf-api.onrender.com/api/camp/deleteCamp/${campId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Kamp silinirken hata oluştu.", error);
      alert(error.response.data.error);
    }
  };
  const addCampDate = (camp) => {
    setSelectedCamp(camp);
    setCampDateDialogVisible(true);
  };
  const showCampDates = (camp) => {
    setSelectedCamp(camp);
    setCampDatesVisible(true);
  };
  const handleAddDescription = (camp) => {
    setSelectedCamp(camp);
    setDescriptionDialogVisible(true);
  };
  const handleChangePrice = (camp) => {
    setSelectedCamp(camp);
    setPriceDialogVisible(true);
  };
  const handleTableRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };
  return (
    <div>
      {priceDialogVisible && (
        <PriceDialog
          service={selectedCamp}
          onClose={() => setPriceDialogVisible(false)}
        />
      )}
      {descriptionDialogVisible && (
        <DescriptionDialog
          service={selectedCamp}
          onClose={() => setDescriptionDialogVisible(false)}
        />
      )}
      {paymentDialogVisible && (
        <PaymentForm
          member={member}
          service={selectedCamp}
          onClose={() => setPaymentDialogVisible(false)}
        />
      )}
      {showPaymentDialogVisible && (
        <ShowPaymentForm
          member={member}
          service={selectedCamp}
          onClose={() => setShowPaymentDialogVisible(false)}
        />
      )}
      {campDateDialogVisible && (
        <LessonDateForm
          lesson={selectedCamp}
          onClose={() => setCampDateDialogVisible(false)}
        />
      )}
      {campDatesVisible && (
        <LessonDates
          lesson={selectedCamp}
          onClose={() => setCampDatesVisible(false)}
        />
      )}
      <h2>Kamp Detayları</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kamp Tipi</TableCell>
              <TableCell>Kamp Hafta Sayısı</TableCell>
              <TableCell>Kamp Gün Sayısı</TableCell>
              <TableCell>Kamp Toplam Gün</TableCell>
              <TableCell>Kamp Kalan Gün</TableCell>
              <TableCell>Ücret</TableCell>
              <TableCell>Kalan Ücret</TableCell>
              <TableCell>Öğretmen</TableCell>
              <TableCell>Başlangıç Tarihi</TableCell>
              <TableCell>Bitiş Tarihi</TableCell>
              <TableCell>Not</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {camps?.map((camp, index) => (
              <TableRow
                key={index}
                onClick={() => handleTableRowClick(index)}
                selected={selectedRow === index}
                hover
              >
                <TableCell>
                  <p>
                    {camp.campType === "beginner1"
                      ? "Beginner 1"
                      : camp.campType === "beginner2"
                      ? "Beginner 2"
                      : "Advanced"}
                  </p>
                </TableCell>
                <TableCell>{camp.campAmountWeek}</TableCell>
                <TableCell>{camp.campAmountDay}</TableCell>
                <TableCell>
                  {Number(camp.campAmountWeek) * Number(camp.campAmountDay)}
                </TableCell>
                <TableCell>{camp.remainingCampAmount}</TableCell>
                <TableCell>{camp.price}</TableCell>
                <TableCell>{camp.remainingPrice}</TableCell>
                <TableCell>
                  <p>
                    {
                      teachers.find((teacher) => {
                        return teacher._id === camp.teacherId;
                      })?.name
                    }
                  </p>
                </TableCell>

                <TableCell>
                  {new Date(camp.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(camp.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ whiteSpace: "pre-line" }}>
                  {camp.description}
                </TableCell>
                <TableCell>
                  {!camp.isPaid && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePayment(camp)}
                    >
                      Ödeme Yap
                    </Button>
                  )}
                  {camp.remainingPrice !== camp.price && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleShowPayment(camp)}
                    >
                      Ödemeler
                    </Button>
                  )}
                  {camp.remainingCampAmount > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => addCampDate(camp)}
                    >
                      Ders Tamamlama
                    </Button>
                  )}
                  {camp.campDates.length > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => showCampDates(camp)}
                    >
                      Tamamlanan Dersler
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(camp._id)}
                  >
                    Sil
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAddDescription(camp)}
                  >
                    Not Düzenle
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleChangePrice(camp)}
                  >
                    Fiyat Hüncelle
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

export default MemberCampDialog;
