import { styled, css } from "@mui/system";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const SaveMember = ({ onClose, memberToSave }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [name, setName] = useState(memberToSave?.name || "");
  const [tc, setTc] = useState(memberToSave?.tc || "");
  const [phoneNumber, setPhoneNumber] = useState(
    memberToSave?.phoneNumber || ""
  );
  const [email, setEmail] = useState(memberToSave?.email || "");
  const [address, setAddress] = useState(memberToSave?.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    memberToSave?.dateOfBirth || ""
  );
  const [accountTypes, setAccountTypes] = useState(
    memberToSave?.accountTypes || []
  );

  async function submitMember() {
    if (!token) {
      navigate("/");
      return;
    }
    try {
      if (!name || !phoneNumber || !email || !address || !dateOfBirth) {
        alert("Lütfen tüm alanları doldurunuz.");
        return;
      }
      if (tc && (tc < 10000000000 || tc > 99999999999)) {
        alert("Geçerli bir TC kimlik numarası giriniz.");
        return;
      }
      await axios.post(
        "https://active-surf-api.onrender.com/api/member/saveMember",
        {
          ...memberToSave,
          id: memberToSave?._id,
          name,
          tc,
          phoneNumber,
          dateOfBirth,
          email,
          address,
          accountTypes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving member:", error);
      alert(error.response.data.error);
    }
  }

  return (
    <ModalContent>
      <div
        style={{
          minWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          label="İsim"
          fullWidth
          margin="normal"
          value={name}
          disabled={memberToSave}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="TC"
          fullWidth
          type="number"
          onWheel={() => document.activeElement.blur()}
          margin="normal"
          value={tc}
          onChange={(e) => setTc(e.target.value)}
        />

        <TextField
          label="Telefon Numarası"
          fullWidth
          margin="normal"
          type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          onWheel={() => document.activeElement.blur()}
        />
        <TextField
          label="E-posta Adresi"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Doğum Tarihi"
          type="date"
          fullWidth
          margin="normal"
          value={
            dateOfBirth ? new Date(dateOfBirth).toISOString().split("T")[0] : ""
          }
          onChange={(e) => setDateOfBirth(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Adres"
          fullWidth
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div>
          <p>Hesap Türleri:</p>
          <div>
            <label>
              <input
                type="checkbox"
                checked={accountTypes.includes("rent")}
                onChange={(e) =>
                  setAccountTypes((prev) =>
                    e.target.checked
                      ? [...prev, "rent"]
                      : prev.filter((type) => type !== "rent")
                  )
                }
              />
              Kiralama
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={accountTypes.includes("camp")}
                onChange={(e) =>
                  setAccountTypes((prev) =>
                    e.target.checked
                      ? [...prev, "camp"]
                      : prev.filter((type) => type !== "camp")
                  )
                }
              />
              Kamp
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={accountTypes.includes("lesson")}
                onChange={(e) =>
                  setAccountTypes((prev) =>
                    e.target.checked
                      ? [...prev, "lesson"]
                      : prev.filter((type) => type !== "lesson")
                  )
                }
              />
              Ders
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={accountTypes.includes("storage")}
                onChange={(e) =>
                  setAccountTypes((prev) =>
                    e.target.checked
                      ? [...prev, "storage"]
                      : prev.filter((type) => type !== "storage")
                  )
                }
              />
              Depolama
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={submitMember}
          >
            Kaydet
          </Button>
          <Button variant="outlined" onClick={onClose}>
            İptal
          </Button>
        </div>
      </div>
    </ModalContent>
  );
};

export default SaveMember;
export const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

export const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);
