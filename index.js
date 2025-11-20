const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // React 前端
}));


const PORT = process.env.PORT || 3000;

const helloRoutes = require("./routes/hello.route");
const userRoutes = require("./routes/users.route");
const authRoutes = require("./routes/auth.route");
const stocksRoutes = require('./routes/stocks.route');

app.use("/hello", helloRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use('/stocks', stocksRoutes);

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});