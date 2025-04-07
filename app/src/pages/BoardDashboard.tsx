import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Event, { EventData } from "../components/Event";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";


import FolderCard from "../components/FolderCard";

interface File {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  s3id: string;
}

const BoardDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const { user } = useUser();
  const userId = user?._id;
  const [loading, setLoading] = useState(true);
  const start = selectedEvent ? new Date(selectedEvent.startTime) : null;
  const end = selectedEvent ? new Date(selectedEvent.endTime) : null;
  const eventDate = selectedEvent ? new Date(selectedEvent.date) : null;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const possibleTags = ["planning", "governance", "strategy"]; 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");





  // const filteredFiles = files.filter(file => 
  //   selectedTags.length === 0 || 
  //   selectedTags.some(tag => file.tags.includes(tag))
  // );
  const filteredFiles = files.filter(file => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => file.tags.includes(tag));
    
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTags && matchesSearch;
  });

  const formattedSubheader =
    eventDate && start && end
      ? `${eventDate.toLocaleString("default", {
          month: "long",
        })} ${eventDate.getDate()}, ${eventDate.getFullYear()} ${start.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          },
        )} - ${end.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`
      : "";

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [eventsResponse, filesResponse] = await Promise.all([
          api.get(`/api/event/${userId}`),
          api.get(`/api/boardFile/get-board-files`),
        ]);

        setFiles(
          filesResponse.data.map((file: any) => ({
            name: file.name,
            description: file.description,
            s3id: file.s3id,
            tags: file.tags || [],
          })),
        );

        setEvents(
          eventsResponse.data.map((event: any) => ({
            name: event.name,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            date: event.date,
            userIds: event.users || [],
            calendarLink: event.calendarLink || "",
          })),
        );

        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFileClick = (workshopId: string) => {
    navigate(`/volunteer/workshop-information`, {
      state: { workshopId },
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventsByMonth: { [key: string]: EventData[] } = events
    .filter((event) => new Date(event.date) >= today)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    ) // Sort events chronologically
    .reduce(
      (acc, event) => {
        const eventDate = new Date(event.startTime);
        const month = eventDate.toLocaleString("default", { month: "long" });

        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push({
          ...event,
          formattedDate: eventDate.toDateString(),
        });

        return acc;
      },
      {} as { [key: string]: EventData[] },
    );

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={formattedSubheader}
          body={
            <div className="Flex-column">
              {selectedEvent.description}
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
                  Add to Calendar
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
              <div className="Block-header">All Files</div>
              <div className="Block-subtitle">
                Select a file to access materials.
              </div>
              <div className="Form-group">
                <input
                  type="text"
                  className="Form-input-box"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="Form-group" style={{ position: 'relative' }}>
                <button 
                  className="Button Button-color--blue-1000"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  type="button"
                >
                  Filter by Tags ▼
                </button>
                
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: 0,
                    zIndex: 1000,
                    backgroundColor: 'white',
                    border: '1px solid var(--pww-color-gray-300)',
                    borderRadius: '4px',
                    padding: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    minWidth: '200px'
                  }}>
                    {possibleTags.map(tag => (
                      <div 
                        key={tag}
                        className="Flex-row Align-items--center Gap--10 Padding--5 Hover--background-gray-100 Cursor--pointer"
                        onClick={() => {
                          setSelectedTags(prev => 
                            prev.includes(tag) 
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => {}} // Handle change in onClick above
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Display selected tags */}
                <div className="Flex-row Flex-wrap Gap--10 Margin-top--10">
                  {selectedTags.map(tag => (
                    <div 
                      key={tag}
                      className="Filter-tag Filter-tag--removable"
                      onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    >
                      {tag} ✕
                    </div>
                  ))}
                </div>
              </div>


              <div className="row gx-3 gy-3">
                {filteredFiles.map((item) => (
                  <div
                    className="col-lg-4"
                    key={item._id}
                    onClick={() => handleFileClick(item._id)}
                  >
                    <FolderCard
                      name={item.name}
                      description={item.description}
                      tags={item.tags}
                      onClick={() => handleFileClick(item._id)}
                    />
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
                <Event
                  key={month}
                  month={month}
                  events={monthEvents}
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardDashboard;
