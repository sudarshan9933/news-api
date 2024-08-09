const API_KEY = "1932816420f34617b2c061162fba7fc0";
const API_URL = "https://newsapi.org/v2/everything?q=";

// Function to fetch data from the API
async function fetchData(query) {
    try {
        const response = await fetch(`${API_URL}${query}&apiKey=${API_KEY}`);
        
        if (response.status === 426) {
            throw new Error("426 Upgrade Required: Ensure your request is being made over HTTPS.");
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return null;
    }
}

// Function to render articles on the page
function renderMain(articles) {
    if (!Array.isArray(articles)) {
        console.error("Expected an array of articles but received", typeof articles);
        document.querySelector("main").innerHTML = "<p>Error: Unable to load articles.</p>";
        return;
    }

    let mainHTML = '';
    articles.forEach(article => {
        if (article.urlToImage) {
            mainHTML += `
                <div class="card">
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                        <img src="${article.urlToImage}" alt="${article.title}" loading="lazy" />
                        <h4>${article.title}</h4>
                        <div class="publishbyDate">
                            <p>${article.source.name}</p>
                            <span>•</span>
                            <p>${new Date(article.publishedAt).toLocaleDateString()}</p>
                        </div>
                        <div class="desc">${article.description}</div>
                    </a>
                    <div class="card-actions">
                        <button class="share-btn" onclick="shareArticle('${encodeURIComponent(article.url)}')">
                            <i class="fa-solid fa-share"></i> Share
                        </button>
                        <button class="save-btn" onclick="saveArticle('${encodeURIComponent(article.url)}', '${encodeURIComponent(article.title)}')">
                            <i class="fa-solid fa-bookmark"></i> Save
                        </button>
                    </div>
                </div>`;
        }
    });

    document.querySelector("main").innerHTML = mainHTML;
}

// Initial fetch and render
fetchData("all").then(data => {
    if (data && data.articles) {
        renderMain(data.articles);
    } else {
        document.querySelector("main").innerHTML = "<p>Error: Unable to load articles.</p>";
    }
});

// Menu button functionality
const mobileMenu = document.querySelector(".mobile");
const menuBtn = document.querySelector(".menuBtn");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Search functionality
document.getElementById("searchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value;
    const data = await fetchData(query);
    if (data && data.articles) renderMain(data.articles);
});

document.getElementById("searchFormMobile").addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInputMobile").value;
    const data = await fetchData(query);
    if (data && data.articles) renderMain(data.articles);
});

// Share article
function shareArticle(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this news article',
            url: decodeURIComponent(url)
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        alert('Share feature not supported on this browser. Copy the URL manually: ' + decodeURIComponent(url));
    }
}

// Save article
function saveArticle(url, title) {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    savedArticles.push({ url: decodeURIComponent(url), title: decodeURIComponent(title) });
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    alert('Article saved!');
}
