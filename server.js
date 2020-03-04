// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs")
const data = require("./db/db.json")

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// api routes
app.get("/api/notes", function (req, res) {
  res.json(data)
});

// post
app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  let id;
  if (!data.length) id = 1
  else id = data[data.length - 1].id + 1;

  newNote.id = id;
  data.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(data), function (err) {
    if (err) throw err;
  
  res.json(data);
  })
});
// Delete
app.delete("/api/notes/:id", (req, res) =>{
  const deleteID = req.params.id
  const index = data.findIndex(note => note.id === parseInt(deleteID))
  data.splice(index, 1)
  fs.writeFile("./db/db.json", JSON.stringify(data), err => {
    if(err) {
      throw err
    }
    res.json(data);
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
