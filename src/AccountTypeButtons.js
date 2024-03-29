import React, { useState } from "react";
import { Button, IconButton, Modal } from "@mui/material";
import MemberRentDialog from "./rent/MemberRentDialog";
import MemberLessonDialog from "./lesson/MemberLessonDialog";
import MemberStorageDialog from "./storage/MemberStorageDialog";
import SaveLessonDialog from "./lesson/SaveLessonDialog";
import SaveStorageDialog from "./storage/SaveStorageDialog";
import SaveRentDialog from "./rent/SaveRentDialog";
import CloseIcon from "@mui/icons-material/Close";
import { ModalContent } from "./member/SaveMember";
import SaveCampDialog from "./camp/SaveCampDialog";
import MemberCampDialog from "./camp/MemberCampDialog";

const AccountTypeButtons = ({ member }) => {
  const [openRentModal, setOpenRentModal] = useState(false);
  const [openLessonModal, setOpenLessonModal] = useState(false);
  const [openStorageModal, setOpenStorageModal] = useState(false);
  const [openCampModal, setOpenCampModal] = useState(false);
  const [openSaveCampModal, setSaveOpenCampModal] = useState(false);
  const [openSaveRentModal, setSaveOpenRentModal] = useState(false);
  const [openSaveLessonModal, setSaveOpenLessonModal] = useState(false);
  const [openSaveStorageModal, setSaveOpenStorageModal] = useState(false);
  const handleRentClick = () => {
    setOpenRentModal(true);
    setSaveOpenRentModal(true);
  };

  const handleLessonClick = () => {
    setOpenLessonModal(true);
    setSaveOpenLessonModal(true);
  };

  const handleStorageClick = () => {
    setOpenStorageModal(true);
    setSaveOpenStorageModal(true);
  };
  const handleCampClick = () => {
    setOpenCampModal(true);
    setSaveOpenCampModal(true);
  };

  return (
    <div>
      {member.accountTypes.includes("rent") && (
        <Button variant="outlined" color="primary" onClick={handleRentClick}>
          Kiralama
        </Button>
      )}
      {member.accountTypes.includes("lesson") && (
        <Button variant="outlined" color="primary" onClick={handleLessonClick}>
          Ders
        </Button>
      )}
      {member.accountTypes.includes("storage") && (
        <Button variant="outlined" color="primary" onClick={handleStorageClick}>
          Depolama
        </Button>
      )}
      {member.accountTypes.includes("camp") && (
        <Button variant="outlined" color="primary" onClick={handleCampClick}>
          Kamp
        </Button>
      )}
      {openRentModal && (
        <Modal open={openRentModal} onClose={() => setOpenRentModal(false)}>
          <ModalContent>
            <IconButton
              style={{ position: "absolute", right: 0 }}
              onClick={() => setOpenRentModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <MemberRentDialog
              open={openRentModal}
              onClose={() => setOpenRentModal(false)}
              member={member}
            />
          </ModalContent>
        </Modal>
      )}
      {openLessonModal && (
        <Modal open={openLessonModal} onClose={() => setOpenLessonModal(false)}>
          <ModalContent>
            <IconButton
              style={{ position: "absolute", right: 0 }}
              onClick={() => setOpenLessonModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <MemberLessonDialog
              open={openLessonModal}
              onClose={() => setOpenLessonModal(false)}
              member={member}
            />
          </ModalContent>
        </Modal>
      )}
      {openStorageModal && (
        <Modal
          open={openStorageModal}
          onClose={() => setOpenStorageModal(false)}
        >
          <ModalContent>
            <IconButton
              style={{ position: "absolute", right: 0 }}
              onClick={() => setOpenStorageModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <MemberStorageDialog
              open={openStorageModal}
              onClose={() => setOpenStorageModal(false)}
              member={member}
            />
          </ModalContent>
        </Modal>
      )}
      {openCampModal && (
        <Modal open={openCampModal} onClose={() => setOpenCampModal(false)}>
          <ModalContent>
            <IconButton
              style={{ position: "absolute", right: 0 }}
              onClick={() => setOpenCampModal(false)}
            >
              <CloseIcon />
            </IconButton>
            <MemberCampDialog
              open={openStorageModal}
              onClose={() => setOpenCampModal(false)}
              member={member}
            />
          </ModalContent>
        </Modal>
      )}
      {openSaveCampModal && (
        <SaveCampDialog
          open={openSaveCampModal}
          onClose={() => setSaveOpenCampModal(false)}
          member={member}
        />
      )}
      {openSaveRentModal && (
        <SaveRentDialog
          open={openSaveRentModal}
          onClose={() => setSaveOpenRentModal(false)}
          member={member}
        />
      )}

      {openSaveLessonModal && (
        <SaveLessonDialog
          open={openSaveLessonModal}
          onClose={() => setSaveOpenLessonModal(false)}
          member={member}
        />
      )}

      {openSaveStorageModal && (
        <SaveStorageDialog
          open={openSaveStorageModal}
          onClose={() => setSaveOpenStorageModal(false)}
          member={member}
        />
      )}
    </div>
  );
};

export default AccountTypeButtons;
