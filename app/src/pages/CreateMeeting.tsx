import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Navbar from "../components/Navbar";
import * as Yup from "yup";
import { api } from "../api"; // Ensure this points to your configured API instance
import Icon from "../components/Icon";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-hot-toast";

interface CreateMeetingFormValues {
  username: string;
  meeting: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarLink: string;
  participants: string[];
  role: string[];
}

interface Mentor {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const initialValues: CreateMeetingFormValues = {
  username: "",
  meeting: "",
  date: "",
  startTime: "",
  endTime: "",
  calendarLink: "",
  participants: [],
  role: [],
};

const roles = [
  { id: "mentee", label: "Mentee" },
  { id: "mentor", label: "Mentor" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
];

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  meeting: Yup.string().required("Meeting name is required"),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (endTime) {
        const { startTime } = this.parent;
        return !startTime || !endTime || startTime < endTime;
      },
    ),
  calendarLink: Yup.string()
    .url("Must be a valid URL")
    .required("Calendar link is required"),
  participants: Yup.array()
    .of(Yup.string())
    .min(1, "Add at least one participant"),
});

const CreateMeeting = () => {
  const { user } = useUser();
  const [newParticipant, setNewParticipant] = useState("");
  const [participants, setParticipants] = useState<
    Array<{ _id: string; first_name: string; last_name: string; type: string }>
  >([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!user?._id) return;

      try {
        // Staff/board can see all users
        if (user.role === "staff" || user.role === "board") {
          const [mentorsRes, menteesRes] = await Promise.all([
            api.get("/api/mentor/all-mentors"),
            api.get("/api/mentee/all-mentees"),
          ]);

          const allParticipants = [
            ...mentorsRes.data.map((m: any) => ({ ...m, type: "Mentor" })),
            ...menteesRes.data.map((m: any) => ({ ...m, type: "Participant" })),
          ];

          setParticipants(allParticipants);
        }
        // Mentee sees their mentors
        else if (user.role === "mentee") {
          const response = await api.get(`/api/mentee/${user._id}/mentors`);
          if (response.data.mentors) {
            setParticipants(response.data.mentors);
          } else {
            toast.error("No mentors assigned yet");
          }
        }
        // Mentor sees their mentees
        else if (user.role === "mentor") {
          const response = await api.get(`/api/mentor/${user._id}/mentees`);
          if (response.data.mentees) {
            setParticipants(response.data.mentees);
          } else {
            toast.error("No mentees assigned yet");
          }
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
        toast.error("Failed to load participants");
      }
    };

    fetchParticipants();
  }, [user]);

  const participantLabel =
    user?.role === "mentee" ? "Select Mentor" : "Select Participant";
  const participantPlaceholder =
    user?.role === "mentee" ? "Choose a mentor..." : "Select participant...";

  const handleSubmit = async (
    values: CreateMeetingFormValues,
    { setSubmitting, resetForm }: any,
  ) => {
    try {
      const baseDate = new Date(values.date);
      const [startHours, startMinutes] = values.startTime.split(":");
      const [endHours, endMinutes] = values.endTime.split(":");

      const startDateTime = new Date(baseDate);
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

      const endDateTime = new Date(baseDate);
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

      // Format payload to match event controller expectations
      const payload = {
        name: values.meeting,
        description: "Meeting",
        date: baseDate.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        calendarLink: values.calendarLink,
        userIds: [...values.participants, user?._id], // Add mentor's ID to the userIds array
        roles: [],
      };

      await api.post("/api/event", payload);
      toast.success("Meeting scheduled successfully!");
      resetForm();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("Failed to schedule meeting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="FormWidget">
        <div className="FormWidget-body Block">
          <div className="Block-header">Create Meeting</div>
          <div className="Block-subtitle">Add a new meeting</div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, isSubmitting, setFieldValue }) => (
              <Form>
                <div className="Form-group">
                  <label htmlFor="meeting">Meeting Name</label>
                  <Field
                    type="text"
                    name="meeting"
                    className="Form-input-box"
                    placeholder="Enter meeting name"
                  />
                  {errors.meeting && touched.meeting && (
                    <div className="Form-error">{errors.meeting}</div>
                  )}
                </div>

                <div className="Form-group">
                  <label htmlFor="date">Date</label>
                  <Field type="date" name="date" className="Form-input-box" />
                  {errors.date && touched.date && (
                    <div className="Form-error">{errors.date}</div>
                  )}
                </div>
                <div className="Flex-row">
                  <div className="Form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <Field
                      type="time"
                      name="startTime"
                      className="Form-input-box Margin-right--4"
                    />
                    {errors.startTime && touched.startTime && (
                      <div className="Form-error">{errors.startTime}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="endTime">End Time</label>
                    <Field
                      type="time"
                      name="endTime"
                      className="Form-input-box Margin-left--4"
                    />
                    {errors.endTime && touched.endTime && (
                      <div className="Form-error">{errors.endTime}</div>
                    )}
                  </div>
                </div>

                <div className="Form-group">
                  <label htmlFor="calendarLink">Calendar Link</label>
                  <Field
                    type="text"
                    name="calendarLink"
                    className="Form-input-box"
                    placeholder="https://..."
                  />
                  {errors.calendarLink && touched.calendarLink && (
                    <div className="Form-error">{errors.calendarLink}</div>
                  )}
                </div>

                <div className="Form-group">
                  <label>{participantLabel}</label>
                  <div className="Flex-row Align-items--center">
                    <select
                      className="Form-input-box"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                    >
                      <option value="">{participantPlaceholder}</option>
                      {participants.map((participant) => (
                        <option key={participant._id} value={participant._id}>
                          {participant.first_name} {participant.last_name}
                          {(user?.role === "staff" || user?.role === "board") &&
                            ` (${participant.type})`}
                        </option>
                      ))}
                    </select>
                    <div
                      className="Text-colorHover--green-1000"
                      onClick={() => {
                        if (
                          newParticipant &&
                          !values.participants.includes(newParticipant)
                        ) {
                          setFieldValue("participants", [
                            ...values.participants,
                            newParticipant,
                          ]);
                          setNewParticipant("");
                        }
                      }}
                      style={{ marginLeft: "8px", cursor: "pointer" }}
                    >
                      <Icon glyph="plus" />
                    </div>
                  </div>
                  {values.participants.length > 0 && (
                    <ul className="Selected-participants">
                      {values.participants.map((participantId) => {
                        const participant = participants.find(
                          (p) => p._id === participantId,
                        );
                        return (
                          <li key={participantId}>
                            {participant
                              ? `${participant.first_name} ${participant.last_name}`
                              : participantId}
                            <div
                              className="Text-colorHover--red-1000"
                              onClick={() => {
                                setFieldValue(
                                  "participants",
                                  values.participants.filter(
                                    (id) => id !== participantId,
                                  ),
                                );
                              }}
                              style={{ marginLeft: "8px", cursor: "pointer" }}
                            >
                              <Icon glyph="times" />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="Flex-row Justify-content--center">
                  <button
                    type="submit"
                    className="Button Button-color--blue-1000 Width--100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Meeting"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CreateMeeting;
