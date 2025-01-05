document.getElementById('viewRecordsModal').addEventListener('click', async () => {
    try {
        const response = await fetch('/user/records');
        const records = await response.json();

        const recordsContainer = document.getElementById('recordsContainer');
        recordsContainer.innerHTML = '';

        records.forEach((record) => {
            const recordDiv = document.createElement('div');
            recordDiv.innerHTML = `
                <p><strong>Date:</strong> ${new Date(record.recorded_date).toLocaleString()}</p>
                <p><strong>Usage:</strong> ${record.water_usage} m³</p>
                <p><strong>Notes:</strong> ${record.notes || 'None'}</p>
                <hr>`;
            recordsContainer.appendChild(recordDiv);
        });
    } catch (error) {
        console.error('Error fetching records:', error);
        alert('Failed to load records.');
    }
});
