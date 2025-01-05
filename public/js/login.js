document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const loginLink = document.getElementById('loginLink');
    const closeModal = loginModal.querySelector('.close');
    const loginForm = document.getElementById('loginForm');

    // Open modal when the login link is clicked
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    // Close modal when the close button is clicked
    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Extract form values
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Send login request to the backend
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Show success popup
                alert(result.message);

                // Redirect to profile page if redirect URL exists
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                }
            } else {
                alert(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    });
});
