const express = require("express");
const Posts = require("./data/db.js");

const router = express.Router();

module.exports = router;

////// GET //////
router.get("/api/posts", (req, res) => {
  //console.log("REQ.QUERY: ", req.query);
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});

router.get("/api/posts/:id", (req, res) => {
  //console.log(req.params);
  Posts.findById(req.params.id)
    .then((post) => {
      console.log("POST RETURN", post);
      if (!post.length) {
        //console.log("AGH: ", post);
        res
          .status(404)
          .json({ message: "Post with specified ID does not exist." });
      } else if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error retrieving the post",
      });
    });
});

// #region
// router.get("/api/posts/:id", (req, res) => {
//   Posts.findById(req.params.id)
//     .then((post) => {
//       if (!req.params.id) {
//         res.status(404).json({
//           message: "Post with specified ID for the comments does not exist.",
//         });
//       } else if (post) {
//         res.status(200).json(post);
//       } else {
//         res.status(404).json({ message: "Comments for post not found" });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         message: "Error retrieving the comments",
//       });
//     });
// });
// #endregion

router.get("/api/posts/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then((comments) => {
      // console.log(req.params);
      if (!comments.length) {
        // console.log(req.params);
        res
          .status(404)
          .json({ message: "Post with specified ID does not exist." });
      } else if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ message: "Comments not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error retrieving the comments",
      });
    });
});

////// POST //////
router.post("/api/posts", (req, res) => {
  Posts.insert(req.body)
    .then((post) => {
      if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else if (post) {
        res.status(201).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

// BUGGY // {params, url, }
router.post("/api/posts/:id/comments", (req, res) => {
  //console.log("AGH ", req.body);
  // {text: 'comment', id: 2}

  Posts.findById(req.params.id)
    .then((post) => {
      if (!post.length) {
        //console.log("AGH: ", post);
        res.status(404).json({
          message: "Post with specified ID for the comment does not exist.",
        });
      } else {
        console.log("post", post);
        return post;
      }
    })
    .then((r) => {
      console.log("R", r);
      var body = { ...req.body, post_id: r[0].id };
      Posts.insertComment(body)
        .then((comment) => {
          console.log("Logging", body);
          if (!body.text) {
            res.status(400).json({
              errorMessage: "Please provide text for the post.",
            });
          } else if (comment) {
            res.status(201).json(comment);
          }
        })
        .catch((err) => {
          console.log("ERR", err);
          res.status(500).json({
            error:
              "There was an error while saving the comment to the database",
          });
        });
    });
});

////// DELETE //////
router.delete("/api/posts/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((post) => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "Post with specified ID does not exist." });
      } else if (post) {
        //        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error: the post could not be removed",
      });
    });
});

////// PUT /////
router.put("/api/posts/:id", (req, res) => {
  //check if ID exists first
  Posts.update(req.body)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "Post with specified ID does not exist." });
      } else if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});
