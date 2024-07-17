function showLoginForm() {
    const loginForm = document.getElementById("loginForm");
    loginForm.style.display = "block";
}

function authenticate(event) {
    event.preventDefault(); // Prevent default form submission

    // Replace with your actual authentication logic
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Example authentication check (replace with your logic)
    if (username === "begzod" && password === "begzod7777") {
        alert("Login successful!");
        window.location.href = "page/admin.html"; // Redirect to index.html
    } else {
        alert("Invalid username or password. Please try again.");
    }
}




// form main login pogin birnarsa bir narsa


function showLoginForm() {
    document.getElementById('loginFormModal').style.display = 'block';
}

function closeLoginForm() {
    document.getElementById('loginFormModal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('loginFormModal')) {
        closeLoginForm();
    }
}

