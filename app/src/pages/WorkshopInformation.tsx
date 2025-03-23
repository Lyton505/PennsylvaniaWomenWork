import React from "react";
import Navbar from "../components/Navbar";
import pdf from "../assets/pdf.jpg";
import docx from "../assets/docx.png";
import video from "../assets/video.png";
import Icon from "../components/Icon";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

// 🔹 Define Fake Data
const fakeFiles = [
  {
    id: 1,
    name: "Resume_Prep.pdf",
    type: "pdf",
    icon: pdf,
  },
  {
    id: 2,
    name: "Workshop_Intro.mp4",
    type: "video",
    icon: video,
  },
  {
    id: 3,
    name: "Cover_Letter.docx",
    type: "docx",
    icon: docx,
  },
];

interface Workshop {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  createdAt: string;
  mentor: string;
  mentee: string;
}

const WorkshopInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workshopId = location.state?.workshopId;
  const [workshop, setWorkshop] = React.useState<Workshop | null>(null);

  // get workshop information by id
  const getWorkshop = async () => {
    try {
      const response = await api.get(`/api/workshop/${workshopId}`);
      console.log("Workshop:", response.data);
      setWorkshop(response.data);
    } catch (error) {
      console.error("Error getting workshop:", error);
    }
  };

  React.useEffect(() => {
    getWorkshop();
  }, []);

  return (
    <>
      <Navbar />
      <div className="WorkshopInfo">
        <div className="Block">
          <div onClick={() => navigate("/home")} className=" Margin-bottom--10">
            <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
          </div>
          <div className="Block-header Flex-row">
            {workshop?.name}
            <div className="Button Button-color--blue-1000 Margin-left--auto">
              Add New Files
            </div>
          </div>
          <div className="Block-subtitle">{workshop?.description}</div>

          <div className="row gx-3 gy-3">
            {fakeFiles.map((file) => (
              <div key={file.id} className="col-lg-2">
                <div className="Card">
                  {" "}
                  {/* Ensure Card is inside col-lg-2 */}
                  <div className="WorkshopInfo-image">
                    <img src={file.icon} alt={file.type} />
                  </div>
                  <div className="WorkshopInfo-title">{file.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkshopInformation;
