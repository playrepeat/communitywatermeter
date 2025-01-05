document.addEventListener('DOMContentLoaded', () => {
    const changePasswordModal = document.getElementById('changePasswordModal');
    const changePasswordLink = document.getElementById('changePasswordLink');
    const closeModal = changePasswordModal.querySelector('.close');
    const changePasswordForm = document.getElementById('changePasswordForm');

    // Open change password modal
    changePasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        changePasswordModal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        changePasswordModal.style.display = 'none';
    });

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === changePasswordModal) {
            changePasswordModal.style.display = 'none';
        }
    });

    // Handle password change form submission
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        try {
            const response = await fetch('/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Password updated successfully!');
                changePasswordModal.style.display = 'none';
            } else {
                alert(result.message || 'Failed to update password.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    });
});
