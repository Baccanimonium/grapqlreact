import express from 'express';
import passport from 'passport';
import Profile from '../../models/Profile';
import User from '../../models/User';

// Load validation
import validateProfileInput from '../../validation/profile';
import validateExperienceInput from '../../validation/experience';
import validateEducationInput from '../../validation/education';

const router = express();
router.get('/test', (req, res) => res.json({msg: "Profile works"}));

// @route Get api/profile
// @desc Get current user profile
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = {};
    Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'Ther is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route Get api/profile/all
// @desc Get get all profile
// @access Public
router.get('/all', (req, res) => {
    let errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noProfiles = 'There is no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(() => res.status(404).json({ profile: 'there is no profiles'}))
});

// @route Get api/profile/handle/:handle
// @desc Get profile by handle
// @access Public

router.get('/handle/:handle', (req, res) => {
    let errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(() => res.status(404).json({ profile: 'there is no profile for this user'}))
});

// @route Get api/profile/user/:user_id
// @desc Get profile by User ID
// @access Public

router.get('/user/:user_id', (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(() => res.status(404).json({ profile: 'there is no profile for this user'}))
});

// @route Post api/profile
// @desc Create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.handle = req.body.handle;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // skills - split into arr
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true}
                ).then(profile => res.json(profile));
            } else {
                // Create

                // Check of handle exist
                Profile.findOne({handle: profileFields.handle}).then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exist';
                        res.status(400).json(errors);
                    }
                });

                new Profile(profileFields).save().then(profile => res.json(profile));
            }
        })
});

// @route Post api/profile/experience
// @desc Create or edit user profile experience
// @access Private

router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            };
            // Add to exp array
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
});
// @route Post api/profile/education
// @desc Create or edit user profile education
// @access Private

router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            };
            // Add to exp array
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        })
});

// @route DELETE api/profile/experience/:id
// @desc Delete experience from profile
// @access Private

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id}).then(profile => {
    // Get remove index
    const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
    // splice out of array
    profile.experience.splice(removeIndex, 1);

    // Save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route DELETE api/profile/:edu_id
// @desc Delete education from profile
// @access Private

router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOneAndRemove({user: req.user.id}).then(() => {
        User.findOneAndRemove({_id: req.user.id}).then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json(err));
});

// @route DELETE api/profile/education/:edu_id
// @desc Delete education from profile
// @access Private

router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id}).then(profile => {
        // Get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        // splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;