const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

/*
////////////////////////////////////
// @route    GET api/profile/me
// @desc     GET CURRENT USER PROFILE
// @access   Private
////////////////////////////////////
*/

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['firstName', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/*
////////////////////////////////////
// @route    POST api/profile
// @desc     CREATE OR UPDATE A USER PROFILE
// @access   Private
////////////////////////////////////
*/

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //check for errors(for example, empty status trring)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //pull everything from the body and check if they have been filled out
    const {
      company,
      website,
      country,
      state,
      city,
      status,
      bio,
      facebook,
      instagram,
      itunes,
      mixcloud,
      soundcloud,
      spotify,
      twitter,
      youtube
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (country) profileFields.location = country;
    if (state) profileFields.location = state;
    if (city) profileFields.location = city;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    // if (skills) {
    //   profileFields.skills = skills.split(',').map(skill => skill.trim());
    // }

    // Build social object
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (itunes) profileFields.social.itunes = itunes;
    if (mixcloud) profileFields.social.mixcloud = mixcloud;
    if (soundcloud) profileFields.social.soundcloud = soundcloud;
    if (spotify) profileFields.social.spotify = spotify;
    if (twitter) profileFields.social.twitter = twitter;
    if (youtube) profileFields.social.youtube = youtube;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // If we found a profile Update it
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // If no profile found Create it
      profile = new Profile(profileFields);

      // save
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/*
////////////////////////////////////
// @route    GET api/profile
// @desc     GET ALL PROFILES
// @access   Public
////////////////////////////////////
*/

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'firstName',
      'lastName',
      'avatar'
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/*
////////////////////////////////////
// @route    GET api/profile/user/:user_id
// @desc     GET PROFILE BY USER ID
// @access   Public
////////////////////////////////////
*/

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['firstName', 'lastName', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

/*
////////////////////////////////////
// @route    DELETE api/profile
// @desc     DELETE PROFILE, USER AND POSTS
// @access   Private
////////////////////////////////////
*/

router.delete('/', auth, async (req, res) => {
  try {
    //   // Remove user posts
    //   await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
