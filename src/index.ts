import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import { ENV } from "./config/env";
import cors from "cors";
import morgan from "morgan"
import router from "./routes/routes";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit"
const app = express();
const PORT = ENV.PORT || 7000;

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGIN || "http://localhost:5173").split(',').map(o => o.trim()).filter(Boolean);
connectDB()
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by cors"))
        }
    },
    credentials: true
}))
app.use(morgan("dev"))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use("/api", router)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
