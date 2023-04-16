//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res) {
    Article.find().then((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    console.log(req.body.title);
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save().then(err => {
        if (!err){
            res.send("Successly added a new article!");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany().then(err => {
        if (!err){
            res.send("Successly deleted all articles!");
        } else {
            res.send(err);
        }
    });
});


app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne(
        {title: req.params.articleTitle}).then( (err, foundArticle) => {
        if(!err) {
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No articles found.")
            }
        }
        else {
            res.send(err);
        }
    })
})

.put(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
    ).then( err => {
        if(!err) {
            res.send("Updated article!");
        } else {
            res.send(err);
        }
    });
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then( err => {
        if(!err) {
            res.send("Updated article!");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}).then(err => {
        if (!err){
            res.send("Successly deleted the article!");
        } else {
            res.send(err);
        }
    });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
