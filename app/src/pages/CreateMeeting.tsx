import React, { useState } from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import Navbar from "../components/Navbar"
import * as Yup from "yup"

const CreateMeeting = () => {
    const initialValues = {
        meeting: "",
        notes: "",
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Meeting is required"),
        description: Yup.string().required("Notes are required"),
    })
    const handleSubmit = (values: any) => {
        console.log(values)
    }
    return (
      <>
        <Navbar />
        <h1>Create Meeting</h1>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, isSubmitting }) => (
                <Form>
                    <div className="Form-group">
                        <label htmlFor="name">Meeting</label>
                        <Field 
                            type="text" 
                            name="meeting" 
                            placeholder="Meeting" 
                            className="Form-input-box"
                        />
                    </div>
                    <div className="Form-group">
                        <label htmlFor="notes">Notes</label>
                        <Field 
                            type="text" 
                            name="notes" 
                            placeholder="Notes" 
                            className="Form-input-box"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="Button Button-color--dark-1000 Width--100"
                    >
                        Create Meeting
                    </button>
                </Form>
            )}
        </Formik>
      </>
    )
  }
  
  export default CreateMeeting