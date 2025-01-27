import React, { useState } from "react"
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"

interface Event {
  id: number
  day: string
  date: string
  month: string
  title: string
  description: string
  fullDescription: string
}

const MenteeDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const events: Event[] = [
    {
      id: 1,
      day: "wed",
      date: "25",
      month: "June",
      title: "Mock Interview Session",
      description:
        "Practice your interview skills with an industry professional",
      fullDescription:
        "Join us for a comprehensive mock interview session where industry professionals will provide real-world interview scenarios and valuable feedback. You'll get hands-on experience with common interview questions and learn techniques to improve your performance.",
    },
    {
      id: 2,
      day: "fri",
      date: "27",
      month: "June",
      title: "Resume Workshop",
      description: "Develop your resume with a senior employee",
      fullDescription:
        "Work directly with senior employees to craft a compelling resume. Learn about industry best practices, how to highlight your achievements, and get personalized feedback on your current resume. Bring your laptop and current resume for hands-on improvements.",
    },
    {
      id: 3,
      day: "mon",
      date: "1",
      month: "July",
      title: "Networking Event",
      description: "Connect with industry professionals",
      fullDescription:
        "Join us for an evening of networking with senior members in your desired field.",
    },
  ]

  const eventsByMonth: { [key: string]: Event[] } = events.reduce(
    (acc, event) => {
      if (!acc[event.month]) {
        acc[event.month] = []
      }
      acc[event.month].push(event)
      return acc
    },
    {} as { [key: string]: Event[] }
  )

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.title}
          subheader={`${selectedEvent.day.toUpperCase()}, ${selectedEvent.month} ${selectedEvent.date}`}
          body={<p>{selectedEvent.fullDescription}</p>}
          action={() => setSelectedEvent(null)}
        />
      )}
      <div className="Flex-row Justify-content--spaceBetween">
        <div className="Block Width--60 Margin-right--40 Margin-left--40 Margin-top--40">
          <div
            className="Block-header Text-color--gray-600 Margin-bottom--20"
            style={{ fontSize: "20px" }}
          >
            My courses
          </div>

          <div className="Flex-row Justify-content--spaceBetween">
            {["teal-1000", "green-1000", "blue-1000"].map((color, index) => (
              <div
                key={index}
                className="Card Card--noPadding Card-hover Margin-right--10"
                style={{ width: "215px" }}
              >
                <div
                  className={`Background-color--${color} Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8`}
                  style={{ height: "50px" }}
                ></div>
                <div className="Padding--10" style={{ height: "150px" }}>
                  <h3 className="Text-fontSize--20 Text-color--gray-600">
                    Resume Workshop
                  </h3>
                  <p className="Text-fontSize--16 Text-color--gray-600">
                    Workshop content
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="Block Width--40 Margin-right--40 Margin-top--40">
          <div
            className="Block-header Text-color--gray-1000 Margin-bottom--20"
            style={{
              borderBottom: "1px solid #e0e0e0",
              paddingBottom: "10px",
              textAlign: "center",
            }}
          >
            Upcoming Events!
          </div>

          {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
            <div key={month}>
              <div
                className="Block-subtitle Margin-top--40"
                style={{ borderBottom: "1px solid #e0e0e0", width: "50%" }}
              >
                {month}
              </div>

              {monthEvents.map((event) => (
                <div
                  className="Margin-top--20"
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="Flex-row Margin-bottom--10">
                    <div
                      className="Margin-right--40"
                      style={{ textAlign: "center", width: "40px" }}
                    >
                      <div className="Text-color--gray-800">{event.day}</div>
                      <div className="Text-fontSize--30 Text-color--gray-1000">
                        {event.date}
                      </div>
                    </div>
                    <div>
                      <div className="Text-fontSize--16 Text-color--gray-1000">
                        {event.title}
                      </div>
                      <div className="Text-fontSize--14 Text-color--gray-800">
                        {event.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MenteeDashboard
