import React from "react";
import { Formik, Form, Field } from "formik";
import Navbar from "../components/Navbar";
import * as Yup from "yup";
import { api } from "../api"; // Ensure this points to your configured API instance

interface CreateMeetingFormValues {
  username: string;
  meeting: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarLink: string;
  inviteeIds: string[];  
}
const initialValues: CreateMeetingFormValues = {
  username: "",
  meeting: "",
  notes: "",
  date: "",
  startTime: "",
  endTime: "",
  calendarLink: "",
  inviteeIds: [],
};

// Validation schema using Yup

const validationSchema = Yup.object().shape({
  meeting: Yup.string().required("Meeting name is required"),
  notes: Yup.string().required("Meeting notes are required"),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test("is-after-start", "End time must be after start time", function (endTime) {
      const { startTime } = this.parent;
      return !startTime || !endTime || startTime < endTime;
    }),
  calendarLink: Yup.string().url("Must be a valid URL").required("Calendar link is required"),
  //menteeIds: Yup.array().min(1, "Select at least one mentee"),
});

const CreateMeeting = () => {
  const handleSubmit = async (
    values: CreateMeetingFormValues,
    { setSubmitting, resetForm }: any,
  ) => {
    setSubmitting(true);
    try {
      const baseDate = new Date(values.date);
      
      const [startHours, startMinutes] = values.startTime.split(':');
      const startDateTime = new Date(baseDate);
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));
      
      const [endHours, endMinutes] = values.endTime.split(':');
      const endDateTime = new Date(baseDate);
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

      const payload = {
        username: "sample-username", // TODO: Replace with the logged-in user's username
        meeting: values.meeting,
        notes: values.notes,
        date: baseDate.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        inviteeIds: values.inviteeIds,
        calendarLink: values.calendarLink,
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
      <div className="Flex-column Align-items--center Margin-top--20">
        <div className="Block Create-block">
          <div className="Block-header">Create Meeting</div>
          <div className="Block-subtitle">Add a new meeting</div>
          <div className="Block-body">
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
                      className="Form-input-box"
                      placeholder="Enter meeting name"
                    />
                    {errors.meeting && touched.meeting && (
                      <div className="Form-error">{errors.meeting}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="notes">Notes</label>
                    <Field
                      as="textarea"
                      name="notes"
                      className="Form-input-box"
                      placeholder="Enter meeting notes"
                      style={{
                        fontFamily: 'inherit'
                      }}
                    />
                    {errors.notes && touched.notes && (
                      <div className="Form-error">{errors.notes}</div>
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
                    <label htmlFor="inviteeIds">Invited Mentees</label>
                    <Field
                      as="select"
                      name="inviteeIds"
                      className="Form-input-box"
                      multiple={true}
                      style={{
                        fontFamily: 'inherit',
                        color: 'var(--color-grey-1000)',
                      }}
                    >
                      <option value="1">Mentee 1</option>
                      <option value="2">Mentee 2</option>
                      <option value="3">Mentee 3</option>
                      <option value="4">Mentee 4</option>
                    </Field>
                    {errors.inviteeIds && touched.inviteeIds && (
                      <div className="Form-error">{errors.inviteeIds}</div>
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
      </div>
    </>
  );
};

export default CreateMeeting;

