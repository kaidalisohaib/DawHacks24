import { toast, Zoom } from 'react-toastify';

import SearchBar from './SearchBar.js';
import { FoodCartItem } from './FoodComponents.js';

/**
 * React component with a list of food items
 * that can be added to the user's "cart"
 */
function FoodList({foods, addedFoods, onSelectFood, onAddFood, onDeleteFood}) {
  const foodItemNodes = [];
  for (const food of addedFoods) {
    foodItemNodes.push(
      <FoodCartItem key={food._id} food={food} 
        onSelectFood={() => onSelectFood(food)} onDeleteFood={() => onDeleteFood(food)}
      />
    );
  }

  /**
   * When search button is clicked, look for food in food list.
   * Add it to the FoodList if food exists.
   */
  function onFoodSearch(foodName) {
    const targetFood = foods.find((food) => food.name === foodName);
    if (targetFood === undefined) {
      toast.error(
        'Can\'t find this food, please try again', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: true,
          transition: Zoom
        }
      );
    } else {
      onAddFood(targetFood);
    }

    document.querySelector('#food-search').value = '';
  }
  
  return (
    <section id="food-list-section">
      <SearchBar foodsName={foods} onFoodSearch={onFoodSearch}/>
      <section id="food-list">
        {foodItemNodes}
      </section>
    </section>
  );
}

export default FoodList;