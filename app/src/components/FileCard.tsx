import React from "react";
import Icon from "../components/Icon"; // adjust path if needed
import pdf from "../assets/pdf.png";
import docx from "../assets/docx.png";
import video from "../assets/video.png";

const getIconForFile = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return pdf;
    case "doc":
    case "docx":
      return docx;
    case "mp4":
    case "mov":
    case "avi":
      return video;
    default:
      return docx;
  }
};

export interface Resource {
  _id: string;
  name: string;
  s3id: string;
  type: string;
  description?: string;
  url: string;
}

interface WorkshopCardProps {
  file: Resource;
  onDelete: () => void;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ file, onDelete }) => {
  return (
    <div
      className="WorkshopCard"
      onClick={() => window.open(file.url, "_blank")}
    >
      <div className="WorkshopCard-icon">
        <img src={getIconForFile(file.s3id)} alt={file.type} />
      </div>

      <div className="WorkshopCard-text">
        <div className="WorkshopCard-title" title={file.name}>
          {file.name}
          <div
            className="Margin-left--auto Text-colorHover--red-1000"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Icon glyph="trash" />
          </div>
        </div>
        <div className="WorkshopCard-description">
          {file.description || "No description"}
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
