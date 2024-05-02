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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch and display all news articles initially
        const allNews = await fetchNews('all');
        displayNews(allNews);

        const marketSelect = document.getElementById('market');
        marketSelect.addEventListener('change', async (event) => {
            const market = event.target.value;
            const allNews = await fetchNews('all'); // Fetch all news again
            const filteredNews = filterNewsByMarket(allNews, market);
            displayNews(filteredNews);
        });
    } catch (error) {
        console.error('Error during initial setup:', error);
    }
});

// function to fetch news articles 
async function fetchNews(market) {
    const apiKey = '951ab660c2f04a8e8a2f5cd410333d22';
    let url = `https://newsapi.org/v2/everything?q=${market}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}

// Function to filter news articles by market
function filterNewsByMarket(news, market) {
    if (market === 'all') {
        return news; // Return all news articles if market is 'all'
    }

    // Filter news articles based on the selected market
    const filteredNews = news.filter(article => {
        // Check if the article's title or description contains the market keyword
        return article.title.toLowerCase().includes(market) || article.description.toLowerCase().includes(market);
    });

    return filteredNews;
}

// display news articles
function displayNews(articles) {
    const displayNewsSection = document.getElementById('displayNews');
    displayNewsSection.innerHTML = ''; // Clear previous news articles

    articles.forEach(article => {
        // Create elements to display each news article
        const articleContainer = document.createElement('div');
        articleContainer.classList.add('news-article');

        const title = document.createElement('h3');
        title.textContent = article.title;

        const description = document.createElement('p');
        description.textContent = article.description;

        // Append elements to the container
        articleContainer.appendChild(title);
        articleContainer.appendChild(description);

        // Append the container to the displayNews section
        displayNewsSection.appendChild(articleContainer);
    });
}

// Event listener for market filter change
document.getElementById('market').addEventListener('change', async function() {
    const market = this.value;
    try {
        const allNews = await fetchAllNews();
        const filteredNews = filterNewsByMarket(allNews, market);
        displayNews(filteredNews);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
});

// Fetch news articles on page load
document.addEventListener('DOMContentLoaded', async function() {
    const defaultMarket = 'all'; // Default to fetching all news articles
    try {
        const allNews = await fetchAllNews();
        displayNews(allNews);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
});



