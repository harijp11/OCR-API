import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI || "",
  BASE_URL: process.env.BASE_URL || "",
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || "",
};
