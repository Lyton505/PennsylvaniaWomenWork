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
        <div className="Flex-row Justify-content--spaceBetween Margin-bottom--30 Margin-right--20">
          <div className="Text--underline Text-fontSize--20 Padding-bottom--8 Margin-right--32 Text-color--teal-1000">
            Workshop Information
          </div>
          <div className="Button Border-radius--4 Text-fontSize--12 Button-color--teal-1000 Margin-bottom--16">
            Add New Files
          </div>
        </div>
        <div className="Flex-grid Margin-bottom--40">
          <div
            className="Card Card--noPadding Card-hover Margin-right--20"
            style={{
              width: "230px",
              height: "230px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={pdf} style={{ width: "50%", height: "50%" }} />

            <div
              className="Padding--10"
              style={{ height: "75px", textAlign: "center" }}
            >
              <h3 className="Text-fontSize--16 Text-color--gray-800">
                Resume_Prep.pdf
              </h3>
            </div>
          </div>
            
          <div
            className="Card Card--noPadding Card-hover Margin-right--20"
            style={{
              width: "230px",
              height: "230px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={docx} style={{ width: "50%", height: "50%" }} />

            <div
              className="Padding--10"
              style={{ height: "75px", textAlign: "center" }}
            >
              <h3 className="Text-fontSize--16 Text-color--gray-800">
                Resume_Template.docx
              </h3>
            </div>
          </div>

          <div
            className="Card Card--noPadding Card-hover Margin-right--20"
            style={{
              width: "230px",
              height: "230px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={video} style={{ width: "50%", height: "50%" }} />

            <div
              className="Padding--10"
              style={{ height: "75px", textAlign: "center" }}
            >
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
