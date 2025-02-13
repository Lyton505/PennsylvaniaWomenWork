import React, { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import Navbar from "../components/Navbar"
import { api } from "../api"
import Modal from "../components/Modal"
import AsyncSubmit from "../components/AsyncSubmit"

const initialValues = {
  name: "",
  description: "",
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
})

const CreateWorkshop = () => {
  // Handle form submission
  const [isModal, setIsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [fileTitles, setFileTitles] = useState<string[]>([])
  const [fileAdded, setFileAdded] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<any[]>([])

  
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true)
    try {

      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (fileData) => {
          // Get pre-signed URL for the file
          console.log("File data:", fileData.file.name, fileData.file.type);
          const response = await api.get("/workshop/generate-presigned-url", {
            params: { fileName: fileData.file.name, fileType: fileData.file.type },
          });
  
          const { url, objectKey } = response.data;
  
          // Upload file to S3
          await fetch(url, {
            method: "PUT",
            body: fileData.file,
            headers: { "Content-Type": fileData.file.type },
          });
  
          // Return metadata to store in MongoDB
          return {
            title: fileData.title,
            description: fileData.description,
            objectKey, // Store only object key in database
          };
        })
      );

      const payload = {
        name: values.name,
        description: values.description,
        files: uploadedFiles, // TODO: Placeholder for S3 ID until set up
      }

      // await api.post("/api/create-workshop", payload)
      // // api.ts deals with error responses !
      // resetForm();
      // setSelectedFiles([]);
      // setFileTitles([]);
      // setFileAdded(false);

    } catch (error) {
      console.error("Error creating workshop:", error)
      alert("Failed to create workshop. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  
  const fileUploadInitialValues = {
    title: "",
    desc: "",
    file: "",
  }
  const fileValidation = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Description is required"),
    file: Yup.mixed().required("Please select a file"),
  })

  const handleFileSumbit = async (values: any, { resetForm, setFieldValue }: any) => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const { title, desc, file } = values;
      if (!file) {
        setErrorMessage("No file selected.");
        setIsLoading(false);
        return;
      }

      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        { title, description: desc, file },
      ]);

      console.log("File selected:", file.name, file.type);

      setFileTitles((prevTitles) => [...prevTitles, values.title])
      setFileAdded(true)
      console.log("Submitting data:")
      console.log("File:", file)
      setSuccess(true)
      setErrorMessage("")
      resetForm()
      setFieldValue("file", null)
    } catch (error) {
      console.error("Error submitting:", error)
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
              validationSchema={fileValidation}
              onSubmit={handleFileSumbit}
            >
              {({ setFieldValue, errors, touched, isSubmitting }) => (
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
                      className="Form-input-box text-area"
                      type="text"
                      id="desc"
                      name="desc"
                      rows="4"
                    />
                    {errors.desc && touched.desc && (
                      <div className="Form-error">{errors.desc}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="file">Files</label>
                    <input
                      className="Form-input-box"
                      type="file"
                      id="file"
                      name="file"
                      onChange={(event) =>{
                        if (event.currentTarget.files){
                          const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                        }
                      }}
                    />
                    {errors.file && touched.file && (
                      <div className="Form-error">{errors.file}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="Button Margin-top--10 Button-color--teal-1000 Width--100"
                    disabled={
                      Object.keys(errors).length > 0 ||
                      !Object.keys(touched).length ||
                      isSubmitting
                    }
                    // Disable button if there are errors or no fields are touched or form is submitting
                  >
                    {isSubmitting ? (
                      <AsyncSubmit loading={isLoading} />
                    ) : (
                      "Upload Files"
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

      <div className="Block Width--70 Margin-right--80 Margin-left--80 Margin-top--40">
        <div
          className="Flex-row Margin-bottom--40 Margin-left--40 Margin-right--100 Margin-top--30 Text-color--teal-1000 Text-fontSize--30"
          style={{
            borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
            paddingBottom: "10px",
          }}
        >
          Create Workshop
        </div>
        <div className="Margin-left--40 Margin-right--40">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="Margin-bottom--30">
                  <div className="Form-group">
                    <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                      <div className="name">Workshop Name:</div>
                    </div>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="Form-input-box"
                    />
                    {/* Display error message if name field is invalid */}
                    {errors.name && touched.name && (
                      <div className="Form-error">{errors.name}</div>
                    )}
                  </div>
                </div>

                <div className="Margin-bottom--20">
                  <div className="Form-group">
                    <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                      <div className="description">Workshop Description:</div>
                    </div>
                    <Field
                      type="text"
                      name="description"
                      placeholder="Description"
                      className="Form-input-box"
                    />
                    {/* Display error message if description field is invalid */}
                    {errors.description && touched.description && (
                      <div className="Form-error">{errors.description}</div>
                    )}
                  </div>
                </div>
                {fileAdded && (
                  <div>
                    <div className="Flex-row Text-fontSize--16 Margin-bottom--8">
                      <div className="description">Files:</div>
                    </div>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="Flex-row Justify-content--center Margin-top--30">
                  <button
                    type="button"
                    className="Button Button-color--teal-1000 Width--50 Margin-right--10"
                    onClick={() => setIsModal(true)}
                  >
                    Add Files
                  </button>
                  <button
                    type="submit"
                    className="Button Button-color--teal-1000 Width--50 Button--hollow"
                    disabled={isSubmitting} // Disable button while form is submitting
                  >
                    {isSubmitting ? (
                      <AsyncSubmit loading={isSubmitting} />
                    ) : (
                      "Create Workshop"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default CreateWorkshop
