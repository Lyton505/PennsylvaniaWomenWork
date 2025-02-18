import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuth0 } from "@auth0/auth0-react";

interface Mentee {
  _id: string;
  firstName: string;
  lastName: string;
}

interface MenteeInformationElements {
  id: number;
  menteeName: string;
}

interface CourseInformationElements {
  id: number;
  courseName: string;
}

interface Event {
  id: number;
  day: string;
  date: string;
  month: string;
  title: string;
  description: string;
  fullDescription: string;
}

const handleClick = (item: MenteeInformationElements) => {
  console.log("Clicked:", item);
};

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    user: auth0User,
    isLoading: authLoading,
    error: authError,
  } = useAuth0();
  const username = auth0User?.email || "";
  const { user } = useCurrentUser(username); // fetch user details from backend

  useEffect(() => {
    console.log("Auth Loading:", authLoading);
    console.log("Current user:", user);

    if (authLoading) {
      console.log("Auth still loading...");
      return;
    }

    if (!user) {
      console.log("User is not available yet...");
      return;
    }

    if (!user._id) {
      console.log("User ID is missing...");
      return;
    }

    if (user.role !== "mentor") {
      console.log("User is not a mentor.");
      setError("Only mentors can view mentees.");
      setLoading(false);
      return;
    }

    console.log("User is a mentor. Proceeding to fetch mentees...");

    const fetchMentees = async () => {
      try {
        console.log("Fetching mentees for mentor ID:", user._id);
        const response = await fetch(
          `http://localhost:8000/api/mentor/${user._id}/mentees`,
        );
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch mentees. Status: ${response.status}`,
          );
        }

        const data = await response.json();
        console.log("Retrieved mentee data:", data);

        // Ensure `data.mentees` is an array before setting it
        if (Array.isArray(data.mentees)) {
          setMentees(data.mentees);
        } else {
          console.error("Error: Expected an array but received:", data);
          setMentees([]); // Prevents .map() errors
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching mentees:", err);
        setError("Unable to fetch mentees.");
        setLoading(false);
      }
    };

    fetchMentees();
  }, [user, authLoading]); // re-run when user updates

  const [activeTab, setActiveTab] = useState("My Mentees");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events: Event[] = [
    {
      id: 1,
      day: "wed",
      date: "25",
      month: "June",
      title: "Meeting with Jane",
      description: "One-on-one meeting with Jane to discuss her career goals",
      fullDescription:
        "One-on-one meeting with Jane to discuss her career goals.",
    },
    {
      id: 2,
      day: "fri",
      date: "27",
      month: "June",
      title: "Meeting with John",
      description: "One-on-one meeting with John to discuss his career goals",
      fullDescription:
        "One-on-one meeting with John to discuss his career goals.",
    },
    {
      id: 3,
      day: "mon",
      date: "1",
      month: "July",
      title: "Mentor Networking Event",
      description: "Connecting with other mentors and industry professionals",
      fullDescription:
        "Discussion with other mentors and industry professionals about their work, best practices, and more.",
    },
  ];

  const eventsByMonth: { [key: string]: Event[] } = events.reduce(
    (acc, event) => {
      if (!acc[event.month]) {
        acc[event.month] = [];
      }
      acc[event.month].push(event);
      return acc;
    },
    {} as { [key: string]: Event[] },
  );

  // previous static dummy data
  // const menteeGridData: MenteeInformationElements[] = [
  //   {
  //     id: 1,
  //     menteeName: "Jane Doe",
  //   },
  //   {
  //     id: 2,
  //     menteeName: "John Doe",
  //   },
  // ]

  const menteeGridData = Array.isArray(mentees) // parse mentee data
    ? mentees.map((mentee) => ({
        id: mentee._id,
        menteeName: `${mentee.firstName} ${mentee.lastName}`,
      }))
    : []; // initialize empty array

  const courseGridData: CourseInformationElements[] = [
    {
      id: 1,
      courseName: "Resume",
    },
  ];

  const handleClick = (id: string) => {
    navigate(`/mentor/mentee-information/${id}`);
  };

  const handleClickWorkshop = (id: number) => {
    navigate(`/mentor/workshop-information/`);
  };

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
        <div className="col-lg-8">
          <div className="Block p-3">
            <div className="Flex-row Margin-bottom--30">
              {["My Mentees", "Courses"].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    "Cursor--pointer Padding-bottom--8 Margin-right--32 Text-fontSize--20 " +
                    (activeTab === tab
                      ? "Border-bottom--blue Text-color--gray-1000"
                      : "Text-color--gray-600")
                  }
                  style={{
                    cursor: "pointer",
                    paddingBottom: "8px",
                    borderBottom:
                      activeTab === tab
                        ? "2px solid #0096C0"
                        : "2px solid transparent",
                    marginRight: "48px",
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {activeTab === "My Mentees" && (
              <div>
                {loading ? (
                  <p>Loading mentees...</p>
                ) : error ? (
                  <p style={{ color: "red" }}>{error}</p>
                ) : mentees.length > 0 ? (
                  <div className="row gx-3 gy-3">
                    {menteeGridData.map((mentee) => (
                      <div className="col-lg-4" key={mentee.id}>
                        <div
                          className="Mentor--card"
                          onClick={() => handleClick(mentee.id)}
                        >
                          <div className="Mentor--card-color Background-color--teal-1000" />
                          <div className="Padding--10">
                            <h3 className="Text-fontSize--20 Text-color--gray-600">
                              {mentee.menteeName}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No mentees found.</p>
                )}
              </div>
            )}

            {activeTab === "Courses" && (
              <div className="row gx-3 gy-3">
                {courseGridData.map((item) => (
                  <div className="col-lg-4">
                    <div
                      className="Mentor--card"
                      onClick={() => handleClickWorkshop(item.id)}
                    >
                      <div className="Mentor--card-color Background-color--teal-1000" />
                      <div className="Padding--10">
                        <h3 className="Text-fontSize--20 Text-color--gray-600">
                          {item.courseName}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {activeTab === "My Mentees" && (
          <div className="col-lg-4">
            <div className="Block p-3">
              <div className="Block-header">Upcoming Events</div>
              <div className="Block-subtitle">
                Scheduled meetings and workshops
              </div>
              {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
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
              ))}
            </div>
          </div>
        )}

        {activeTab === "Courses" && (
          <div className="col-lg-4">
            <div className="Block p-3">
              <div className="Block-header">Create A New Course</div>
              <div className="Block-subtitle">
                Add course information and upload files
              </div>
              <div className="Flex-row Justify-content--left">
                <div className="Text-fontSize--15 Text-color--gray-800 Margin-bottom--16 Margin-left--20">
                  Name:
                </div>
              </div>
              <div className="Flex-row Justify-content--left">
                <div className="Text-fontSize--15 Text-color--gray-800 Margin-bottom--30 Margin-left--20">
                  Description:
                </div>
              </div>
              <div className="Flex-row Justify-content--left">
                <div
                  className="Button--large Border-radius--4 Text-fontSize--16 Button-color--teal-1000 Margin-bottom--16 Margin-left--20 "
                  onClick={() => {
                    navigate("/create-workshop");
                  }}
                >
                  Add New Files
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MentorDashboard;
