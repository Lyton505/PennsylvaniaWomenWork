import React, { useState } from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import Navbar from "../components/Navbar"
import * as Yup from "yup"
import Modal from "../components/Modal"
import AsyncSubmit from "../components/AsyncSubmit"

const CreateWorkshop = () => {
    const initialValues = {
        name: "",
        description: "",
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
    })
    const handleSubmit = (values: any) => {
        console.log(values)
    }
    const [isModal, setIsModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const fileUploadInitialValues = {
        title: "",
        desc: "",        
        file: "",
    }
    const fileValidation = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        desc: Yup.string().required("Description is required"),
        file: Yup.mixed().required("Please select a file")
    })
    
    const handleFileSumbit = async (values: any, { resetForm }: any) => {
        setIsLoading(true)
        setErrorMessage("") // Clear error message at the start of submission
    
        try {
            // Package the final data to submit
            const finalData = {
            item: values.item,
            }
    
          console.log("Submitting data:", finalData)
          setSuccess(true)
          setErrorMessage("") // Ensure error message is cleared on success
          resetForm()
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
                {({ values, errors, touched, isSubmitting }) => (
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
        <h1>Create Workshop</h1>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, isSubmitting }) => (
                <Form>
                    <div className="Form-group">
                        <label htmlFor="name">Name</label>
                        <Field 
                            type="text" 
                            name="name" 
                            placeholder="Name" 
                            className="Form-input-box"
                        />
                    </div>
                    <div className="Form-group">
                        <label htmlFor="description">Description</label>
                        <Field 
                            type="text" 
                            name="description" 
                            placeholder="Description" 
                            className="Form-input-box"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="Button Button-color--dark-1000 Width--100"
                    >
                        Create Workshop
                    </button>
                </Form>
            )}
        </Formik>
        <div
            onClick={() => {
                setIsModal(true)
            }}
            className="Button Button-color--dark-1000 Margin-top--10"
        >
            Add New Files
        </div>
      </>
    )
  }
  
  export default CreateWorkshop