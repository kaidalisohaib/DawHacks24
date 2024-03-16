import '../App.css';
import food from '../img/fruits.jpg';
/**
 * AboutUs renders a text explaining the company's goals 
 * 
 * @component
 */
function AboutUs() {
  // WIP
  return (
    <section id="about-us-container">
      <div id="about-us-text">
        <h1>About Us</h1>
        <p>
          At FoodBud, we are passionate about simplifying and enhancing people's daily lives 
          through 
          technology.
        </p>
        <h3>Our Mission</h3>
        <p>
          Our mission is to empower individuals to take control of 
          their health and wellness journey by 
          providing them with a user-friendly platform that simplifies 
          the process of 
          tracking daily calorie intake.
        </p>
        <h3>What We Do</h3>
        <p>
        Our application allows users to effortlessly 
        track their calorie consumption throughout the day, 
        allowing them to have a better insight into their nutritional intake 
        and allowing them to make informed decisions about their diet. 
        </p>
        <h3>Join Us on Our Journey</h3>
        <p>
        Join us as we embark on this exciting journey to 
        revolutionize the way people approach their health 
        and wellness goals. Whether you're a fitness enthusiast, 
        a health-conscious individual, or someone simply looking to lead 
        a healthier lifestyle, our application is designed to help you 
        achieve your goals and live your best life.
        </p>
      </div>
      <img id="fruit-pic" src={food} alt="fruits"/>
    </section>
  );
}

export default AboutUs;