import './App.css';
// navigation dependencies
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useState, useRef } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const originalListFoodRef = useRef([]);
  const savedFoodList = useRef([]);

  async function getOriginalFoods() {
    try {
      const url = '/food-buds/api/v1/all-foods';
      const resp = await fetch(url);
      const foodData = await resp.json();
      originalListFoodRef.current = foodData.allFoods;
      updateWithCustomFood();

      // setFoodDB(foodData.allFoods);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function updateWithCustomFood() {
    let customFoodData = {allCustomFoods: []}; 
    try {
      if(isLoggedIn){
        const url = '/food-buds/api/v1/custom-all-foods';
        const resp = await fetch(url);
        customFoodData = await resp.json();
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setFoodDB([...originalListFoodRef.current, ...customFoodData.allCustomFoods]);
     
    } catch (error) {
      console.error('Error fetching data:', error);
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
    savedFoodList.current = list;
  }

  /**
   * Not using Promise.all here. If I did, getting session would take as long as
   * getting user foods. - Oleks
   */
  useState (() => {
    userSession();
    getOriginalFoods();
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
            element={<MainPage listFood={foodDB} isLoggedIn={isLoggedIn} updateWithCustomFood={updateWithCustomFood} savedFoodList={savedFoodList} saveFoodList={saveFoodList}/>}
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
            path="/goals"
            element={<ModifyGoals />}
          />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
