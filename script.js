const API_KEY = "1932816420f34617b2c061162fba7fc0";
const url = "https://newsapi.org/v2/everything?q=";

async function fetchData(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        
        if (res.status === 426) {
            throw new Error("426 Upgrade Required: Ensure your request is being made over HTTPS.");
        }

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return null;
    }
}

fetchData("all").then(data => {
    if (data && data.articles) {
        renderMain(data.articles);
    } else {
        document.querySelector("main").innerHTML = "<p>Error: Unable to load articles.</p>";
    }
});

// Menu button functionality
const mobilemenu = document.querySelector(".mobile");
const menuBtn = document.querySelector(".menuBtn");

menuBtn.addEventListener("click", () => {
    mobilemenu.classList.toggle("hidden");
});

function renderMain(arr) {
    if (!Array.isArray(arr)) {
        console.error("renderMain expects an array but got", typeof arr);
        document.querySelector("main").innerHTML = "<p>Error: Unable to load articles.</p>";
        return;
    }
    if (Array.isArray(arr)) {
        let mainHTML = '';
        arr.forEach(article => {
            if (article.urlToImage) {
                mainHTML += `<div class="card">
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
                                    <button class="share-btn" onclick="shareArticle('${encodeURIComponent(article.url)}')"><i class="fa-solid fa-share"></i> Share</button>
                                    <button class="save-btn" onclick="saveArticle('${encodeURIComponent(article.url)}', '${encodeURIComponent(article.title)}')"><i class="fa-solid fa-bookmark"></i> Save</button>
                                    <button class="share-btn" onclick="shareArticle('${article.url}')"><i class="fa-solid fa-share"></i> Share</button>
                                    <button class="save-btn" onclick="saveArticle('${article.url}', '${article.title}')"><i class="fa-solid fa-bookmark"></i> Save</button>
                                </div>
                            </div>`;
            }
        });
        document.querySelector("main").innerHTML = mainHTML;
    } else {
        console.error("renderMain expects an array but got", typeof arr);
        document.querySelector("main").innerHTML = "<p>Error: Unable to load articles.</p>";
    }
}

// Search functionality
const searchBtn = document.getElementById("searchForm");
const searchBtnMobile = document.getElementById("searchFormMobile");
const searchInputMobile = document.getElementById("searchInputMobile");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = await fetchData(searchInput.value);
    if (data && data.articles) renderMain(data.articles);
});

searchBtnMobile.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = await fetchData(searchInputMobile.value);
    if (data && data.articles) renderMain(data.articles);
});

// Share article
function shareArticle(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this news article',
            url: url
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        alert('Share feature not supported on this browser. Copy the URL manually: ' + url);
    }
}

// Save article
function saveArticle(url, title) {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    savedArticles.push({ url, title });
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    alert('Article saved!');
}
