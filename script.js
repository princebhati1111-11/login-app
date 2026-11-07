const authForm = document.getElementById('authForm');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleBtn = document.getElementById('toggle-btn');
const toggleText = document.getElementById('toggle-text');

let isLoginMode = true;

// Login aur Signup form ke beech switch karne ke liye
toggleBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        toggleBtn.textContent = 'Sign Up';
        toggleText.textContent = "Don't have an account? ";
    } else {
        formTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        toggleBtn.textContent = 'Login';
        toggleText.textContent = "Already have an account? ";
    }
});

// Form submit hone par backend ko data bhejne ke liye
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const endpoint = isLoginMode ? '/api/login' : '/api/signup';

    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok && !isLoginMode) {
            // Signup ke baad automatically login mode par le aayein
            toggleBtn.click();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server se connect nahi ho pa raha hai!');
    }
});