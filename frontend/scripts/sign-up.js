// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {

    // Get the form element ... this is how we hook into the form
    const form = document.getElementById("signup-form");

    form.addEventListener("submit", async (event) => {

        // Prevent the default form submission
        event.preventDefault();

        // Get the values from teh form fields
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        console.log("Username: ", username);
        console.log("Password: ", password);
        console.log("Confirm Password: ", confirmPassword);

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


