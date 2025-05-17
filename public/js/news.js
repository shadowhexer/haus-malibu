let news = [];

console.log("Testing if JS runs inside HTML");
document.getElementById("news-section").innerHTML = "<h2>JS Works!</h2>";

function fetchNews() {
    fetch('/api/news?action=get-news')
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Raw response data:', data);
            if (!data || !data.news) {
                throw new Error('Invalid data structure received');
            }
            news = data.news;
            console.log("News: ", news);
            displayNews();
        })
        .catch(error => console.error('Error fetching news:', error));
}

function displayNews() {
    const newsContainer = document.getElementById('news-section');
    newsContainer.innerHTML = ''; // Clear previous news

    if (!Array.isArray(news) || news.length === 0) {
        newsContainer.innerHTML = '<p>No news available.</p>';
        return;
    }

    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const image = document.createElement('img');
        image.src = item.image || '/images/home.jpg'; // Default image if none provided
        image.alt = item.image_alt || 'News article image'; // Default alt text

        const newsContent = document.createElement('div');
        newsContent.className = 'news-content';

        const title = document.createElement('h2');
        title.textContent = item.title || 'Untitled';

        const content = document.createElement('p');
        content.textContent = item.content || 'No content available';

        newsContent.appendChild(title);
        newsContent.appendChild(content);
        newsItem.appendChild(image);
        newsItem.appendChild(newsContent);
        newsContainer.appendChild(newsItem);
    });
}