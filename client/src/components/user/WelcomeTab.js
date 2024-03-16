import mascot from '../../img/mascot.png';

function WelcomeTab() {
  return (
    <section id="welcome-container">
      <div id="welcome-tab">
        <img src={mascot} alt="Mascot icon" />
        <h2>Welcome aboard!</h2>
        <h3>Just a couple of clicks to get started</h3>
      </div>
    </section>
  );
}

export default WelcomeTab;