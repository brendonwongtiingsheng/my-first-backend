const express = require ("express");
const app = express();

app.use(express.json());

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