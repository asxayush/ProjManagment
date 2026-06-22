import dotenv from "dotenv"
import app from "./app.js"
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import connectDB from "./db/index.js"

dotenv.config({
    path: "./.env"
})



const port = process.env.PORT || 3000


connectDB()
.then(() => {
  app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

})
.catch((err) => {
  console.error("MONGODB CONNECTION ERROR", err);
  process.exit(1)
  
})

