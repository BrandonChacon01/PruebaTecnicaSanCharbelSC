import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/users.routes.js";
import loginRoutes from "./routes/login.router.js";
import newsRoutes from "./routes/news.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", loginRoutes);
app.use("/api", newsRoutes);

export default app;