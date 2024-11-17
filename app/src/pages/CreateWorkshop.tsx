import React, { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import AsyncSubmit from "../components/AsyncSubmit"

const CreateWorkshop = () => {
  const [isModal, setIsModal] = useState(false)
  const [fileTitles, setFileTitles] = useState<string[]>([])
  const [fileAdded, setFileAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const initialValues = {
    name: "",
    description: "",
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  })

  const handleSubmit = (values: any) => {
    console.log("Workshop values:", values)
  }

  const fileUploadInitialValues = {
    title: "",
    desc: "",
    file: "",
  }

  const fileValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Description is required"),
    file: Yup.mixed().required("Please select a file"),
  })

  const handleFileSubmit = async (values: any, { resetForm }: any) => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const finalData = {
        title: values.title,
        desc: values.desc,
        file: values.file,
      }
      setFileTitles((prev) => [...prev, values.title])
      setFileAdded(true)
      console.log("File submitted:", finalData)
      setSuccess(true)
      resetForm()
    } catch (error) {
      setErrorMessage("Error uploading file.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isModal && (
        <Modal
          header="Add New Files"
          subheader="Select Files to Upload"
          action={() => setIsModal(false)}
          body={
            <Formik
              initialValues={fileUploadInitialValues}
              validationSchema={fileValidationSchema}
              onSubmit={handleFileSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="title">Title</label>
                    <Field
                      className="Form-input-box"
                      type="text"
                      id="title"
                      name="title"
                    />
                    {errors.title && touched.title && (
                      <div className="Form-error">{errors.title}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="desc">Description</label>
                    <Field
                      as="textarea"
                      className="Form-input-box"
                      id="desc"
                      name="desc"
                      rows="4"
                    />
                    {errors.desc && touched.desc && (
                      <div className="Form-error">{errors.desc}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="file">File</label>
                    <Field
                      className="Form-input-box"
                      type="file"
                      id="file"
                      name="file"
                    />
                    {errors.file && touched.file && (
                      <div className="Form-error">{errors.file}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="Button Button-color--dark-1000 Width--100"
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                  >
                    {isSubmitting ? (
                      <AsyncSubmit loading={isLoading} />
                    ) : (
                      "Upload File"
                    )}
                  </button>

                  {errorMessage && (
                    <div className="Form-error">{errorMessage}</div>
                  )}
                  {success && (
                    <div className="Form-success">
                      File uploaded successfully!
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          }
        />
      )}

      <Navbar />
      <h1>Create Workshop</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="Form-group">
              <label htmlFor="name">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="Form-input-box"
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
                placeholder="Description"
                className="Form-input-box"
              />
              {errors.description && touched.description && (
                <div className="Form-error">{errors.description}</div>
              )}
            </div>

            {fileAdded && (
              <div>
                <h3>Uploaded Files:</h3>
                <ul>
                  {fileTitles.map((title, index) => (
                    <li key={index}>{title}</li>
                  ))}
                </ul>
              </div>
            )}

            <div
              onClick={() => setIsModal(true)}
              className="Button Button-color--dark-1000 Margin-top--10"
            >
              Add New Files
            </div>

            <button
              type="submit"
              className="Button Button-color--dark-1000 Width--100 Margin-top--10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create Workshop"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default CreateWorkshop
