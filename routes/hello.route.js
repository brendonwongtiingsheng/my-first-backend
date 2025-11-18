const express = require("express")
const router = express.Router();

const { sayHello, sayHelloToPerson} = require ("../controller/hello.controller")

router.get("/", sayHello)

router.get("/:name", sayHelloToPerson);

module.exports = router;