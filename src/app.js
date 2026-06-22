import express from "express";
import cors from "cors";

const app = express()

//BASIC CONFIGURATION
app.use(express.json({limit: "16kb"})) // backend accepts data with limit
app.use(express.urlencoded({extended: true, limit: "16kb"})) // user can send some data with url
app.use(express.static("public"))

//CORS CONFIG
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]

}))

// import the routes
import healthCheckRouter from "./routes/healthcheck.route.js"

app.use("/api/v1/healthcheck", healthCheckRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})


export default app
