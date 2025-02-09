import React from "react"
import Modal from "./Modal"
import { Formik, Form, Field, FormikHelpers } from "formik"
import * as yup from "yup"

// Define the shape of our form values
interface CreateEventFormValues {
  name: string
  description: string
  date: string
  startTime: string
  endTime: string
  invitationLink: string
}

// Initial form values
const initialValues: CreateEventFormValues = {
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

// Define props for our modal component
interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
}) => {
  // The function that handles form submission
  const handleSubmit = async (
    values: CreateEventFormValues,
    { setSubmitting, resetForm }: FormikHelpers<CreateEventFormValues>
  ) => {
    try {
      // TODO: Replace with your own event creation logic
      console.log("Event created with values:", values)

      // Optionally reset the form after submit
      resetForm()
      // Close the modal after successful creation
      onClose()
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // If `isOpen` is false, don't render anything
  if (!isOpen) {
    return null
  }

  return (
    <Modal
      header="Create New Event"
      subheader="Add event information"
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                  <div className="Form-error">{errors.description}</div>
                )}
              </div>

              <div className="Form-group">
                <label htmlFor="date">Date</label>
                <Field type="date" name="date" className="Form-input-box" />
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
                <Field type="time" name="endTime" className="Form-input-box" />
                {errors.endTime && touched.endTime && (
                  <div className="Form-error">{errors.endTime}</div>
                )}
              </div>

              <div className="Form-group">
                <label htmlFor="invitationLink">Invitation Link</label>
                <Field
                  type="text"
                  name="invitationLink"
                  className="Form-input-box"
                  placeholder="https://..."
                />
                {errors.invitationLink && touched.invitationLink && (
                  <div className="Form-error">{errors.invitationLink}</div>
                )}
              </div>

              <button
                type="submit"
                className="Button Button-color--blue-1000 Width--100 Margin-top--10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </Form>
          )}
        </Formik>
      }
      action={onClose}
    />
  )
}

export default CreateEventModal
