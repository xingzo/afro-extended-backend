const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

/* 
  * * * * * ADD A NEW USER * * * * *
  
// @route    POST api/users
// @desc     Register user
// @access   Public

*/
router.post(
  '/',
  [
    check('firstName', 'First Name is required')
      .not()
      .isEmpty(),
    check('lastName', 'Last Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return bad status if error
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // see if user already exists
      let user = await User.findOne({ email });

      if (user) {
        //if they already exist then return a duplicate error
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // create the user object
      user = new User({
        firstName,
        lastName,
        email,
        avatar,
        password
      });

      // encrypt password with Bcrypt
      // use salt to hash the password with 10 rounds
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // actually save the user to the db
      await user.save();

      // now that the user is registered
      // return jwt to automatically login the user after signup
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }

    console.log(req.body);
  }
);

module.exports = router;
