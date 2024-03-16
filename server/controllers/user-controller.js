const User = require('../models/User.js');

async function getUser(req, res){
  try{
    const user = await User.findOne({username: req.body.username});
    res.status(200).json({user: user});
  }catch(e){
    res.status(400).json({message: 'User cannot be found'});
  }
}

async function addUser(req, res){
  try{
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,

    });
    await user.save();
    res.status(200).json({message: 'User has been created successfully'});
  }catch(e){
    res.status(400).json({message: 'User cannot be found'});
  }
}

async function getGoals(req, res){
  try{
    const user = await User.findOne({
      $or: [{ username: req.session.user.username }, { email: req.session.user.email }]
    });
    res.status(200).json({goals: Object.fromEntries(Object.entries(user.goals).
      // eslint-disable-next-line no-unused-vars
      filter(([key, val]) => val > 0))});
  }catch(e){
    res.status(400).json({message: 'User cannot be found'});
  }
}

async function updateGoals(req, res){
  try{
    const user = await User.findOne({
      $or: [{ username: req.session.user.username }, { email: req.session.user.email }]
    });
    user.goals = req.body.goalObj;
    await user.save();
    res.status(200).json({message: 'Goals have been updated successfully'});
  }catch(e){
    res.status(400).json({message: 'User cannot be found'});
  }
}

async function getDailyFood(req, res){
  try{
    const user = await User.findOne({
      $or: [{ username: 'amirrezamojtahedi2@gmail.com' }, { email: 'amirrezamojtahedi2@gmail.com' }]
    });
    res.status(200).json({dailyFood: user.dailyFood});
  }catch(e){
    res.status(400).json({message: 'User cannot be found'});
  }
}

async function addDailyFood(req, res){
  try{
    const user = await User.findOne({
      $or: [{ username: 'amirrezamojtahedi2@gmail.com' }, { email: 'amirrezamojtahedi2@gmail.com' }]
    });
    const dailyFood = req.body.dailyFood;
    await User.findOneAndUpdate(
      { _id: user._id }, 
      { $push: { dailyFood: dailyFood } }
    );
    await user.save();
    res.status(200).json({message: 'Daily food has been added successfully'});
  }catch(e){
    res.status(400).json({message: 'User cannot be found'});
  }
}


module.exports = {getUser, addUser, getGoals, updateGoals, getDailyFood, addDailyFood};
