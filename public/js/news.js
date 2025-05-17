let news = [];

function fetchNews() {
    fetch('/api/news?action=get')
        .then(response => response.json())
        .then(data => {
            news = data;
            displayNews();
        })
        .catch(error => console.error('Error fetching news:', error));
}

function displayNews() {
    const newsContainer = document.getElementById('news-section');
    newsContainer.innerHTML = ''; // Clear previous news

    if (news.length === 0) {
        newsContainer.innerHTML = '<p>No news available.</p>';
        return;
    }

    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const image = document.createElement('img');
        image.src = item.image || '/images/home.jpg'; // Default image if none provided
        image.alt = item.title;

        const newsContent = document.createElement('div');
        newsContent.className = 'news-content';

        const title = document.createElement('h2');
        title.textContent = item.title;

        const content = document.createElement('p');
        content.textContent = item.content;

        newsContent.appendChild(title); // Append 'h2' to news-content div
        newsContent.appendChild(content); // Append 'p' to news-content div
        newsItem.appendChild(image); // Append 'img' to news-item
        newsItem.appendChild(newsContent); // Append news-content div to news-item
        newsContainer.appendChild(newsItem);  // Append the news-item to the section
    });
}