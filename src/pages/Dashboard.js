// Frontend
import React, { useState, useEffect } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";

import AccountTypeButtons from "../AccountTypeButtons";
import DeleteMember from "../member/DeleteMember";
import SaveTeacher from "../teacher/SaveTeacher";
import SaveDebtDialog from "../debt/SaveDebtDialog";
import MemberDebtDialog from "../debt/MemberDebtDialog";
import SaveMember, { ModalContent } from "../member/SaveMember";
import SaveExpense from "../SaveExpense";

const Dashboard = () => {
  const [saveMemberComponentVisible, setSaveMemberComponentVisible] =
    useState(false);
  const [saveTeacherComponentVisible, setSaveTeacherComponentVisible] =
    useState(false);
  const [saveExpenseComponentVisible, setSaveExpenseComponentVisible] =
    useState(false);
  const [deleteMemberComponentVisible, setDeleteMemberComponentVisible] =
    useState(false);
  const [addDebtDialogVisible, setAddDebtDialogVisible] = useState(false);
  const navigate = useNavigate();
  const [memberToSave, setMemberToSave] = useState(null);
  const [memberToAddDebt, setMemberToAddDebt] = useState(null);
  const [members, setMembers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // Arama terimi state'i
  const [sortBy, setSortBy] = useState(null); // Sıralama durumu state'i

  const [sortOrder, setSortOrder] = useState("asc"); // Sıralama sırası state'i
  useEffect(() => {
    // axios
    //   .get("https://active-surf-api.onrender.com/api/getme")
    //   .then((response) => {
    //     console.log("GETME", response);
    //     if (response.data.success === true) {
    //       setProfile(response.data.user);
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response.status === 401) {
    //       console.error("User not authenticated:", error);
    //       navigate("/");
    //     } else {
    //       console.error("Error fetching profile:", error);
    //       // Diğer hataları burada işleyebilirsiniz
    //     }
    //   });
    axios
      .get("https://active-surf-api.onrender.com/api/member/getAllMembers")
      .then((response) => {
        const updatedMembers = response.data.members.map((member) => ({
          ...member,
        }));
        setMembers(updatedMembers);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        alert("Üyeler getirilirken hata oluştu", error.response.data.error);
      });
  }, []);

  const handleClose = () => {
    setSaveMemberComponentVisible(false);
    setDeleteMemberComponentVisible(false);
    setAddDebtDialogVisible(false);
    setMemberToSave(null);
    setMemberToDelete(null);
    setSearchTerm("");
    setSaveTeacherComponentVisible(false);
    setSaveExpenseComponentVisible(false);
  };
  const handleLogout = async () => {
    await axios.get("https://active-surf-api.onrender.com/api/logout");
    navigate("/");
  };

  const handleSaveMember = (member) => {
    setMemberToSave(member);
    setSaveMemberComponentVisible(true);
  };
  const handleSaveTeacher = () => {
    setSaveTeacherComponentVisible(true);
  };
  const handleSaveExpense = () => {
    setSaveExpenseComponentVisible(true);
  };
  const [debtDialogVisible, setDebtDialogVisible] = useState(false);

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    setDeleteMemberComponentVisible(true);
  };

  const handleAddDebt = (member) => {
    setMemberToAddDebt(member);
    setAddDebtDialogVisible(true);
    setDebtDialogVisible(true);
  };

  // Tablodaki üyeleri filtrelemek için bir fonksiyon
  const filteredMembers = members.filter((member) => {
    return member.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  function goToTeacherPage() {
    navigate("/teachers");
  }
  function goToReportPage() {
    navigate("/report");
  }
  function goToCampPage() {
    navigate("/camp");
  }
  function goToExpensesPage() {
    navigate("/expenses");
  }
  function goToLessonPage() {
    navigate("/lesson");
  }
  function goToRentPage() {
    navigate("/rent");
  }
  function goToDebtPage() {
    navigate("/debt");
  }
  function goToStoragePage() {
    navigate("/storage");
  }
  // Tablodaki üyeleri sıralamak için bir fonksiyon
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (!sortBy) return 0; // Sıralama yoksa, orijinal sırayı koru
    if (sortOrder === "asc") {
      if (sortBy === "name") {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      }
    } else {
      if (sortBy === "name") {
        return b[sortBy].localeCompare(a[sortBy]);
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    }
  });
  function showMemberDetailsHandler(member) {
    navigate(`/member/${member._id}`);
  }
  const fetchDebtors = async () => {
    try {
      const response = await axios.get(
        "https://active-surf-api.onrender.com/api/member/getDebtors"
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching debtors:", error.response.data.error);
    }
  };
  return profile ? (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <h1>Üyeler</h1>

          <TextField
            label="İsim Ara"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => {
                        setSortBy("name");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      İsim
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="text">Alınan Hizmetler</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="text"> </Button>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell onClick={() => showMemberDetailsHandler(member)}>
                      <Link style={{ textDecoration: "none" }}>
                        {member.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <AccountTypeButtons member={member} />
                    </TableCell>
                    <TableCell>{member.debt}</TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteMember(member)}
                      >
                        Sil
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleSaveMember(member)}
                      >
                        Üye bilgilerini düzenle
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleAddDebt(member)}
                      >
                        Borç Ekle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={3} ys={10}>
          <div
            style={{
              flexDirection: "column",
              marginTop: "50px",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => handleSaveMember(null)}
            >
              Üye Ekle
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => handleSaveTeacher(null)}
            >
              Hoca Ekle
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={fetchDebtors}
            >
              Borçluları Gör
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToTeacherPage(null)}
            >
              Hocaları Gör
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToReportPage(null)}
            >
              Gelir Raporu Al
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToLessonPage(null)}
            >
              Dersler
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToCampPage(null)}
            >
              Kamplar
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToRentPage(null)}
            >
              Kiralamalar
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToDebtPage(null)}
            >
              Borçlar
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToStoragePage(null)}
            >
              Depolamalar
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => goToExpensesPage(null)}
            >
              Gider Raporu Al
            </Button>
            <Button
              style={{
                display: "flex",
                marginBottom: "15px",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={() => handleSaveExpense()}
            >
              Gider Ekle
            </Button>

            <Button
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Çıkış Yap
            </Button>
          </div>
        </Grid>
      </Grid>
      {saveTeacherComponentVisible && (
        <Modal
          open={saveTeacherComponentVisible}
          onClose={handleClose}
          closeAfterTransition
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SaveTeacher onClose={handleClose} />
        </Modal>
      )}
      {saveExpenseComponentVisible && (
        <Modal
          open={saveExpenseComponentVisible}
          onClose={handleClose}
          closeAfterTransition
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SaveExpense onClose={handleClose} />
        </Modal>
      )}
      {saveMemberComponentVisible && (
        <Modal
          open={saveMemberComponentVisible}
          onClose={handleClose}
          closeAfterTransition
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SaveMember onClose={handleClose} memberToSave={memberToSave} />
        </Modal>
      )}
      {deleteMemberComponentVisible && (
        <Modal
          open={deleteMemberComponentVisible}
          onClose={handleClose}
          closeAfterTransition
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DeleteMember onClose={handleClose} memberToDelete={memberToDelete} />
        </Modal>
      )}
      {debtDialogVisible && (
        <Modal
          open={debtDialogVisible}
          onClose={() => setDebtDialogVisible(false)}
        >
          <ModalContent>
            <IconButton
              style={{ position: "absolute", right: 0 }}
              onClick={() => setDebtDialogVisible(false)}
            >
              <CloseIcon />
            </IconButton>
            <MemberDebtDialog
              open={debtDialogVisible}
              onClose={() => setDebtDialogVisible(false)}
              member={memberToAddDebt}
            />
          </ModalContent>
        </Modal>
      )}

      {addDebtDialogVisible && (
        <SaveDebtDialog
          open={addDebtDialogVisible}
          onClose={handleClose}
          member={memberToAddDebt}
        />
      )}
    </Container>
  ) : (
    <div>loading</div>
  );
};

export default Dashboard;
