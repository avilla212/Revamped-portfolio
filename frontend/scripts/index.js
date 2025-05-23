
document.addEventListener("DOMContentLoaded", () => {
    const backendURL = "https://revamped-portfolio-production.up.railway.app"
    const form = document.getElementById("login-form");

    form?.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${backendURL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
                credentials: "include", // Include credentials (cookies) in the request
                
            })

            const data = await res.json(); // Parse the JSON response

            if (res.ok) {
                alert('Login successful!'); // Show success message
                // If the response is ok, redirect to the dashboard
                // Redirect to the homepage after successful login
                window.location.href = "https://revamped-portfolio-production.up.railway.app/homepage_protected.html";
            } else {
                alert(data.message); // Show error message
            }
        } catch (error){
            alert('An error occurred while logging in. Please try again.'); // Show error message
        }

    });
})