import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import pdf from "../assets/pdf.jpg"
import docx from "../assets/docx.png"
import video from "../assets/video.png"
import Icon from "../components/Icon"
import { useNavigate, useLocation } from "react-router-dom"
import { api } from "../api"
import { useUser } from "../contexts/UserContext"
import Modal from "../components/Modal"
import { toast } from "react-hot-toast"

const getIconForFile = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "pdf":
      return pdf
    case "doc":
    case "docx":
      return docx
    case "mp4":
    case "mov":
    case "avi":
      return video
    default:
      return docx
  }
}

interface Workshop {
  _id: string
  name: string
  description: string
  s3id: string
  createdAt: string
  mentor: string
  mentee: string
}

const WorkshopInformation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const workshopId = location.state?.workshopId
  const [resources, setResources] = useState<any[]>([])
  const [workshop, setWorkshop] = React.useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // get workshop information by id
  const getWorkshop = async () => {
    try {
      if (!workshopId) {
        console.error("No workshop ID provided")
        return
      }

      const response = await api.get(`/api/workshop/${workshopId}`)
      setWorkshop(response.data)
    } catch (error) {
      console.error("Error fetching workshop:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getWorkshop()
  }, [workshopId])

  useEffect(() => {
    // call endpoint to get all resources for a workshop
    const fetchResources = async () => {
      try {
        const { data: resourceList } = await api.get(
          `/api/resource/get-resource-by-workshop/${workshopId}`
        )

        if (!resourceList || resourceList.length === 0) {
          setResources([])
          setError("No resources found.")
          return
        }

        const resourcesWithURL = await Promise.all(
          resourceList.map(async (res: any) => {
            const { data } = await api.get(`/api/resource/getURL/${res.s3id}`)
            return { ...res, url: data.signedUrl }
          })
        )
        setResources(resourcesWithURL)
      } catch (error) {
        setError("Error fetching resources.")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!workshop) {
    return <div>Workshop not found</div>
  }
  const deleteWorkshop = async () => {
    try {
      // TODO: Add API call to delete workshop
      await api.delete(`/api/workshop/delete-workshop/${workshop?._id}`)
      console.log("Deleting workshop:", workshop?._id)
      setShowDeleteModal(false)
      toast.success("Workshop deleted successfully!")
      navigate("/home")
    } catch (error) {
      console.error("Error deleting workshop:", error)
    }
  }
  return (
    <>
      <Navbar />
      <div className="WorkshopInfo">
        <div onClick={() => navigate("/home")} className=" Margin-bottom--10">
          <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
        </div>
        <div className="Block Width--70 Margin-left--80 Margin-right--80 Margin-top--40">
          <div className="Block-header Flex-row">
            {workshop?.name}
            <div className="Flex-row Margin-left--auto" style={{ gap: "10px" }}>
              {user?.role === "staff" && (
                <div
                  // className="Button Button-color--red-1000"
                  className="Text-color--gray-1000 Text-colorHover--red-1000"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Icon glyph="trash" />
                </div>
              )}
              {(user?.role === "mentor" || user?.role === "staff") && (
                <div className="Button Button-color--blue-1000">
                  Add New Files
                </div>
              )}
            </div>
          </div>
          {showDeleteModal && (
            <Modal
              header="Delete Workshop"
              subheader="Are you sure you want to delete this workshop?"
              body={
                <div className="Flex-row" style={{ gap: "10px" }}>
                  <button
                    className="Button Button-color--gray-1000 Button--hollow"
                    onClick={() => setShowDeleteModal(false)}
                    style={{ flexGrow: 1 }}
                  >
                    Cancel
                  </button>

                  <button
                    className="Button Button-color--red-1000"
                    style={{ flexGrow: 1 }}
                    onClick={() => {
                      deleteWorkshop()
                    }}
                  >
                    Delete
                  </button>
                </div>
              }
              action={() => setShowDeleteModal(false)}
            />
          )}
          <div className="Block-subtitle">{workshop?.description}</div>

          <div className="row gx-3 gy-3">
            {loading ? (
              <p>Loading resources...</p>
            ) : error ? (
              <p style={{ color: "red", marginLeft: "15px" }}>{error}</p>
            ) : (
              resources.map((file) => (
                <div key={file._id} className="col-lg-2">
                  <div
                    className="Card"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    {" "}
                    {/* Ensure Card is inside col-lg-2 */}
                    <div className="WorkshopInfo-image">
                      <img src={getIconForFile(file.s3id)} alt={file.type} />
                    </div>
                    <div className="WorkshopInfo-title">{file.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkshopInformation
