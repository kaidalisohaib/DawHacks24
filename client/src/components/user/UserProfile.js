import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import '../../styles/UserProfile.css';
import blank from '../../img/blank.png';

function UserProfile({setIsLoggedIn}) {
  const [user, setUser] = useState(null);
  const [customFoods, setCustomFoods] = useState([]);
  const navigate = useNavigate();

  async function userSession(){
    const resp = await fetch('/auth/session');
    if (resp.status === 200) {
      const user = await resp.json();
      setUser(user.user);
    }
  }

  async function getCustomFoods() {
    const resp = await fetch('/food-buds/api/v1/custom-all-foods');
    if (resp.status === 200) {
      const allCustomFoods = await resp.json();
      setCustomFoods(allCustomFoods.allCustomFoods);
    }
  }

  const handleLogout = async () => {
    await fetch('/auth/logout', {
      method: 'POST',
    });
    toast.success('Successfully logged out!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    setIsLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    userSession();
    getCustomFoods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // waiting for user
  if (!user) {
    return <>
      <section id="user-profile-container">
        <h1>Loading...</h1>
      </section>
    </>;
  }

  if (user.error && user.error === 'not logged in') {
    return <>
      <section id="user-profile-container">
        <h1 id="not-login">It seems that you aren't logged in.</h1>
      </section>
    </>;
  }

  return <>
    <section id="user-profile-container">
      <section id="user-info-container">
        <UserInfo user={user} handleLogout={handleLogout}/>
      </section>
      <section id="user-food-tabs">
        <UserCustomIngredients customFoods={customFoods}/>
        <UserDailyGoals />
      </section>
    </section>
    <ToastContainer />
  </>;
}

function UserInfo({user, handleLogout}) {
  return (
    <section id="user-info">
      <img src={user.profileImageURI ? user.profileImageURI : blank} alt="Profile pic" />
      <h2>{user.name}</h2>
      <button id="logout-btn" onClick={handleLogout}>Logout</button>
    </section>
  );
}

function UserCustomIngredients({customFoods}) {
  const customFoodsLis = [];

  // if no custom foods, display warning paragraph
  if (customFoods.length === 0) {
    customFoodsLis.push(
      <NoFoodsParagraph />
    );
  } else { 
    for (const food of customFoods) {
      customFoodsLis.push(
        <SingleCustomIngredient foodName={food.name}/>
      );
    }
  }

  return (
    <section id="custom-ingredients">
      <h2>Your custom ingredients</h2>
      <ul id="custom-foods-ul">
        {customFoodsLis}
      </ul>
      <Link to="/custom-ingredient">
        <button className="functionality-btn">Create new ingredient</button>
      </Link>
    </section>
  );
}

function SingleCustomIngredient({foodName}) {
  return <>
    {/** @TODO onClick redirect to edit food */}
    <li>{foodName}</li>
  </>;
}

function NoFoodsParagraph() {
  return <>
    <p>It seems you haven't created custom ingredients yet.
    You can get started by pressing the button below.</p>  
  </>;
}

/**
 * @TODO display user goals/percentages/whatnot
 */
function UserDailyGoals() {
  return (
    <section id="user-goals">
      <h2>Your daily goals</h2>
      <ul>
        {/* These are only place holders */}
        <li>Calories: <span className="daily-goals-numers">850/1000</span></li>
        <li>Fat: <span className="daily-goals-numers">25g/50g</span></li>
        <li>Protein: <span className="daily-goals-numers">200g/100g</span></li>
        <li>Vitamic C: <span className="daily-goals-numers">20mg/25mg</span></li>
      </ul>
      {/* I will add a link to the ModifyGoals page*/}
      <Link to="/modify-goals">
        <button className="functionality-btn">Modify Goals</button>
      </Link>
    </section>
  );
}

export default UserProfile;