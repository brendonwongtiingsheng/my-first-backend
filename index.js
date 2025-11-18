const express = require ("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const helloRoutes = require("./routes/hello.route");
const userRoutes = require("./routes/users.route");
const authRoutes = require("./routes/auth.route");
const stocksRoutes = require('./routes/stocks.route');

app.use("/hello", helloRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use('/stocks', stocksRoutes);

app.listen(PORT, () => {
    console.log('Server running at http://localhost:${PORT}');
})