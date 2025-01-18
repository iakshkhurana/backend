// jwt auth app
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json()); //for middlewares
const JWT_SECRET = "dontrevealsecret";
function logger(req,res,next){
    console.log('${req.method} request came');
    next();
}
app.post("/signup",logger,function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    if(users.find((user)=>user.username==username)){
        return res.json({
            message:"You are already signed up!",
        });
    }
    if(username.length<5){
        return res.json({
            message:"You should have atleast 5 letters to sign up",
        })
    }
    users.push({
        username:username,
        password:password,
    });
    res.json({
        message:"You are signed up successfully",
    });
});

app.post("/signin",logger,function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = users.find((user)=>user.username ===username && user.password === password);
    if(foundUser){
        const token=jwt.sign({
            username, //username: foundUser.username,
        },JWT_SECRET)
    }
    else{
        return res.json({
            message:"Invalid username or password!",
        });
    }
});

function auth(req,res,next){
    const token = req.headers.authorization;
    if(!token){
        return res.json({
            message: "Token is missing!",
        });
    }
    try{
        const decodedData=jwt.verify(token,JWT_SECRET);
        req.username = decodedData.username;
        next();
    }
    catch(error){
        return res.json({
            message:"Invalid token!",
        });
    }
}

app.get("/me", logger, auth, function (req, res) {
    // Get the current user from the request object
    const currentUser = req.username;

    // Find the user in the users array with the given username
    const foundUser = users.find((user) => user.username === currentUser);

    // Check if the user is found or not
    if (foundUser) {
        // Send a response to the client with the username and password of the user
        return res.json({
            username: foundUser.username,
            password: foundUser.password,
        });
    } else {
        // Send a response to the client that the user is not found
        return res.json({
            message: "User not found!",
        });
    }
});

app.listen(3000);