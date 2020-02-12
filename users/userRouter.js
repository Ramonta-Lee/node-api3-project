const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.post("/:id/posts", validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  Users.getById(id)
    .then(ids => {
      if (ids) {
        res.status(200).json(ids);
      } else {
        res.status(400).json({ message: "Invalid user auth" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Error writing Post to server." });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  Users.get(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the Users." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

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

router.put("/:id", (req, res) => {
  // do your magic!
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
  const posts = { ...req.body, user_id: id };
  Posts.insert(posts)
    .then(users =>
      !users & console.log(users)
        ? res.status(400).json({ error: "no user" })
        : !user.text
        ? res.status(400).json({ error: "missing name" })
        : (req.userpost = users) & next()
    )
    .catch(err => res.status(500).json(err.message));
}

module.exports = router;
