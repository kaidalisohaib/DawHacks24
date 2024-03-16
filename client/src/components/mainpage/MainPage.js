import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { FoodListStats } from './FoodComponents.js';
import FoodList from './FoodList.js';

import 'react-toastify/dist/ReactToastify.css';
import '../../styles/MainPage.css';

function MainPage({ listFood, isLoggedIn, updateWithCustomFood, savedFoodList, saveFoodList }) {
  // What food is currently selected, for detail view
  const [selectedFood, setSelectedFood] = useState(null);
  // List of foods in "cart"
  const [addedFoods, setAddedFoods] = useState([]);
  // Total food nutrition object
  const [totalFood, setTotalFood] = useState(null);
  async function getTotalNutrition(addedFoods){
    if (addedFoods.length !== 0){
      const foodNames = addedFoods.map(food => food.name);
      try {
        const url = '/food-buds/api/v1/total-foods';
        const resp = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(foodNames),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const totalFoodData = await resp.json();
        setTotalFood(totalFoodData.totalNutrition);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }

  useEffect(() => {
    getTotalNutrition(addedFoods);
    updateWithCustomFood();
  }, [addedFoods]);

  
  useEffect(() => {
    setAddedFoods(savedFoodList.current);
  }, []);

  const onSelectFood = function (food) {
    setSelectedFood(prev => food);
  };
  
  const onAddFood = async function (food) {
    const newAddedFoods = [...addedFoods];
    const name = food.name;
    let foodData;
    try {
      if (sessionStorage.getItem(food.name) !== null){
        foodData = JSON.parse(sessionStorage.getItem(food.name));
      } else {
        const url = '/food-buds/api/v1/specific-food/' + name;
        const resp = await fetch(url);
        const respData = await resp.json();
        sessionStorage.setItem(food.name, JSON.stringify(respData.data));
        foodData = respData.data;
      }
      newAddedFoods.push(foodData);
      setAddedFoods(newAddedFoods);
      saveFoodList(newAddedFoods);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onDeleteFood = function (food) {
    const name = food.name;
    const foodsList = [...addedFoods];
    const newFoodsList = foodsList.filter(food => food.name !== name);
    setAddedFoods(newFoodsList);
  };

  const backToTotal = function () {
    setSelectedFood(prev => null);
    setTotalFood(totalFood);
  };

  return <>
    <section id="main-page">
      <div className="section-search">
        <FoodList foods={listFood} addedFoods={addedFoods}
          onSelectFood={onSelectFood} onAddFood={onAddFood} onDeleteFood={onDeleteFood}
          isLoggedIn={isLoggedIn}
          totalFood={totalFood} />
      </div>
      <div className="section-stats">
        <FoodListStats selectedFood={selectedFood} backToTotal={backToTotal} 
          totalFood={totalFood} />
      </div>
    </section>
    <ToastContainer />
  </>;
}

export default MainPage;