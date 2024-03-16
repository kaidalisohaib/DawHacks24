const User = require("../models/User.js");

async function getUser(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    res.status(200).json({ user: user });
  } catch (e) {
    res.status(400).json({ message: "User cannot be found" });
  }
}

async function addUser(req, res) {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    await user.save();
    res.status(200).json({ message: "User has been created successfully" });
  } catch (e) {
    res.status(400).json({ message: "User cannot be found" });
  }
}

async function getGoals(req, res) {
  try {
    const user = await User.findOne({
      $or: [
        { username: req.session.user.username },
        { email: req.session.user.email },
      ],
    });
    res.status(200).json({
      goals: Object.fromEntries(
        Object.entries(user.goals)
          // eslint-disable-next-line no-unused-vars
          .filter(([key, val]) => val > 0)
      ),
    });
  } catch (e) {
    res.status(400).json({ message: "User cannot be found" });
  }
}

async function updateGoals(req, res) {
  try {
    const user = await User.findOne({
      $or: [
        { username: req.session.user.username },
        { email: req.session.user.email },
      ],
    });
    user.goals = req.body.goalObj;
    await user.save();
    res.status(200).json({ message: "Goals have been updated successfully" });
  } catch (e) {
    res.status(400).json({ message: "User cannot be found" });
  }
}

async function getDailyFood(req, res) {
  try {
    // const user = await User.findOne({
    //   $or: [
    //     { username: req.session.user.username },
    //     { email: req.session.user.email },
    //   ],
    // });
    // user.dailyFood
    const mockReturnValue = [
      {
        calories: 400,
        fat: 400,
        protein: 400,
        carbohydrate: 400,
        sugars: 400,
        sodium: 400,
        calcium: 400,
        cholesterol: 400,
      },
      {
        calories: 500,
        fat: 500,
        protein: 500,
        carbohydrate: 500,
        sugars: 500,
        sodium: 500,
        calcium: 500,
        cholesterol: 500,
      },
      {
        calories: 600,
        fat: 600,
        protein: 600,
        carbohydrate: 600,
        sugars: 600,
        sodium: 600,
        calcium: 600,
        cholesterol: 600,
      },
    ];
    // await user.save();
    res.status(200).json({ dailyFood: mockReturnValue });
  } catch (e) {
    res.status(400).json({ message: 'User cannot be found' });
  }
}

module.exports = { getUser, addUser, getGoals, updateGoals, getDailyFood};
