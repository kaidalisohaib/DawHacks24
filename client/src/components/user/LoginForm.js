function LoginForm() {

  return (
    <section id="user-login-form">
      <form id="login-form">
        <h1>This part won't work yet</h1>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        {/* placeholder */}
        <a href="google.ca">Forgot password?</a>
        <input type="submit" value="Log in"/>
      </form>
      <div class="separator">
        <span>But this will</span>
      </div>
    </section>
    
  );
}

export default LoginForm;