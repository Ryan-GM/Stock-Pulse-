// $(document).ready(function() {
//     // Validate login form
//     $('#login-form').submit(function(event) {
//         let username = $('#username').val();
//         let password = $('#password').val();

//         // Simple validation example: check if fields are not empty
//         if (!username || !password) {
//             alert('Please enter both username and password.');
//             event.preventDefault(); // Prevent form submission
//         } else {
//             // Simulate successful login for demonstration
//             // Replace this with actual login validation
//             // For example, you can use AJAX to send credentials to the server for verification
//             // and based on the response, decide whether to show the main content or display an error message.
//             if (username === "user" && password === "password") {
//                 $('#login-section').hide(); // Hide login section
//                 $('.wrapper').show(); // Show main content
//             } else {
//                 alert('Invalid username or password.');
//                 event.preventDefault(); // Prevent form submission
//             }
//         }
//     });
// });


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
        // Filter data for the selected year
        const timeSeries = data['Time Series (Daily)'];
        const selectedYearData = Object.entries(timeSeries)
            .filter(([date]) => date.startsWith(selectedYear))
            .reduce((obj, [date, value]) => {
                obj[date] = value;
                return obj;
            }, {});

        // Extracting data for Chart.js
        const chartLabels = Object.keys(selectedYearData).reverse();
        const chartData = chartLabels.map(date => selectedYearData[date]['4. close']);

        // Chart.js Configuration
        const ctx = document.getElementById('chart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Closing Price',
                    data: chartData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error updating chart:', error);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch portfolio performance data and populate the dropdown on page load
        const data = await fetchPortfolioPerformance();
        populateYearSelect(Object.keys(data['Time Series (Daily)'])); // Populate the dropdown with available years
        // Update the chart with data for the first year by default
        const firstYear = Object.keys(data['Time Series (Daily)'])[0];
        updateChart(firstYear);
    } catch (error) {
        console.error('Error during initial setup:', error);
    }
});                
           
//dividends chart
window.onload = function() {
    var ctx = document.getElementById('dividendChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Dividend Income',
                data: [50, 40, 60, 80, 30, 20],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#fff'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
};
        fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=XZXJN14OQJFCSEL1.')
            .then(response => response.json())
            .then(data => {
                // Extract the data from the API response
                const dailyData = data['Time Series (Daily)'];
        
                // Create a new Chart.js chart
                const ctx = document.getElementById('chart').getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            data: Object.values(dailyData).map(dayData => {
                                return [
                                    dayData['1. open'],
                                    dayData['3. low'],
                                    dayData['3. low'],
                                    dayData['2. high'],
                                    dayData['4. close']
                                ];
                            }),
                            label: 'IBM'
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left'
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            });
