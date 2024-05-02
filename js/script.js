async function fetchPortfolioPerformance() {
    try {
        const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=0J7ICH25DEM1L296');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching portfolio performance data:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

// Function to update the dropdown with available years
function populateYearSelect(years) {
    const yearSelect = document.getElementById('yearSelect');
    yearSelect.innerHTML = ''; // Clear previous options

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Function to update the chart based on the selected year
function updateChart(selectedYear) {
    // Fetch portfolio performance data for the selected year
    fetchPortfolioPerformance()
        .then(data => {
            // Use the data to update the chart
            console.log(`Update chart with data for year: ${selectedYear}`);
        });
}

// Initial setup
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch portfolio performance data and populate the dropdown on page load
        const data = await fetchPortfolioPerformance();
        populateYearSelect(Object.keys(data['Time Series (Daily)'])); // Populate the dropdown with available years
        // Update the chart with data for the first year by default
        const firstYear = Object.keys(data['Time Series (Daily)'])[0];
        updateChart(firstYear, data);
    } catch (error) {
        console.error('Error during initial setup:', error);
    }
});
