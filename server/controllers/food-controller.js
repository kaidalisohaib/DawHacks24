const Food = require('../models/Food.js');
const User = require('../models/User.js');

/**
 * Get specific food that you are searching for. Gives you info about the food and stuff.
 * @param {*} req 
 * @param {*} res 
 */
const getFood = async (req, res) => {
  try{
    const { foodName } = req.params;
    const foodDb = await Food.findOne({ name: foodName }, {projection: { _id: 0, __v: 0}});
    const dvFoodData = calculateDVPercentages(foodDb);
    res.status(200).json({ data: dvFoodData });
  } catch (e) {
    console.error(`ERROR. Could not access data. \n Error Info: ${e}`);
    res.status(500).json({
      content: 'A server-side exception has occured.',
      response: 500
    });
  }
};

/**
 * Gets all the food names from the database
 * @param {*} req 
 * @param {*} res 
 */
const getFoods = async (req, res) => {
  try{
    const allData = await Food.find({ isCustom: false }, { name: 1, _id: 1 });
    res.status(200).json({
      allFoods: allData
    });
  } catch (e) {
    console.error(`ERROR. Could not access data. \n Error Info: ${e}`);
    res.status(500).json({
      content: 'A server-side exception has occured.',
      response: 500
    });
  }
};

/**
 * Gets all the custom foods of a specified user
 * @param {*} req 
 * @param {*} res 
 */
const getFoodsCustom = async (req, res) => {
  try{
    const user = await User.findOne({
      $or: [{ username: req.session.user.username }, { email: req.session.user.email }]
    });
    const customFoods = await User.findOne({ _id: user._id }).populate('customFood').exec();
    res.status(200).json({
      allCustomFoods: customFoods.customFood
    });
  } catch (e) {
    console.error(`ERROR. Could not access data. \n Error Info: ${e}`);
    res.status(500).json({
      content: 'A server-side exception has occured.',
      response: 500
    });
  }
};

/**
 * Used when you want multiple different foods and something with it.
 * Ex: add foods to calculate calories, add specific foods to create nutrition facts ticket, etc.
 * @param {*} req 
 * @param {*} res 
 */
const getTotalNutrition = async (req, res) => {
  const allFoods = [];
  try {
    const totalFoodsName = req.body;
    for (const food of totalFoodsName) {
      // eslint-disable-next-line no-await-in-loop
      const foodDb = await Food.findOne({ name: food }, {projection: { _id: 0, __v: 0}});
      allFoods.push(foodDb);
    }
    let totalNut = calculateTotalNutrition(allFoods);
    totalNut = calculateDVPercentages(totalNut);
    res.status(200).json({ totalNutrition: totalNut });
  } catch(e) {
    console.error(`ERROR. Could not access data. \n Error Info: ${e}`);
    res.status(500).json({
      content: 'A server-side exception has occoured.',
      response: 500
    });
  }
};

const addFoodCustom = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.session.user.username }, { email: req.session.user.email }]
    });
    const food = new Food(req.body.foodObj);
    await food.save();
    user.customFood.push(food._id);
    await user.save();
    return res.status(201).json({status: 'success', newData:food});
  } catch(error) {
    return res.status(400).json({message:'ERROR! Bad request encountered.', food:req.body});
  }
};

const updateFoodCustom = async (req, res) => {
  try {
    const { updateFood } = req.body;
    const user = await User.findOne({
      $or: [{ username: req.session.user.username }, { email: req.session.user.email }]
    });
    const findFoodDb = await Food.findOne({ _id: updateFood.id });
    if (req.body.foodObj.isCustom && findFoodDb) {
      const food = new Food(req.body.foodObj);
      await food.save();
      user.customFood.push(food.id);
      await user.save();
      return res.status(201).json({status: 'success', NewData:food});
    } else {
      return res.status(404).json({message:`ERROR! Data doesn't exist. Can't update`});
    }
  } catch(error) {
    return res.status(400).json({message:'ERROR! Bad request encountered.', food:req.body});
  }
};

const deleteFoodCustom = async (req, res) => {
  const deletedFoodName = req.params.foodName;
  const foodObj = await Food.findOne({ name: deletedFoodName });
  
  if (!foodObj) {
    return res.status(404).json({ message: `Food with name ${deletedFoodName} not found` });
  }

  if (!foodObj.isCustom) {
    return res.status(403).json({ message: `ERROR! Can't delete this food. Only delete custom 
    foods that users create` });
  }
  await Food.deleteOne({ name: deletedFoodName});
  return res.status(204).json({ message: `Custom food deleted successfully` });
};

// Need to make an attribution section, maybe in the about us page
// https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels
function calculateDVPercentages(foodObj) {
  const dailyValue = {
    fat: 78,
    protein: 50,
    carbohydrate: 285,
    sugars: 50,
    fiber: 28,
    cholesterol: 300,
    calcium: 1300,
    iron: 18,
    potassium: 4700,
    vitaminA: 900,
    vitaminC: 90,
    vitaminB12: 2.4,
    vitaminD: 20,
    sodium: 2300
  };

  if ('_doc' in foodObj) {
    foodObj = foodObj._doc;
  }

  for (const key in foodObj) {
    if (typeof foodObj[key] === 'number') {
      const percent = parseFloat((100 * foodObj[key] / dailyValue[key]).toFixed(0));
      foodObj[key] = { value: foodObj[key], percent: percent};
    }
  }

  return foodObj;
}

function calculateTotalNutrition(foodArray) {
  const totalMacrosObject = {
    name: '',
    calories: 0,
    fat: 0,
    protein: 0,
    carbohydrate: 0,
    sugars: 0,
    fiber: 0,
    cholesterol: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminB12: 0,
    vitaminD: 0,
    sodium: 0
  };

  for (const currFood of foodArray) {
    totalMacrosObject.calories += currFood.calories;
    totalMacrosObject.fat += currFood.fat;
    totalMacrosObject.protein += currFood.protein;
    totalMacrosObject.carbohydrate += currFood.carbohydrate;
    totalMacrosObject.sugars += currFood.sugars;
    totalMacrosObject.fiber += currFood.fiber;
    totalMacrosObject.cholesterol += currFood.cholesterol;
    totalMacrosObject.calcium += currFood.calcium;
    totalMacrosObject.iron += currFood.iron;
    totalMacrosObject.potassium += currFood.potassium;
    totalMacrosObject.vitaminA += currFood.vitaminA;
    totalMacrosObject.vitaminC += currFood.vitaminC;
    totalMacrosObject.vitaminB12 += currFood.vitaminB12;
    totalMacrosObject.vitaminD += currFood.vitaminD;
    totalMacrosObject.sodium += currFood.sodium;
  }
  
  for (const key in totalMacrosObject) {
    if (typeof totalMacrosObject[key] === 'number') {
      totalMacrosObject[key] = parseFloat(totalMacrosObject[key].toFixed(1));
    }
  }

  totalMacrosObject.name = 'Total Nutrition';

  return totalMacrosObject;
}

module.exports = {
  getFood, getFoods, getFoodsCustom, getTotalNutrition, 
  addFoodCustom, updateFoodCustom, deleteFoodCustom
};
