import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3000;



const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB()
    .catch((err) =>{
        console.log("MongoDB connection failed",err);
        process.exit(1);

    });


httpServer.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
});