document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registrationModal');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterLink = document.getElementById('closeRegisterLink');

    // Open Login Modal
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    // Close Login Modal
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Open Register Modal
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'block';
    });

    // Close Register Modal
    closeRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none'; // Corrected to hide the modal
    });


    // Close Modal on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
});
