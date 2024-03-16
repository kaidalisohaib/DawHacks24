import { useState } from 'react';
import axios from 'axios';

//import TopNavbar from '../Navbar';
import InputRow from './InputRow';
import InputBlock from './InputBlock';
import InputField from './InputField';

import '../../styles/UserForm.css';

/**
 * ModifyGoals a form and allows users to modify their daily consumption goals
 * 
 * @component
 */
function ModifyGoals(){
  /**
   * State for form data.
   * @type {object}
   * @property {number} calories - The maximum daily calories consumption.
   * @property {number} fat - The maximum daily fat consumption.
   * @property {number} protein - The maximum daily protein consumption.
   * @property {number} carbohydrate - The maximum daily carbohydrate consumption.
   * @property {number} sugars - The maximum daily sugars consumption.
   * @property {number} sodium - The maximum daily sodium consumption.
   * @property {number} calcium - The maximum daily calcium consumption.
   * @property {number} cholesterol - The maximum daily cholesterol consumption.
   */
  const [formData, setFormData] = useState({
    calories: 0,
    fat: 0,
    protein: 0,
    carbohydrate: 0,
    sugars: 0,
    sodium: 0,
    calcium: 0,
    cholesterol: 0
  });
  
  /**
   * Handles changes in the input fields.
   * @param {object} e - The event object.
   */ 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  /**
   * Handles form submission.
   * @param {object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const goalObj = {
      goalObj:
            {
              calories: formData.calories,
              fat: formData.fat,
              protein: formData.protein,
              carbohydrate: formData.carbohydrate,
              sugars: formData.sugars,
              sodium: formData.sodium,
              calcium: formData.calcium,
              cholesterol: formData.cholesterol
            }
    };
    try {
      const user = await axios.get('/auth/session');
      const username = user.data.user.username;
      await axios.put(`/api/v1/${username}/goals`, goalObj);
    } catch (err) {
      console.error(err);
    }
  };
    
  return (
    <div>
      {/*<TopNavbar/> removing this because the nav bar gets displayed twice*/}
      <main className="form-page">
        <form onSubmit={handleSubmit} className="user-form">
          <h1>Modifying daily goals</h1>
          <h2>Enter your maximum daily consumption</h2>
          <InputRow>
            <InputBlock>
              <InputField
                label="Calories"
                name="calories"
                type="number"
                onChange={handleInputChange}
              />
              <InputField
                label="Fat"
                name="fat"
                type="number"
                onChange={handleInputChange}
              />
              <InputField
                label="Protein"
                name="protein"
                type="number"
                onChange={handleInputChange}
              />
              <InputField
                label="Carbohydrate"
                name="carbohydrate"
                type="number"
                onChange={handleInputChange}
              />
            </InputBlock>

            <InputBlock>
              <InputField
                label="Sugars"
                name="sugars"
                type="number"
                onChange={handleInputChange}
              />
              <InputField
                label="Sodium"
                name="sodium"
                type="number"
                onChange={handleInputChange}
              />
              <InputField
                label="Calcium"
                name="calcium"
                type="number"
                onChange={handleInputChange}
              />
              <InputField
                label="Cholesterol"
                name="cholesterol"
                type="number"
                onChange={handleInputChange}
              />
            </InputBlock>

          </InputRow>
          <section class="form-btn-row">
            <button type="submit" class="submit-btn">Save Modifications</button>
          </section>
        </form>
      </main>
      
    </div>
  );
}

export default ModifyGoals;