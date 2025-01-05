document.getElementById('recordUsageForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const waterUsage = document.getElementById('waterUsage').value;
    const notes = document.getElementById('notes').value;

    try {
        const response = await fetch('/user/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ waterUsage, notes }),
        });

        const result = await response.json();
        alert(result.message);
        if (response.ok) {
            document.getElementById('recordUsageModal').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to record water usage.');
    }
});
