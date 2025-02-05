const express = require("express")
const app = express()
const db = require("./config/db")
const mongoose = require("mongoose")

app.db = db
app.mongoose = mongoose

const middlewares = require("./config/middlewares")(app)
const routes = require("./config/routes")(app)
require("./config/mongodb")
require("./schedule/statsSchedule")(app)

app.listen(3000, () => {
    console.log("Backend executando!")
})