import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import pdf from "../assets/pdf.jpg";
import docx from "../assets/docx.png";
import video from "../assets/video.png";

const WorkshopInformation = () => {
  return (
    <>
      <Navbar />

      <div className="Block Width--90 Margin-right--40 Margin-left--40 Margin-top--40 Height--100vh">
        <div className="Flex-row--subtitle">
          <div className="Text--underline Text-fontSize--20 Padding-bottom--8 Margin-right--32 Text-color--teal-1000">
            Workshop Information
          </div>
          <div className="Button Border-radius--4 Text-fontSize--12 Button-color--teal-1000">
            Add New Files
          </div>
        </div>
        <div className="Flex-grid Margin-right--30 Margin-left--30">
          <div className="Course--card Card-hover">
            <img src={pdf} style={{ width: "50%", height: "50%" }} />
            <div>
              <h3 className="Text-fontSize--16 Text-color--gray-800">
                Resume_Prep.pdf
              </h3>
            </div>
          </div>

          <div className="Course--card Card-hover">
            <img src={docx} style={{ width: "50%", height: "50%" }} />
            <div>
              <h3 className="Text-fontSize--16 Text-color--gray-800">
                Resume_Template.docx
              </h3>
            </div>
          </div>

          <div className="Course--card Card-hover">
            <img src={video} style={{ width: "50%", height: "50%" }} />

            <div>
              <h3 className="Text-fontSize--16 Text-color--gray-800">
                Resume_Prep.mp4
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkshopInformation;
