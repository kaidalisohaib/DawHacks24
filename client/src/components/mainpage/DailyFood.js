import '../../styles/DailyFood.css';
import axios from 'axios';

export default function DailyFood({dailyFoodList}) {
  const removeDailyFood = async (e) => {
    await axios.delete(`api/v1/daily-food/${e.target.classList[1]}`);
  };

  const dailyFoodTickets = [];
  dailyFoodList.forEach((food) => {
    dailyFoodTickets.push(
      <section className="daily-food-ticket">
        <ul className="daily-food-list">
          <li>Calories: {food.calories}</li>
          <li>Protein: {food.protein}</li>
          <li>Sugars: {food.sugars}</li>
          <li>Carbohydrates: {food.carbohydrate}</li>
        </ul>
        <button className={`remove-daily-food-btn ${food._id}`}
          onClick={e=>removeDailyFood(e)}>Remove Daily Food</button>
      </section>
    );
  });
  return (
    <main className="daily-food-page">
      {dailyFoodTickets}
    </main>
    
  );
}