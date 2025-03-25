import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as yup from "yup";
import { api } from "../api";
import { useUser } from "../contexts/UserContext";
import { tier1Roles, tier2Roles, tier3Roles } from "../utils/roles";
import AsyncSubmit from "../components/AsyncSubmit"

interface CreateEventValues {
  name: string
  description: string
  date: string
  startTime: string
  endTime: string
  invitationLink: string
}

const startValues: CreateEventValues = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  invitationLink: "",
}

// Yup validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Event name is required"),
  description: yup.string().required("Description is required"),
  date: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup
    .string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (endTime) {
        const { startTime } = this.parent
        return !startTime || !endTime || startTime < endTime
      }
    ),
  invitationLink: yup
    .string()
    .url("Must be a valid URL")
    .required("Invitation link is required"),
})

interface MenteeInfo {
  _id: string; // Mentee's unique ID (MongoDB ObjectID or Auth0 ID)
  firstName: string;
  lastName: string;
  email: string;
  role: string; // e.g., "mentee"
  mentor?: string; // Optional mentor ID assigned to mentee
  workshops: string[]; // List of workshop names
}

const MenteeInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menteeId = location.state?.menteeId;
  const [mentee, setMentee] = useState<MenteeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Workshops");
  const [isModal, setIsModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!menteeId) {
      setError("Mentee ID is missing.");
      setLoading(false);
      return;
    }

    const fetchMentee = async () => {
      try {
        console.log("Fetching mentee data for ID:", menteeId);
        const response = await api.get(`/api/mentee/get-mentee/${menteeId}`); // ✅ Fetch mentee data
        setMentee(response.data);
      } catch (err) {
        setError("Failed to load mentee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentee();
  }, [menteeId]);

  const initialValues = {
    courseName: "",
    startDate: "",
    description: "",
  };

  const validationSchema = yup.object({
    courseName: yup.string().required("Course name is required"),
    startDate: yup.date().required("Start date is required"),
    description: yup.string().required("Course description is required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    try {
      console.log(values);
      setIsModal(false);
    } catch (error) {
      console.error("Error assigning course:", error);
    }
    setSubmitting(false);
  };

  const handleSubmit2 = async (
    values: CreateEventValues,
    { setSubmitting, resetForm }: FormikHelpers<CreateEventValues>
  ) => {
    try {
      // TODO: Replace with your own event creation logic
      console.log("Event created with values:", values)

      // Optionally reset the form after submit
      resetForm()
      // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="Block Width--70 Margin-left--80 Margin-right--80 Margin-top--40">
        <div className="Margin-bottom--40 Margin-left--40 Margin-right--40 Margin-top--30">
          <div onClick={() => navigate("/home")} className="Chevron">
            <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
          </div>

          <div className="Flex-row Margin-bottom--10 Margin-top--30 ">
            <div className="Text--title">
              {mentee?.firstName} {mentee?.lastName}
              Jack Benson
            </div>
          </div>

          <div className="Flex-row Margin-bottom--40">
            <div className="Text--subtitle">
              Mentee
              {/* {mentee?.role} */}
            </div>
          </div>

          <div className="Flex-row Margin-bottom--60">
            <div className="Text--subtitle Text-color--gray-600">
              Information
            </div>
          </div>

          <div>
            <div>
              <div className="Flex-row Margin-bottom--24 Width--50">
                {[
                  "Workshops",
                  "Meetings",
                  ...(user?.role === "staff" ? ["Schedule New"] : []),
                ].map((tab) => (
                  <div
                    key={tab}
                    className={`Text-fontSize--16 Tabs__tab ${activeTab === tab ? "Tabs__tab--active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              {activeTab === "Workshops" && (
                <div>
                  <div className="Header">Current Workshops</div>
                  <div className="List-style--none">
                    {mentee?.workshops && mentee.workshops.length > 0 ? (
                      mentee.workshops.map(
                        (workshop: string, index: number) => (
                          <div
                            key={index}
                            className="Flex-row Text--body Margin-bottom--20 Align-items--center"
                          >
                            <div className="Course-list-bullet" />
                            {workshop}
                          </div>
                        )
                      )
                    ) : (
                      <p>No workshops assigned.</p>
                    )}
                  </div>

                  {user && tier1Roles.includes(user.role) && (
                    <div
                      className="Button Button-color--teal-1000"
                      onClick={() => setIsModal(true)}
                    >
                      Assign New Courses
                    </div>
                  )}
                </div>
              )}

              {isModal && (
                <Modal
                  header="Assign New Course"
                  subheader="Add a new course for this mentee"
                  action={() => setIsModal(false)}
                  body={
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ errors, touched, isSubmitting }) => (
                        <Form>
                          <div className="Form-group">
                            <label htmlFor="courseName">Course Name</label>
                            <Field
                              className="Form-input-box"
                              type="text"
                              id="courseName"
                              name="courseName"
                              placeholder="Enter course name"
                            />
                            {errors.courseName && touched.courseName && (
                              <div className="Form-error">
                                {errors.courseName}
                              </div>
                            )}
                          </div>

                          <div className="Form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <Field
                              className="Form-input-box"
                              type="date"
                              id="startDate"
                              name="startDate"
                            />
                            {errors.startDate && touched.startDate && (
                              <div className="Form-error">
                                {errors.startDate}
                              </div>
                            )}
                          </div>

                          <div className="Form-group">
                            <label htmlFor="description">Description</label>
                            <Field
                              className="Form-input-box"
                              as="textarea"
                              id="description"
                              name="description"
                              rows="3"
                              placeholder="Enter course description"
                            />
                            {errors.description && touched.description && (
                              <div className="Form-error">
                                {errors.description}
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="Button Button-color--teal-1000 Width--100"
                            disabled={isSubmitting}
                          >
                            Assign Course
                          </button>
                        </Form>
                      )}
                    </Formik>
                  }
                />
              )}

              {activeTab === "Meetings" && (
                <div>
                  <div className="Header">Upcoming</div>
                  <div className="Flex-row Margin-bottom--10 Margin-left--60">
                    <div className="Margin-right--40 Width--40px Text-align--center">
                      <div className="Text--subtitle">wed</div>
                      <div className="Text-fontSize--28 Text-color--gray-1000">
                        25
                      </div>
                    </div>
                    <div>
                      <div className="Text--subtitle">
                        Mock Interview Session
                      </div>
                      <div className="Text--body">
                        Practice your interview skills with an industry
                        professional
                      </div>
                    </div>
                  </div>
                  <div className="Flex-row Margin-bottom--10 Margin-left--60">
                    <div
                      className="Button Button-color--teal-1000 Width--40"
                      onClick={() => {
                        navigate("/create-meeting");
                      }}
                    >
                      Add New Meeting Notes
                    </div>
                  </div>
                  <div className="Header">Past</div>
                  <div className="Flex-row Margin-bottom--10 Margin-left--60">
                    <div className="Margin-right--40 Width--40px Text-align--center">
                      <div className="Text--subtitle">wed</div>
                      <div className="Text-fontSize--28 Text-color--gray-1000">
                        25
                      </div>
                    </div>
                    <div>
                      <div className="Text--subtitle">
                        Mock Interview Session
                      </div>
                      <div className="Text--body">
                        Practice your interview skills with an industry
                        professional
                      </div>
                    </div>
                  </div>
                  <div className="Flex-row Margin-bottom--10 Margin-left--60">
                    <div className="Button Button-color--teal-1000 Width--40">
                      Add New Meeting Notes
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Schedule New" && (
                <div>
                  <div className="Header">Schedule A New Meeting</div>
                  <Formik
                    initialValues={startValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit2}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form>
                        <div className="Form-group">
                          <label htmlFor="name">Event Name</label>
                          <Field
                            type="text"
                            name="name"
                            className="Form-input-box"
                            placeholder="Enter event name"
                          />
                          {errors.name && touched.name && (
                            <div className="Form-error">{errors.name}</div>
                          )}
                        </div>

                        <div className="Form-group">
                          <label htmlFor="description">Description</label>
                          <Field
                            type="text"
                            name="description"
                            className="Form-input-box"
                            placeholder="Enter event description"
                          />
                          {errors.description && touched.description && (
                            <div className="Form-error">
                              {errors.description}
                            </div>
                          )}
                        </div>

                        <div className="Form-group">
                          <label htmlFor="date">Date</label>
                          <Field
                            type="date"
                            name="date"
                            className="Form-input-box"
                          />
                          {errors.date && touched.date && (
                            <div className="Form-error">{errors.date}</div>
                          )}
                        </div>

                        <div className="Form-group">
                          <label htmlFor="startTime">Start Time</label>
                          <Field
                            type="time"
                            name="startTime"
                            className="Form-input-box"
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
                            className="Form-input-box"
                          />
                          {errors.endTime && touched.endTime && (
                            <div className="Form-error">{errors.endTime}</div>
                          )}
                        </div>

                        <div className="Form-group">
                          <label htmlFor="invitationLink">
                            Invitation Link
                          </label>
                          <Field
                            type="text"
                            name="invitationLink"
                            className="Form-input-box"
                            placeholder="https://..."
                          />
                          {errors.invitationLink && touched.invitationLink && (
                            <div className="Form-error">
                              {errors.invitationLink}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="Button Button-color--teal-1000 Width--100 Margin-top--10"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <AsyncSubmit loading={isSubmitting} />
                          ) : (
                            "Create Event"
                          )}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenteeInformation;
