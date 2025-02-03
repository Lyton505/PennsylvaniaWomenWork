// NO POPULATE VERSION

import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

// Generate pre-signed URL for file upload
export const generatePresignedUrl = async (req: Request, res: Response) => {
  const { fileName, fileType } = req.query;

  if (!fileName || !fileType) {
    return res.status(400).json({ message: "fileName and fileType are required" });
  }

  const objectKey = `uploads/${Date.now()}-${fileName}`; // Generate a unique file key
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    ContentType: fileType,
    Expires: 60 * 5, // URL expires in 5 minutes
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    res.json({ url, objectKey }); // Send both URL and object key
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ message: "Failed to generate pre-signed URL", error });
  }
};


export const createWorkshop = async (req: Request, res: Response) => {
  try {
    const { mentorId, menteeId, textContent, files } = req.body;

    const uploadedFiles = files.map((file: { title: string; description: string; objectKey: string }) => ({
      title: file.title,
      description: file.description,
      objectKey: file.objectKey, // Store only the S3 object key
    }));

    const newWorkshop = new Workshop({
      mentor: mentorId,
      mentee: menteeId,
      textContent,
      files: uploadedFiles,
    });


    const savedWorkshop = await newWorkshop.save();
    res.status(201).json(savedWorkshop);
  } catch (error) {
    res.status(500).json({ message: "Error creating workshop", error });
  }
};

// TODO: convert obj keys to URLs if bucket is public
export const getWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshop", error });
  }
};

export const getWorkshopsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const workshops = await Workshop.find({
      $or: [{ mentor: userId }, { mentee: userId }],
    });

    if (workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshops found for this user" });
    }

    res.status(200).json(workshops);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshops", error });
  }
};

// POPULATE VERSION (if details of mentor/mentee objects are needed on the frontend like name or picture)

// import { Request, Response } from 'express';
// import { Workshop } from '../model/Workshop';

// export const createWorkshop = async (req: Request, res: Response) => {
//     try {
//         const { mentorId, menteeId, textContent } = req.body;

//         const newWorkshop = new Workshop({
//             mentor: mentorId,
//             mentee: menteeId,
//             textContent,
//         });

//         const savedWorkshop = await newWorkshop.save();
//         res.status(201).json(savedWorkshop);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating workshop', error });
//     }
// };

// export const getWorkshop = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const workshop = await Workshop.findById(id)
//             .populate('mentor')    // Populate full user details for mentor
//             .populate('mentee');   // Populate full user details for mentee

//         if (!workshop) {
//             return res.status(404).json({ message: 'Workshop not found' });
//         }

//         res.status(200).json(workshop);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving workshop', error });
//     }
// };
