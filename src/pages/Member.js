import { useEffect, useState } from "react";
import axios from "axios";
import MemberDebtDialog from "../debt/MemberDebtDialog";
import MemberLessonDialog from "../lesson/MemberLessonDialog";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MemberStorageDialog from "../storage/MemberStorageDialog";
import MemberRentDialog from "../rent/MemberRentDialog";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MemberCampDialog from "../camp/MemberCampDialog";
const theme = createTheme({
  zIndex: {
    dialog: 1300,
  },
});
export default function Member() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }
  const id = window.location.pathname.split("/").pop();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(
          `https://active-surf-api.onrender.com/api/member/getMember/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMember(response.data.member);
      } catch (error) {
        console.error("Error getting member:", error.response.data.error);
        alert("Üye bilgileri çekilirken hata oluştu.");
      }
    };
    fetchMember();
  }, [id]);

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/dashboard")}
        style={{ position: "absolute", right: 30, top: 30 }}
      >
        Anasayfaya Dön
      </Button>
      <MemberDebtDialog open={true} member={member} onClose={() => {}} />
      <MemberLessonDialog open={true} member={member} onClose={() => {}} />
      <MemberStorageDialog open={true} member={member} onClose={() => {}} />
      <MemberRentDialog open={true} member={member} onClose={() => {}} />
      <MemberCampDialog open={true} member={member} onClose={() => {}} />
    </ThemeProvider>
  );
}
