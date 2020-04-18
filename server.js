const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
var path = require("path");
var PORT = process.env.PORT || 8080;
var db = require("./models");

var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });



app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/workouts/", (req, res) => {
    db.Workout.find({})
      .populate("exercises")
      .then(dbWorkout => {
        console.log(dbWorkout)
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
});

app.get("/api/workouts/range/", (req, res) => {
    db.Workout.find({})
      .populate("exercises")
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      }); 
});
app.post("/api/workouts/", (req,res) => {
    db.Workout.create({ day: new Date().setDate(new Date().getDate()) })
    .then(dbWorkout => {
      console.log(dbWorkout);
      res.json(dbWorkout)
    })
    .catch(({ message }) => {
      console.log(message);
      res.json(err);
  });
});
app.put("/api/workouts/:id", (req, res) => {
    var post = req.body
    db.Exercise.create(post)
    .then(function(data){
        db.Workout.findOneAndUpdate({ _id: req.params.id},{$push: {"exercises": data}})
        .then(function(datum){
          res.json(datum)
        })
        .catch(err => {
            res.json(err);
        }); 
    })
    .catch(err => {
        res.json(err);
      }); 
});
app.get("/stats", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.get("/exercise", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});