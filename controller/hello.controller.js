exports.sayHello = (req, res) => {
    res.json({
        message: "Hello from Controller",
        time: new Date().toISOString(),
    });
};

exports.sayHelloToPerson = (req, res) => {
  const { name } = req.params;
  res.json({
    message: `Hello, ${name}!`,
  });
};