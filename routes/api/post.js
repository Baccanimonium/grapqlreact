import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';

// Models
import Post from '../../models/Post';
import Profile from "../../models/Profile";

// validation
import validatePostInput from '../../validation/post';

const router = express();

// @route POST api/post
// @desc create post
// @access Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    });
    newPost.save().then(post => res.json(post ))
});

// @route GET api/post
// @desc get post
// @access Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1})
        .then(posts => res.json(posts))
        .catch(() => res.status(404).json({error: 'No post found'}))

});

// @route GET api/post/:id
// @desc get post by id
// @access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(() => res.status(404).json({error: 'No post found by than id'}))

});

// @route DELETE api/post/:id
// @desc delete post by id
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post =>{
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({notautorized: 'User not authorized'});
                    }
                    // delete
                    post.remove().then(() => res.json({success: true}))
                })
                .catch(() => res.status(404).json({ error: 'Post no found'}))
        })
        .catch(() => res.status(404).json({error: 'No post found by than id'}))

});

// @route Like api/post/like/:id
// @desc Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({alreadyliked: ' user already liked this post'});
                    }
                    // add user to likes arr
                    post.likes.unshift({user: req.user.id });
                    post.save().then(post => res.json(post));
                })
                .catch(() => res.status(404).json({ error: 'Post no found'}))
        })
        .catch(() => res.status(404).json({error: 'No post found by than id'}))

});
// @route Like api/post/unlike/:id
// @desc Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({notliked: ' you have not yet liked this post'});
                    }
                    // get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);
                    // splice out of arr
                    post.likes.splice(removeIndex, 1);
                    // save
                    post.save().then(post => res.json(post));
                })
                .catch(() => res.status(404).json({ error: 'Post no found'}))
        })
        .catch(() => res.status(404).json({error: 'No post found by than id'}))
});
// @route Like api/post/:id
// @desc Add comment
// @access Private
router.post('/comment/:id',passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };
            // add to comments arr
            post.comments.unshift(newComment);
            post.save().then(post => res.json(post));
        })
        .catch(() => res.status(404).json({postNotFound: 'no post found'}))
});
// @route Like api/post/comment/:id/comment_id
// @desc Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            // is exist comment
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({commentNotExists: 'Comment does not exist'})
            }
            // get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
            // splice out of arr
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
        })
        .catch(() => res.status(404).json({postNotFound: 'no post found'}));
});
module.exports = router;