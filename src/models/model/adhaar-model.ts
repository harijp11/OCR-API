import { Document } from "mongoose";

export interface IAadhar extends Document {
  name: string;
  dob: string;
  fatherName?: string;
  gender: string;
  address: string;
  aadharNumber: string;
  pinCode: string;
  createdAt: Date;
  updatedAt: Date;
}