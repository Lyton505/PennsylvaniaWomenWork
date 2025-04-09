import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: {
    name: string;
    description: string;
    role: string;
    tags: string[];
  };
  allTags: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  role: Yup.string().required("Audience is required"),
  tags: Yup.array().of(Yup.string()),
});

const roles = [
  { id: "mentee", label: "Participant" },
  { id: "mentor", label: "Volunteer" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
];

const EditFolderModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  allTags,
}: EditFolderModalProps) => {
  return (
    <Modal
      header="Edit Folder"
      subheader="Update details of this folder"
      action={onClose}
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="Form-group">
                <label htmlFor="name">Folder Name:</label>
                <Field
                  type="text"
                  name="name"
                  className="Form-input-box"
                  placeholder="Enter folder name"
                />
                {errors.name && touched.name && (
                  <div className="Form-error">{errors.name}</div>
                )}
              </div>

              <div className="Form-group">
                <label htmlFor="description">Description:</label>
                <Field
                  as="textarea"
                  name="description"
                  className="Form-input-box text-area"
                  placeholder="Enter event description"
                  rows={4}
                />
                {errors.description && touched.description && (
                  <div className="Form-error">{errors.description}</div>
                )}
              </div>

              <div className="Form-group">
                <label>Audience:</label>
                <div className="Role-tags">
                  {roles.map((role) => (
                    <div key={role.id} className="Role-tag-item">
                      <input
                        type="radio"
                        id={`role-${role.id}`}
                        name="role"
                        className="Role-tag-input"
                        checked={values.role === role.id}
                        onChange={() => setFieldValue("role", role.id)}
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

              <div className="Form-group">
                <label>Tags:</label>
                <CreatableSelect
                  components={animatedComponents}
                  isMulti
                  options={allTags.map((tag) => ({ label: tag, value: tag }))}
                  value={values.tags.map((tag) => ({ label: tag, value: tag }))}
                  onChange={(selectedOptions: any) =>
                    setFieldValue(
                      "tags",
                      selectedOptions.map((opt: any) => opt.value),
                    )
                  }
                  onCreateOption={(inputValue: string) => {
                    const trimmed = inputValue.trim();
                    if (!trimmed) return;
                    if (!values.tags.includes(trimmed)) {
                      setFieldValue("tags", [...values.tags, trimmed]);
                    }
                  }}
                  placeholder="Edit tags..."
                  isClearable
                  isSearchable
                />
              </div>

              <button
                type="submit"
                className="Button Button-color--blue-1000 Width--100"
              >
                Save Changes
              </button>
            </Form>
          )}
        </Formik>
      }
    />
  );
};

export default EditFolderModal;
