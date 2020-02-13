const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDb");

const router = express.Router();

// POST Requests:

// This validates the user and checks to see if there is a name property then adds the user and includes an id
router.post("/", validateUser, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

// This validates a users post by checking to see if it has a text property, then assigns it a post_ID and attaches it to that user's ID
router.post("/:id/posts", validatePost, (req, res) => {
  // do your magic!
  res.status(200).json(req.userposts);
});

// GET Requests:


// This gets a list of users and has a name and ID property
router.get("/", (req, res) => {
  // do your magic!
  Users.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the Users." });
    });
});


// This gets a user by their ID after validating that the ID exists.
router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

// This gets a user's posts after validating their ID and that they exist. Returns an empty array if there are no posts
router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Unable to retrieve posts" });
    });
});

// DELETE Requests:

// This deletes a user by finding their user ID
router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(post => {
      res.status(200).json({ message: "The User has been deleted" });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed"
      });
    });
});

// PUT Requests

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  const {id} = req.params;
  const changes = req.body
  if(!changes.name) {
    res.status(400).json({message: "Need to update the user name."})
  }
  else {
    Users.update(id, changes).then(update => {
      if (update){
        res.status(200).json(update)
      }
      else {
        res.status(404).json({message: "The user with the specified ID does not exist."})
      }
    }).catch(error => {
      console.log(error);
      res.status(500).json({error: "Failed to update User name"})
    })
  }
  
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  console.log(id);
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ error: "Invalid user ID." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Server error validating user ID" });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body;
  Users.insert(user)
    .then(users =>
      !users
        ? res.status(400).json({ error: "no user" })
        : !user.name
        ? res.status(400).json({ error: "invalid name" })
        : (req.users = users) & next()
    )
    .catch(error => {
      res.status(500).json({ error: "Error adding User" });
    });
}

function validatePost(req, res, next) {
  // do your magic!
  const { id } = req.params;
  const user = { ...req.body, user_id: id };
  Posts.insert(user)
    .then(users =>
      !users & console.log(users)
        ? res.status(400).json({ error: "no user" })
        : !user.text
        ? res.status(400).json({ message: "missing post data" })
        : (req.userpost = users) & console.log(users, "TEST") & next()
    )
    .catch(err => res.status(500).json({ error: "error" }));
}

module.exports = router;
