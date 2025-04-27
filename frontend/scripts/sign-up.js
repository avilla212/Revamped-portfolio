
// This code is executed when the DOM is fully loaded
const isValidCredentials = (username, password) => {
  // Regex: allows only letters, numbers and underscores between 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  // Regex: matches any whitespace
  const hasSpaces = /\s/;

  // Check for spaces in username using .test() method
  // .test() will test for matching in a string and return true/false
  if (hasSpaces.test(username)) {
    // alert the user that username cannot contain spaces
    alert("Username cannot contain spaces");
    return false;
  }

  // Check if username is valid using .test() method
  if (!usernameRegex.test(username)) {
    // alert the user that username is invalid
    alert(
      "Username must be 3-20 characters long and can only contain letters, numbers and underscores"
    );
    return false;
  }

  // Check if password is valid using .test() method
  if (password.length < 8) {
    // alert the user that password is invalid
    alert("Password must be at least 8 characters long");
    return false;
  }

  // Check if password contains at least one uppercase letter, one lowercase letter, one number and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    // alert the user that password is invalid
    alert(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    );
    return false;
  }

  // If all checks pass, return true
  return true;
};

// unified handler for mobile and desktop forms
const handleForm = (form) => {
  const backendURL = "https://revamped-portfolio-production.up.railway.app";

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = form.querySelector('input[name="username"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();
    const confirmPassword = form
      .querySelector('input[name="confirm-password"]')
      .value.trim();

    // validate credentials
    if (!isValidCredentials(username, password)) {
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("User created!");
        window.location.href = '/homepage_protected.html' // Redirect to the homepage after successful signup

      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(error);
    }
  });
};

// attach handlers to both forms
document.addEventListener("DOMContentLoaded", () => {
  const desktopForm = document.getElementById("desktop-signup-form");
  const mobileForm = document.getElementById("mobile-signup-form");

  handleForm(desktopForm);
  handleForm(mobileForm);
});
