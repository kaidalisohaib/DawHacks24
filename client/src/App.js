import './App.css';
// navigation dependencies
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import TopNavbar from './components/Navbar.js';
import MainPage from './components/mainpage/MainPage.js';
import UserProfile from './components/user/UserProfile.js';
import LoginPage from './components/user/LoginPage.js';
import AboutUs from './components/AboutUs.js';
import AddCustomIngredient from './components/forms/AddCustomIngredient.js';
import ModifyGoals from './components/forms/ModifyGoals.js';

function App() {
  // List of all food names from DB (for search bar)
  const [listFood, setListFood] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function getFoods(){
    let foodData;
    try {
      const url = '/food-buds/api/v1/all-foods';
      const resp = await fetch(url);
      foodData = await resp.json();
      setListFood(foodData.allFoods);
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

  /**
   * Not using Promise.all here. If I did, getting session would take as long as
   * getting user foods. - Oleks
   */
  useEffect(() => {
    userSession();
    getFoods();
  }, []);

  return (
    <>
      <Router>
        <TopNavbar isLoggedIn={isLoggedIn}/>
        <Routes>
          <Route 
            exact
            path="/"
            element={<MainPage listFood={listFood} isLoggedIn={isLoggedIn}/>}
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
