import React from "react"

export interface EventData {
  userIds: string[]
  //day: string
  date: string
  //month: string
  name: string
  description: string
  formattedDate?: string
  calendarLink?: string
}

interface EventProps {
  month: string
  events: EventData[]
  onEventClick: (event: EventData) => void
}

const Event = ({ month, events, onEventClick }: EventProps) => {
  return (
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
      {events.map((event) => (
        <div
          key={event.name}
          onClick={() => onEventClick(event)}
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
              {event.name}
            </span>

          </div>
        </div>
      ))}
    </div>
    // <div className="Event">
    //   <div className="Event-month">{month}</div>
    //   {events.map((event) => (
    //     <div
    //       className="Event-item"
    //       key={event.id}
    //       onClick={() => onEventClick(event)}
    //     >
    //       <div className="Flex-column--centered Margin-right--30">
    //         <div>{event.day}</div>
    //         <div className="Text-fontSize--30">{event.date}</div>
    //       </div>
    //       <div className="Flex-column Text-bold">
    //         <span className="Margin-bottom--4">{event.title}</span>
    //         <div className="Text-fontSize--14">{event.description}</div>
    //       </div>
    //     </div>
    //   ))}

    // </div>
  )
}

export default Event
