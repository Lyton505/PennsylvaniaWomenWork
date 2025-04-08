import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal"
import { useUser } from "../contexts/UserContext"
import { api } from "../api"
import ParticipantCard from "../components/ParticipantCard"
import FolderCard from "../components/FolderCard"
import { toast } from "react-hot-toast"
import Event, {
  EventData,
  parseEvents,
  groupEventsByMonth,
  formatEventSubheader,
} from "../components/Event"

interface Mentee {
  _id: string
  first_name: string
  last_name: string
  email: string
}

interface Mentor {
  _id: string
  first_name: string
  last_name: string
  email: string
}

interface CourseInformationElements {
  _id: string
  name: string
  description: string
  s3id: string
  createdAt: string
  mentor: string
  mentee: string
  coverImageS3id: string
}

type ImageUrlMap = Record<string, string | null>

const StaffDashboard = () => {
  const navigate = useNavigate()
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [events, setEvents] = useState<EventData[]>([])
  const { user } = useUser()
  const [workshops, setWorkshops] = useState<CourseInformationElements[]>([])
  const userId = user?._id
  const [imageUrls, setImageUrls] = useState<ImageUrlMap>({})
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "My Mentees"
  })
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchUserEvents = async () => {
      try {
        const response = await api.get(`/api/event/${userId}`)
        const parsed = parseEvents(response.data)
        setEvents(parsed)
        console.log("Fetched events:", parsed)
      } catch (err) {
        console.log("Failed to load events.")
      }
    }

    if (
      !userId ||
      (user.role !== "mentor" && user.role !== "staff" && user.role !== "board")
    ) {
      console.log("Only mentors can view mentees.")
      setLoading(false)
      return
    }

    const fetchMentees = async () => {
      try {
        const endpoint =
          user.role === "staff"
            ? "/api/mentee/all-mentees"
            : `/api/mentor/${user._id}/mentees`

        const response = await api.get(endpoint)

        const menteeData =
          user.role === "staff"
            ? response.data // getAllMentees returns array directly
            : response.data.mentees // getMenteesForMentor returns {mentees: [...]}

        setMentees(Array.isArray(menteeData) ? menteeData : [])
        console.log("menteeData", menteeData)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }
    fetchUserEvents()
    fetchMentees()
  }, [user, userId])

  // call endpoint to get all workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await api.get(`/api/workshop/get-workshops`)
        setWorkshops(response.data)
        fetchImageUrls(response.data)
      } catch (err) {
        console.log("Unable to fetch folders.")
      }
    }
    fetchWorkshops()
  }, [])

  useEffect(() => {
    const fetchMentors = async () => {
      if (user?.role === "staff" || user?.role === "board") {
        try {
          const response = await api.get(`/api/mentor/all-mentors`)
          setMentors(response.data)
        } catch (err) {
          console.error("Unable to fetch mentors.")
        }
      }
    }

    fetchMentors()
  }, [user])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const fetchImageUrls = async (workshopsData: any) => {
    const urls: ImageUrlMap = {}

    await Promise.all(
      workshopsData.map(async (item: any) => {
        if (item.coverImageS3id) {
          try {
            const res = await api.get(
              `/api/resource/getURL/${item.coverImageS3id}`
            )
            urls[item.coverImageS3id] = res.data.signedUrl
          } catch (error) {
            console.error(
              `Error fetching image for ${item.coverImageS3id}:`,
              error
            )
            urls[item.coverImageS3id] = null
          }
        }
      })
    )

    setImageUrls(urls)
  }

  const currentMonthIndex = today.getMonth()

  const allUpcomingMonths = Array.from(
    { length: 12 - currentMonthIndex },
    (_, i) =>
      new Date(today.getFullYear(), currentMonthIndex + i, 1).toLocaleString(
        "default",
        { month: "long" }
      )
  )

  const eventsByMonth = groupEventsByMonth(events)

  const monthsWithEvents = Object.entries(eventsByMonth).filter(
    ([_, events]) => events.length > 0
  )

  const handleClick = (menteeId: string) => {
    navigate("/volunteer/participant-information", { state: { menteeId } })
  }

  const handleClickWorkshop = (id: string) => {
    navigate("/volunteer/workshop-information", { state: { workshopId: id } })
  }

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event)
  }

  const handleMentorClick = (volunteerId: string) => {
    console.log("Mentor ID:", volunteerId)
    navigate("/particpant/participant-information", {
      state: { volunteerId },
    })
  }

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab")
    if (!storedTab) {
      if (user?.role === "board") {
        handleTabClick("Files")
      } else if (user?.role === "mentor" || user?.role === "staff") {
        handleTabClick("My Participants")
      }
    }
  }, [user?.role])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem("activeTab", tab)
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await api.delete(`/api/event/${eventId}`)
      setEvents(events.filter((event) => event._id !== eventId))
      setSelectedEvent(null)
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={selectedEvent ? formatEventSubheader(selectedEvent) : ""}
          body={
            <div className="Flex-column">
              {selectedEvent.description}
              <div
                className="Button Button-color--red-1000 Margin-top--10 Button--hollow"
                onClick={() => handleDeleteEvent(selectedEvent._id)}
              >
                Delete Event
              </div>
              {selectedEvent.calendarLink && (
                <a
                  href={selectedEvent.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Button Button-color--blue-1000 Margin-top--10"
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Go to Link
                </a>
              )}
            </div>
          }
          action={() => setSelectedEvent(null)}
        />
      )}

      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="Block">
              <div className="Block-header">
                <div className="Flex-row">
                  {[
                    "Files",
                    ...(user?.role === "staff"
                      ? ["My Participants", "All Volunteers"]
                      : []),
                    ...(user?.role === "mentor" ? ["My Participants"] : []),
                  ].map((tab) => (
                    <div
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`tab ${activeTab === tab ? "active" : ""}`}
                    >
                      {tab === "My Participants" && user?.role === "staff"
                        ? "All Participants"
                        : tab}
                    </div>
                  ))}
                </div>
              </div>
              <div className="Block-subtitle" />

              {activeTab === "My Participants" && (
                <div>
                  {loading ? (
                    <p>Loading mentees...</p>
                  ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                  ) : mentees.length === 0 ? (
                    <p>No participants found.</p>
                  ) : (
                    <div className="row gx-3 gy-3">
                      {mentees.map((mentee) => (
                        <div className="col-lg-6" key={mentee._id}>
                          <ParticipantCard
                            firstName={mentee.first_name}
                            lastName={mentee.last_name}
                            email={mentee.email}
                            profilePictureId={
                              (mentee as any).profile_picture_id
                            } // cast if type doesn't include it
                            onClick={() => handleClick(mentee._id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(user?.role === "staff" || user?.role === "board") &&
                activeTab === "All Volunteers" && (
                  <div>
                    {mentors.length > 0 ? (
                      <div className="row gx-3 gy-3">
                        {mentors.map((mentor) => (
                          <div className="col-lg-6" key={mentor._id}>
                            <ParticipantCard
                              firstName={mentor.first_name}
                              lastName={mentor.last_name}
                              email={mentor.email}
                              profilePictureId={
                                (mentor as any).profile_picture_id
                              }
                              onClick={() => handleMentorClick(mentor._id)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No mentors found.</p>
                    )}
                  </div>
                )}

              {activeTab === "Files" && (
                <div className="row gx-3 gy-3">
                  {workshops.map((item) => (
                    <div className="col-lg-4" key={item._id}>
                      <FolderCard
                        name={item.name}
                        description={item.description}
                        imageUrl={imageUrls[item.coverImageS3id]}
                        onClick={() => handleClickWorkshop(item._id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="Block p-3">
              <div className="Block-header">Upcoming Events</div>
              <div className="Block-subtitle">Select an event for details.</div>
              {monthsWithEvents.length === 0 ? (
                <div className="Text--center">No upcoming events</div>
              ) : (
                monthsWithEvents.map(([month, monthEvents]) => (
                  <Event
                    key={month}
                    month={month}
                    events={monthEvents}
                    onEventClick={handleEventClick}
                  />
                ))
              )}

              <div
                className="Flex-row Align-items--center Width--100 Margin-top--10"
                style={{ gap: "10px" }}
              >
                {user && user.role === "staff" && (
                  <div
                    className="Button Button-color--blue-1000"
                    onClick={() => {
                      navigate("/create-event")
                    }}
                    style={{ flexGrow: 1 }}
                  >
                    Add New Event
                  </div>
                )}

                {user && (user.role === "staff" || user.role === "mentor") && (
                  <div
                    className="Button Button-color--blue-1000 "
                    onClick={() => navigate("/create-meeting")}
                    style={{ flexGrow: 1 }}
                  >
                    Schedule Meeting
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StaffDashboard
