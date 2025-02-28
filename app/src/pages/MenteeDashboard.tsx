import React, { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import Event, { EventData } from "../components/Event"
import { useUser } from "../contexts/UserContext"
import { useAuth0 } from "@auth0/auth0-react"

interface CourseInformationElements {
  id: string
  courseName: string
}

const MenteeDashboard = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<EventData[]>([])
  const [workshops, setWorkshops] = useState<CourseInformationElements[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const { user } = useUser()
  const userId = user?._id

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const [eventsResponse, workshopsResponse] = await Promise.all([
          api.get(`/api/event/${userId}`),
          api.get(`/api/workshop/user/${userId}`),
        ])

        setEvents(
          eventsResponse.data.map((event: any) => ({
            id: event._id,
            title: event.name,
            description: event.description,
            date: event.date,
            month: new Date(event.date).toLocaleString("default", {
              month: "long",
            }),
          }))
        )

        setWorkshops(
          workshopsResponse.data.map((workshop: any) => ({
            id: workshop._id,
            courseName: workshop.name,
          }))
        )
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [userId])

  const handleClick = (id: string) => {
    navigate(`/mentee/course-information/${id}`)
  }

  const eventsByMonth = events.reduce<{ [key: string]: EventData[] }>(
    (acc, event) => {
      if (!acc[event.month]) acc[event.month] = []
      acc[event.month].push(event)
      return acc
    },
    {}
  )

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.title}
          subheader={`${selectedEvent.month} ${new Date(selectedEvent.date).getDate()}, ${new Date(selectedEvent.date).getFullYear()}`}
          body={<>{selectedEvent.description}</>}
          action={() => setSelectedEvent(null)}
        />
      )}
      <div className="row g-3 Margin--20">
        <div className="col-lg-8">
          <div className="Block p-3">
            <div className="Block-header">My Courses</div>
            <div className="Block-subtitle">
              Select a course to access materials.
            </div>
            <div className="row gx-3 gy-3">
              {workshops.map((item) => (
                <div className="col-lg-4" key={item.id}>
                  <div
                    className="Workshop-card"
                    onClick={() => handleClick(item.id)}
                  >
                    <div className="Workshop-card-color Background-color--teal-1000" />
                    <div className="Padding--10">
                      <h3 className="Text-fontSize--20 Text-color--gray-600">
                        {item.courseName}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="Block p-3">
            <div className="Block-header">Upcoming Events</div>
            <div className="Block-subtitle">Select an event to register.</div>
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <div key={month} style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {month}
                </h3>
                {monthEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      background: "#f9f9f9",
                      borderRadius: "5px",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#333",
                        minWidth: "90px",
                        textAlign: "left",
                      }}
                    >
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div style={{ flexGrow: 1, paddingLeft: "10px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {event.title}
                      </span>
                      {" - "}
                      <span style={{ fontSize: "14px", color: "#666" }}>
                        {event.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default MenteeDashboard
