import React from "react";
import { Formik, Form, Field } from "formik";
import Navbar from "../components/Navbar";
import * as Yup from "yup";
import { api } from "../api"; // Ensure this points to your configured API instance

const initialValues = {
  meeting: "",
  notes: "",
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  meeting: Yup.string().required("Meeting name is required"),
  notes: Yup.string().required("Meeting notes are required"),
});

const CreateMeeting = () => {
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any,
  ) => {
    setSubmitting(true);
    try {
      const payload = {
        username: "sample-username", // TODO: Replace with the logged-in user's username
        meeting: values.meeting,
        notes: values.notes,
      };

      console.log("Submitting payload:", payload); // Debugging log

      await api.post("/user/add-meeting", payload);

      alert("Meeting added successfully!");

      resetForm(); // Clear the form after successful submission
    } catch (error) {
      console.error("Error adding meeting:", error);
      alert("Failed to add meeting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <h1>Create Meeting</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="Form-group">
              <label htmlFor="meeting">Meeting Name</label>
              <Field
                type="text"
                name="meeting"
                placeholder="Meeting Name"
                className="Form-input-box"
              />
              {errors.meeting && touched.meeting && (
                <div className="Form-error">{errors.meeting}</div>
              )}
            </div>

            <div className="Form-group">
              <label htmlFor="notes">Notes</label>
              <Field
                type="text"
                name="notes"
                placeholder="Notes"
                className="Form-input-box"
              />
              {errors.notes && touched.notes && (
                <div className="Form-error">{errors.notes}</div>
              )}
            </div>

            <button
              type="submit"
              className="Button Button-color--dark-1000 Width--100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create Meeting"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateMeeting;
