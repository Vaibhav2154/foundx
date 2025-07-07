import dotenv from "dotenv";
dotenv.config({ path : "./.env" });
import connectDB from "./db/index.js";
import app from "./app.js";


connectDB()
.then(() => {app.listen(8000, () => console.log(`Server is running on port 8000`));})
.catch((err) => console.log(`Failed to connect to server${err.message}`));