const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

async function addComment(req, res) {
  try {
    const text = req.body.text;
    const recipeId = req.params.recipeId;
    const userId = req.user._id;

    const recipe = await Recipe.findById(recipeId);
    if (recipe == null) {
      res.status(404).json({ message: 'Recipe not found.' });
      return;
    }

    const newComment = new Comment({
      text: text,
      recipe: recipeId,
      user: userId
    });

    await newComment.save();
    
    // get user name populated
    await newComment.populate('user', 'username');

    res.status(201).json({ message: 'Comment added!', comment: newComment });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding comment" });
  }
}

async function getComments(req, res) {
  try {
    const recipeId = req.params.recipeId;
    const comments = await Comment.find({ recipe: recipeId }).populate('user', 'username');
    
    res.status(200).json({ comments: comments });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting comments" });
  }
}

async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    if (comment == null) {
      res.status(404).json({ message: 'Comment not found.' });
      return;
    }

    let canDelete = false;

    if (comment.user.toString() == req.user._id.toString()) {
      canDelete = true;
    }

    if (req.user.role == 'admin') {
      canDelete = true;
    }

    if (canDelete == false) {
      res.status(403).json({ message: 'Not allowed to delete this comment.' });
      return;
    }

    await comment.deleteOne();

    res.status(200).json({ message: 'Comment deleted.' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting comment" });
  }
}

module.exports = {
  addComment: addComment,
  getComments: getComments,
  deleteComment: deleteComment
};
