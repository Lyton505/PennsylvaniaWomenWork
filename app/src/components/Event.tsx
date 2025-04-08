import React from "react";

export interface EventData {
  _id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarLink?: string;
  userIds?: string[];
  formattedDate?: string;
}

interface EventProps {
  month: string;
  events: EventData[];
  onEventClick: (event: EventData) => void;
}

const Event = ({ month, events, onEventClick }: EventProps) => {
  return (
    <div className="Event">
      <div className="Event-month">{month}</div>

      {events.map((event) => {
        const eventDate = new Date(event.date);
        const dayOfMonth = eventDate.getDate();
        const dayOfWeek = eventDate.toLocaleDateString("en-US", {
          weekday: "short",
        });

        // Only show time if it's not an expiration-based event
        const isExpirationEvent = event.startTime === event.date;

        let timeRange = "";
        if (!isExpirationEvent) {
          const formattedStart = new Date(event.startTime).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: true },
          );
          const formattedEnd = new Date(event.endTime).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: true },
          );
          timeRange = `${formattedStart} – ${formattedEnd}`;
        }

        return (
          <div
            key={event.name + event.date}
            className="Event-item"
            onClick={() => onEventClick(event)}
          >
            <div className="Event-item-date">
              <div className="day">{dayOfMonth}</div>
              <div className="weekday">{dayOfWeek}</div>
            </div>
            <div className="Event-item-details">
              <div className="title">{event.name}</div>
              {!isExpirationEvent && <div className="time">{timeRange}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;
