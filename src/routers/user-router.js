const express = require("express");
const router = new express.Router();
const { update } = require("../models/user");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendFarewellEmail } = require("../emails/account");
const sharp = require("sharp");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/gm)) {
      cb(new Error("Incorrect file type uploaded. Only jpeg/jpg/png allowed."));
    }
    cb(null, true);
  },
});

/**
 * @swagger
 * tags:
 *  - name: Users
 *    description: User management and login
 */

/**
 * @swagger
 *
 * /users:
 *    post:
 *      description: Register a new account
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: name
 *          description: User's full name
 *          required: true
 *          in: urlEncoded
 *          type: string
 *        - name: password
 *          description: User's password
 *          required: true
 *          type: string
 *          in: urlEncoded
 *        - name: email
 *          description: User's email
 *          required: true
 *          in: urlEncoded
 *          type: string
 *      responses:
 *        201:
 *          description: Successfully created account
 *        400:
 *          description: An error occurred
 */
router.post("/users", async (req, res) => {
  // Same as User.create(req.body, {})
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 *
 * /users/login:
 *    post:
 *      description: Log in an account
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: password
 *          description: User's password
 *          required: true
 *          type: string
 *          in: urlEncoded
 *        - name: email
 *          description: User's email
 *          required: true
 *          in: urlEncoded
 *          type: string
 *      responses:
 *        200:
 *          description: Successfully logged in
 *        400:
 *          description: An error occurred
 */
router.post("/users/login", async (req, res) => {
  res.setHeader("X-Powered-By", "Tony Trinh's API");
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 *
 * /users/logout:
 *    post:
 *      description: Log out current session
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Successfully logged out
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: A server error occurred
 */
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 *
 * /users/logout:
 *    post:
 *      description: Log out of all sessions
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Successfully logged out
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: A server error occurred
 */
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @swagger
 *
 * /users/me:
 *    get:
 *      description: Get user's profile information
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: User's profile
 *        401:
 *          description: Unauthorized
 */
router.get("/users/me", auth, async (req, res) => {
  res.setHeader("X-Powered-By", "Toni");
  res.send(req.user);
});

/**
 * @swagger
 *
 * /users/me:
 *    patch:
 *      description: Update user's profile
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: name
 *          description: User's full name
 *          required: true
 *          in: urlEncoded
 *          type: string
 *        - name: password
 *          description: User's password
 *          required: true
 *          type: string
 *          in: urlEncoded
 *        - name: email
 *          description: User's email
 *          required: true
 *          in: urlEncoded
 *          type: string
 *      responses:
 *        200:
 *          description: User's profile
 *        401:
 *          description: Unauthorized
 *        400:
 *          description: Invalid update fields
 *        404:
 *          description: An error occurred
 */
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid Updates",
    });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  const _id = req.user._id;
  try {
    await req.user.remove();
    sendFarewellEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Accepts files, saves in 'avatars' folder. File size limit 1MB,
// only accepts file extensions png/jpeg/jpg.
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // Uses sharp package to convert all images to png and resize them.
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

// Delete the user's avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
});

// Get the avatar to display
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error("Unable to fetch avatar.");
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

module.exports = router;
