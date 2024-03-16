import './App.css';
// navigation dependencies
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useState } from 'react';
import TopNavbar from './components/Navbar.js';
import MainPage from './components/mainpage/MainPage.js';
import UserProfile from './components/user/UserProfile.js';
import LoginPage from './components/user/LoginPage.js';
import AboutUs from './components/AboutUs.js';
import AddCustomIngredient from './components/forms/AddCustomIngredient.js';
import ModifyGoals from './components/forms/ModifyGoals.js';

function App() {
  // List of all food names from DB (for search bar)
  const [foodDB, setFoodDB] = useState([]);
  const [originalListFood, setOriginalListFood] = useState([]);
  const [currListFood, setCurrListFood] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  async function getOriginalFoods(){
    console.log('getOriginalFoods');
    let foodData;
    try {
      const url = '/food-buds/api/v1/all-foods';
      const resp = await fetch(url);
      foodData = await resp.json();
      console.log('REAL:', foodData);
      setOriginalListFood(foodData.allFoods);
      setFoodDB(originalListFood);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      //Loading state set to true/false
    }
  }

  async function updateWithCustomFood(){
    console.log(foodDB.length, originalListFood.length);
    console.log('updateWithCustomFood');
    let customFoodData;
    try {
      const url = '/food-buds/api/v1/custom-all-foods';
      const resp = await fetch(url);
      customFoodData = await resp.json();
      setFoodDB([...originalListFood, ...customFoodData.allCustomFoods] );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      //Loading state set to true/false
    }
  }

  // get session for navbar displaying correct icon
  async function userSession(){
    const resp = await fetch('/auth/session');
    if (resp.status === 200) {
      setIsLoggedIn(true);
    }
  }

  function saveFoodList(list){
    setCurrListFood(list);
  }

  /**
   * Not using Promise.all here. If I did, getting session would take as long as
   * getting user foods. - Oleks
   */
  useState (() => {
    userSession();
    getOriginalFoods();
    updateWithCustomFood();
  }, []);

  return (
    <>
      <Router>
        <TopNavbar isLoggedIn={isLoggedIn}/>
        <Routes>
          <Route 
            exact
            path="/"
            // eslint-disable-next-line max-len
            element={<MainPage listFood={foodDB} />}
          />
          {/** Allow the profile and login pages to change logged in state
           * and allow navbar to display correct icon
           */}
          <Route 
            exact
            path="/profile"
            element={<UserProfile setIsLoggedIn={setIsLoggedIn}/>}
          />
          <Route 
            exact
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>}
          />
          <Route
            exact
            path="/about-us"
            element={<AboutUs />}
          />
          <Route 
            exact
            path="/custom-ingredient"
            element={<AddCustomIngredient />}
          />
          <Route 
            exact
            path="/:username/goals"
            element={<ModifyGoals />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
