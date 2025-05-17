let news = [];

console.log("Testing if JS runs inside HTML");
document.getElementById("news-section").innerHTML = "<h2>JS Works!</h2>";

function fetchNews() {
    fetch('/api/news?action=get-news')
        .then(response => response.json())
        .then(data => {
            news = data.rooms;
            console.log("News: ", news);
            console.log("Data: ", data);
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