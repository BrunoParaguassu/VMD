const express = require("express")
const { signUp, validateSignUp } = require("./signUp")
 
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post("/cadastrar", validateSignUp, signUp)

app.listen(1234, () => {
    console.log("API está online...")
})
