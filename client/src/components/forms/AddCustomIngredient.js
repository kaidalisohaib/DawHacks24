import { useState } from 'react';
import axios from 'axios';

import InputRow from './InputRow';
import InputBlock from './InputBlock';
import InputField from './InputField';

import '../../styles/UserForm.css';

function AddCustomIngredient(){
  const [formData, setFormData] = useState({
    name: '',
    calories: 0,
    fat: 0,
    protein: 0,
    calcium: 0,
    iron: 0,
    sodium: 0,
    potassium: 0,
    carbohydrate: 0,
    sugars: 0,
    fiber: 0,
    cholesterol: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminB12: 0,
    vitaminA: 0,
    isCustom: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foodObj = {
      foodObj:
        {
          name: formData.name,
          calories: formData.calories,
          fat: formData.fat,
          protein: formData.protein,
          calcium: formData.calcium,
          iron: formData.iron,
          sodium: formData.sodium,
          potassium: formData.potassium,
          carbohydrate: formData.carbohydrate,
          sugars: formData.sugars,
          fiber: formData.fiber,
          cholesterol: formData.cholesterol,
          vitaminC: formData.vitaminC,
          vitaminD: formData.vitaminD,
          vitaminB12: formData.vitaminB12,
          vitaminA: formData.vitaminA,
          isCustom: true
        }
    };
    try {
      await axios.post('/food-buds/api/v1/custom-food', foodObj);
    } catch (error) {
      console.error('Error adding custom ingredient:', error.message);
    }
  };

  return (
    <div>
      <main className="form-page">
        <form className="user-form" onSubmit={handleSubmit}>
          <h1>The serving must be in 100g</h1>
          <InputRow>
            <InputBlock>
              <InputField label="Name" type="text" name="name" onChange={handleInputChange} />
              <InputField label="Calories" type="number" name="calories" 
                onChange={handleInputChange} />
              <InputField label="Fat (g)" type="number" name="fat" onChange={handleInputChange} />
              <InputField label="Protein (g)" type="number" name="protein" 
                onChange={handleInputChange} />
            </InputBlock>

            <InputBlock>
              <InputField label="Carbohydrate (g)" type="number" name="carbohydrate"
                onChange={handleInputChange} />
              <InputField label="Sugars (g)" type="number" name="sugars"
                onChange={handleInputChange} />
              <InputField label="Fiber (mg)" type="number" name="fiber" 
                onChange={handleInputChange} />
              <InputField label="Cholesterol (mg)" type="number" name="cholesterol"
                onChange={handleInputChange} />
            </InputBlock>
          </InputRow>

          <InputRow>
            <InputBlock>
              <InputField label="Calcium (mg)" type="number" name="calcium"
                onChange={handleInputChange} />
              <InputField label="Iron (mg)" type="number" name="iron" 
                onChange={handleInputChange} />
              <InputField label="Sodium (mg)" type="number" name="sodium"
                onChange={handleInputChange} />
              <InputField label="Potassium (mg)" type="number" name="potassium"
                onChange={handleInputChange} />
            </InputBlock>
          
            <InputBlock>
              <InputField label="Vitamin C (mcg)" type="number" name="vitaminC"
                onChange={handleInputChange} />
              <InputField label="Vitamin D (mcg)" type="number" name="vitaminD"
                onChange={handleInputChange} />
              <InputField label="Vitamin B12 (mcg)" type="number" name="vitaminB12"
                onChange={handleInputChange} />
              <InputField label="Vitamin A (mcg)" type="number" name="vitaminA"
                onChange={handleInputChange} />
            </InputBlock>
          </InputRow>

          <section class="form-btn-row">
            <button type="submit" class="submit-btn">Add Custom ingredient</button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default AddCustomIngredient;