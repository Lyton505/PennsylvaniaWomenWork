import React from "react"
import Navbar from "../components/Navbar"
import pdf from "../assets/pdf.jpg"
import docx from "../assets/docx.png"
import video from "../assets/video.png"

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
]

const WorkshopInformation = () => {
  return (
    <>
      <Navbar />
      <div className="WorkshopInfo">
        <div className="Block">
          <div className="Block-header Flex-row">
            Workshop Information
            <div className="Button Button-color--blue-1000 Margin-left--auto">
              Add New Files
            </div>
          </div>
          <div className="Block-subtitle">Add New Files</div>

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
  )
}

export default WorkshopInformation
