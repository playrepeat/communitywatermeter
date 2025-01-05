// Modal functionality
const modal = document.getElementById('registrationModal');
const registerLink = document.getElementById('registerLink');
const closeModal = document.querySelector('.modal .close');

// Open modal
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle registration form submission
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(registrationForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Registration successful! Redirecting to home page. Please log in!';
            registrationForm.appendChild(successMessage);

            // Close modal and redirect after 2 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                window.location.href = '/';
            }, 2000);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
});
