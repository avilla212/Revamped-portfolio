// Frontend handles 
// 1. User input
// 2. Sending data via fetch()
// 3. Redirecting to another page

// Backend:
// 1. Validate user input
// 2. Check mongodb for user
// 3. Verification of password
// 4. Return success or failure

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    form?.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            })

            const data = await res.json(); // Parse the JSON response

            if (res.ok) {
                alert('Login successful!'); // Show success message
                // If the response is ok, redirect to the dashboard
                window.location.href = "/homepage.html";
            } else {
                alert(data.message); // Show error message
            }
        } catch (error){
            console.error(`Error: ${error.message}`); // Log the error message
            alert('An error occurred while logging in. Please try again.'); // Show error message
        }

    });
})