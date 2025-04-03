// Function to  validate the usernmae and password
// in the frontend signup form

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
        alert("Username must be 3-20 characters long and can only contain letters, numbers and underscores");
        return false;
    }   

    // Check if password is valid using .test() method
    if (password.length < 8) {
        // alert the user that password is invalid
        alert("Password must be at least 8 characters long");
        return false;
    }

    // Check if password contains at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        // alert the user that password is invalid
        alert("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
        return false;
    }

    // If all checks pass, return true
    return true;
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {

    // Get the form element ... this is how we hook into the form
    const form = document.getElementById("signup-form");

    form.addEventListener("submit", async (event) => {

        // Prevent the default form submission
        event.preventDefault();

        // Get the values from the form fields
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        console.log("Username: ", username);
        console.log("Password: ", password);
        console.log("Confirm Password: ", confirmPassword);

        // Validate the username and password
        if (!isValidCredentials(username, password)) {
            alert("Invalid username or password");
            return;
        }

        // Check if the username is empty
        if (!username) {
            alert("Username is required");
            return;
        }

        // Check if the password is empty
        if (!password) {
            alert("Password is required");
            return;
        }

        // Check if the confirm password is empty
        if (!confirmPassword) {
            alert("Confirm password is required");
            return;
        }

        // Check if the passwords match
        if (password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }

        // Send the data to the server
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })

            });
            // Check if the response is ok
            const data = await res.json();

            if (res.ok) {
                alert("User created successfully");
                // Redirect to the login page
                window.location.href = "/homepage.html";
            }
            else {
                alert(`Error: ${data.message}`);
            }

        } catch(error) {
            console.error(`Error: ${error}`);
            alert("An error occurred while creating the user");
        }
    })
});

// When the user submits the form, JS:

// Prevents the default page reload

// Gets the username/password/confirm-password

// Validates that passwords match

// Sends a POST request to your backend route (/api/signup)

// Backend hashes password + saves user to MongoDB

// If successful, frontend redirects user to login


