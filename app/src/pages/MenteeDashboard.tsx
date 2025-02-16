import React, { useState } from "react"
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import Event, {EventData} from "../components/Event"

const MenteeDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)

  const events: EventData[] = [
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

  const eventsByMonth: { [key: string]: EventData[] } = events.reduce(
    (acc, event) => {
      if (!acc[event.month]) {
        acc[event.month] = []
      }
      acc[event.month].push(event)
      return acc
    },
    {} as { [key: string]: EventData[] }
  )

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.title}
          subheader={`${selectedEvent.day.toUpperCase()}, ${selectedEvent.month} ${selectedEvent.date}`}
          body={<>{selectedEvent.fullDescription}</>}
          action={() => setSelectedEvent(null)}
        />
      )}
      <div className="row g-3 Margin--20">
        {/* Left Section */}
        <div className="col-lg-8">
          <div className="Block p-3">
            {" "}
            {/* Add padding inside */}
            <div className="Block-header">My courses</div>
            <div className="Block-subtitle">
              Select a course to access materials.
            </div>
            <div className="row gx-3 gy-3">
              {["teal-1000", "green-1000", "blue-1000"].map((color, index) => (
                <div key={index} className="col-lg-4">
                  <div className="Workshop-card">
                    <div
                      className={`Workshop-card-color Background-color--${color}`}
                    ></div>
                    <div className="Workshop-card-content">
                      <div className="Workshop-card-name">Resume Workshop</div>
                      Workshop content
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-4">
          <div className="Block p-3">
            {" "}
            {/* Add padding inside */}
            <div className="Block-header">Upcoming Events</div>
            <div className="Block-subtitle">Select an event to register.</div>
            {/* {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <div key={month} className="Event">
                <div className="Event-month">{month}</div>

                {monthEvents.map((event) => (
                  <div
                    className="Event-item"
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="Flex-column--centered Margin-right--30">
                      <div>{event.day}</div>
                      <div className="Text-fontSize--30">{event.date}</div>
                    </div>
                    <div className="Flex-column Text-bold">
                      <span className="Margin-bottom--4">{event.title}</span>
                      <div className="Text-fontSize--14">
                        {event.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))} */}
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <Event
                key={month}
                month={month}
                events={monthEvents}
                onEventClick={setSelectedEvent}
              />
            ))}

          </div>
        </div>
      </div>{" "}
    </>
  )
}

export default MenteeDashboard
