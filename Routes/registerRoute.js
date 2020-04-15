const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  registerUser,
  retryUser,
  verifyUser,
  showVerify
} = require("../Controllers/registerController");

// show register form
router.get("/", (req, res) => {
res.render("register");
});

//show otp verifucation page
router.get('/verify/:id', (req, res) => {
  showVerify(req.params.id).then((data) => {
    res.render('verify', { user_id: req.params.id })
  })
    .catch((error) => {
      res.redirect('/');
    });
})

router.post(
  "/register",
  [
    // field must be an email
    check("email").not().isEmpty().withMessage("email is required").isEmail(),
    // password must be at least 5 chars long
    check("username")
      .not()
      .isEmpty()
      .withMessage("username is required")
      .isLength({ min: 3 })
      .withMessage("username length should be greater 3"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    registerUser(req.body)
      .then((data) => {
        if (data.status == 200) {
          res.status(data.status).json(data.data);
        }
      })
      .catch((err) => {
        res.status(err.status).json(err.data);
      });
  }
);

router.post("/retry/:id", (req, res) => {
  retryUser(req.params)
    .then((data) => {
      res.status(data.status).json(data.data);
    })
    .catch((err) => {
      res.status(err.status).json(err.data);
    });
});



router.post(
  "/verify",
  [
    // user_id is required
    check("user_id").not().isEmpty().withMessage("user_id is required"),
    // otp must be 6 integer value
    check("otp")
      .not()
      .isEmpty()
      .withMessage("otp is required")
      .isInt()
      .withMessage("otp must be integer")
      
      .isLength({ min: 6 })
      .withMessage("otp length should be greater 6"),
  ],
  (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    verifyUser(req.body)
      .then((data) => {
        res.status(data.status).json(data.data);
      })
      .catch((err) => {
        res.status(err.status).json(err.data);
      });
  }
);

module.exports = router;
