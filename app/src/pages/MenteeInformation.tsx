import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { api } from "../api";
import { useUser } from "../contexts/UserContext";
import { tier1Roles, tier2Roles, tier3Roles } from "../utils/roles";

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
    { setSubmitting }: any,
  ) => {
    try {
      console.log(values);
      setIsModal(false);
    } catch (error) {
      console.error("Error assigning course:", error);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className="Block Margin-right--40 Margin-left--40 Margin-top--40">
        <div className="Width--60 Margin-top--40 Margin-left--60">
        <div onClick={() => navigate("/home")} className="Chevron">
          <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
        </div>

        <div className="Flex-row Margin-bottom--40 Margin-top--30 ">
              <div>
                <div className="Text--title Margin-bottom--6">
                  {mentee?.firstName} {mentee?.lastName}
                </div>
                <div className="Text--subtitle">
                  {mentee?.role}
                </div>
              </div>
            </div>

      
        <div className="Flex-row Margin-bottom--60">
              <div className="Text--subtitle">
                Information
              </div>
        </div>

        <div>
          <div>
            <div className="Flex-row Margin-bottom--24 Justify-content--spaceBetween Width--50">
                  {["Workshops", "Meetings"].map((tab) => (
                    <div
                      key={tab}
                      className ={`Text-fontSize--16 Tabs__tab ${activeTab === tab ? 'Tabs__tab--active' : ''}`}
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
                    mentee.workshops.map((workshop: string, index: number) => (
                      <div key={index} className="Flex-row Text--body Margin-bottom--20 Align-items--center">
                        <div className="Course-list-bullet" />
                        {workshop}
                      </div>
                    ))
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
                            <div className="Form-error">{errors.startDate}</div>
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
              <div
                className="Header"
              >
                Upcoming
              </div>
                <div className="Flex-row Margin-bottom--10 Margin-left--60">
                  <div
                    className="Margin-right--40 Width--40px Text-align--center"
                  >
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
                      navigate("/create-meeting")
                    }}
                  >
                    Add New Meeting Notes
                  </div>
                </div>
              <div
                className="Header"
              >
                Past
              </div>
                <div className="Flex-row Margin-bottom--10 Margin-left--60">
                  <div
                    className="Margin-right--40 Width--40px Text-align--center"
                  >
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

          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default MenteeInformation;
