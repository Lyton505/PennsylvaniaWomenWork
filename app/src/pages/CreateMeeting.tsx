import React from "react";
import { Formik, Form, Field } from "formik";
import Navbar from "../components/Navbar";
import * as Yup from "yup";
import { api } from "../api"; // Ensure this points to your configured API instance

interface RoleType {
  id: string;
  label: string;
}

interface FormValues {
  meeting: string;
  notes: string;
  role: string[]; // Array of role IDs
}

const roles = [
  { id: "mentor", label: "Mentor" },
  { id: "mentee", label: "Mentee" },
  { id: "board", label: "Board" },
  { id: "staff", label: "Staff" },
];

const initialValues = {
  meeting: "",
  notes: "",
  role: [] as string[],
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  meeting: Yup.string().required("Meeting name is required"),
  notes: Yup.string().required("Meeting notes are required"),
  role: Yup.array().min(1, "Must assign meeting to at least one role"),
});

const CreateMeeting = () => {
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm}: any
  ) => {
    setSubmitting(true);
    try {
      const payload = {
        username: "sample-username", // TODO: Replace with the logged-in user's username
        meeting: values.meeting,
        notes: values.notes,
        role: values.role,
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
      <div className="Flex-column Align-items--center Margin-top--40">
        <div className="Block Create-block">
          <div className="Block-header">Create Meeting</div>
          <div className="Block-subtitle">Add a new meeting</div>
          <div className="Block-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, isSubmitting, setFieldValue }) => (
                <Form>
                  <div className="Margin-bottom--30">
                    <div className="Form-group">
                      <label htmlFor="name">Meeting Name</label>
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
                  </div>

                  <div className="Margin-bottom--30">
                    <div className="Form-group">
                      <label htmlFor="name">Notes:</label>
                      <Field
                        type="text"
                        name="meeting"
                        className="Form-input-box"
                        placeholder="Enter meeting notes"
                      />
                      {errors.meeting && touched.meeting && (
                        <div className="Form-error">{errors.meeting}</div>
                      )}
                    </div>
                  </div>

                  <div className="Margin-bottom--20">
                    <div className="Form-group">
                      <label className="description">Roles:</label>
                      <div className="Role-tags">
                        {roles.map((role) => (
                          <div key={role.id} className="Role-tag-item">
                            <input
                              type="checkbox"
                              id={`role-${role.id}`}
                              name={`role-${role.id}`}
                              className="Role-tag-input"
                              checked={values.role.includes(role.id)}
                              onChange={() => {
                                // Check if the role is already selected
                                const isSelected = values.role.includes(
                                  role.id
                                );

                                if (isSelected) {
                                  // If already selected, remove it from the array
                                  const newRoles = values.role.filter(
                                    (r) => r !== role.id
                                  );
                                  setFieldValue("role", newRoles);
                                } else {
                                  // If not selected, add it to the array
                                  setFieldValue("role", [
                                    ...values.role,
                                    role.id,
                                  ]);
                                }
                              }}
                            />
                            <label
                              htmlFor={`role-${role.id}`}
                              className="Role-tag-label"
                            >
                              {role.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.role && touched.role && (
                        <div className="Form-error">{errors.role}</div>
                      )}
                    </div>
                  </div>

                  <div className="Selected-roles">
                    {values.role.length > 0 ? (
                      <>Selected roles: {values.role.map(r => {
                        const role = roles.find(role => role.id === r);
                        return role ? role.label : r;
                      }).join(', ')}</>
                    ) : (
                      'No roles selected'
                    )}
                  </div>

                  <div className="Flex-row Justify-content--center">
                    <button
                      type="submit"
                      className="Button Button-color--blue-1000 Width--100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Create Meeting"}
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
