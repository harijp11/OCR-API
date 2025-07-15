import { Schema, model, Model } from "mongoose";
import { IAadhar } from "../model/adhaar-model";

const aadharSchema = new Schema<IAadhar>(
  {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    fatherName: { type: String },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    pinCode: { type: String, required: true },
  },
  { timestamps: true }
);

export const AadharModel: Model<IAadhar> = model<IAadhar>("Aadhar", aadharSchema);
