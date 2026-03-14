const TMDB_API_KEY = '1faafd11570b24453ac3441da421c441';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

async function fetchTMDB(endpoint, params = {}) {
    const url = new URL(`${TMDB_BASE}${endpoint}`);
    url.searchParams.set('api_key', TMDB_API_KEY);
    url.searchParams.set('language', 'en-US');
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB fetch failed');
    return res.json();
}

function tmdbToMovie(item, type = 'movie', flags = {}) {
    const isTV = type === 'tv';
    return {
        id: `tmdb_${type}_${item.id}`,
        tmdbId: item.id,
        tmdbType: type,
        title: isTV ? item.name : item.title,
        category: isTV ? 'webseries' : 'hollywood',
        releaseDate: isTV ? (item.first_air_date || 'TBA') : (item.release_date || 'TBA'),
        platform: item.networks?.[0]?.name?.toLowerCase().includes('netflix') ? 'netflix'
            : item.networks?.[0]?.name?.toLowerCase().includes('prime') ? 'prime'
            : item.networks?.[0]?.name?.toLowerCase().includes('hotstar') ? 'hotstar'
            : 'theaters',
        image: item.poster_path ? `${TMDB_IMG}${item.poster_path}` : `https://via.placeholder.com/280x400/1a1a2e/e94560?text=${encodeURIComponent(isTV ? item.name : item.title)}`,
        description: item.overview || 'No description available.',
        cast: '',
        story: item.overview || '',
        trailer: '',
        rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
        ...flags
    };
}

// Sample Movie Data (fallback)
const moviesData = [
    {
        id: 1,
        title: "Guardians of the Galaxy Vol. 3",
        category: "hollywood",
        releaseDate: "May 5, 2024",
        platform: "theaters",
        image: "https://via.placeholder.com/280x400/1a1a2e/e94560?text=Guardians+3",
        description: "The final chapter in the Guardians trilogy brings emotional closure to beloved characters.",
        cast: "Chris Pratt, Zoe Saldana, Dave Bautista, Karen Gillan",
        story: "In Marvel Studios' Guardians of the Galaxy Vol. 3, our beloved band of misfits is settling into life on Knowhere. But it isn't long before their lives are upended by the echoes of Rocket's turbulent past. Peter Quill, still reeling from the loss of Gamora, must rally his team around him on a dangerous mission to save Rocket's life—a mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
        trailer: "https://www.youtube.com/embed/u3V5KDHRQvk",
        trending: true
    },
    {
        id: 2,
        title: "Pathaan",
        category: "bollywood",
        releaseDate: "January 25, 2024",
        platform: "prime",
        image: "https://via.placeholder.com/280x400/1a1a2e/e94560?text=Pathaan",
        description: "An action-packed spy thriller featuring Shah Rukh Khan in a high-octane role.",
        cast: "Shah Rukh Khan, Deepika Padukone, John Abraham",
        story: "Pathaan, a RAW agent, is on a mission to stop a mercenary organization from launching an attack that threatens India's security. With stunning action sequences and international locations, this spy thriller keeps you on the edge of your seat.",
        trailer: "https://www.youtube.com/embed/vqu4z34wENw",
        trending: true
    },
    {
        id: 3,
        title: "RRR: Rise Roar Revolt",
        category: "south",
        releaseDate: "March 25, 2024",
        platform: "netflix",
        image: "https://via.placeholder.com/280x400/1a1a2e/e94560?text=RRR",
        description: "Epic period action drama showcasing the fictional story of two legendary revolutionaries.",
        cast: "N.T. Rama Rao Jr., Ram Charan, Alia Bhatt, Ajay Devgn",
        story: "A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s. An epic tale of friendship, bravery, and sacrifice set against the backdrop of India's freedom struggle.",
        trailer: "https://www.youtube.com/embed/GY4CDmUv1ik",
        trending: true
    },
    {
        id: 4,
        title: "Stranger Things Season 5",
        category: "webseries",
        releaseDate: "July 15, 2024",
        platform: "netflix",
        image: "https://via.placeholder.com/280x400/1a1a2e/e94560?text=Stranger+Things+5",
        description: "The final season of the beloved sci-fi horror series promises epic conclusions.",
        cast: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour",
        story: "The final chapter of Stranger Things brings the epic story to a close. As Hawkins faces its greatest threat yet, our heroes must band together one last time to save their town and possibly the world from the Upside Down.",
        trailer: "https://www.youtube.com/embed/yQEondeGvKo",
        upcoming: true
    },
    {
        id: 5,
        title: "Jawan",
        category: "bollywood",
        releaseDate: "September 7, 2024",
        platform: "hotstar",
        image: "https://via.placeholder.com/280x400/1a1a2e/e94560?text=Jawan",
        description: "A high-octane action thriller with Shah Rukh Khan in a never-seen-before avatar.",
        cast: "Shah Rukh Khan, Nayanthara, Vijay Sethupathi, Deepika Padukone",
        story: "A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago. He comes up against a monstrous outlaw with no fear, who's caused extreme suffering to many.",
        trailer: "https://www.youtube.com/embed/BUjXzrgntcY",
        upcoming: true
    },
    {
        id: 6,
        title: "The Last of Us Season 2",
        category: "webseries",
        releaseDate: "August 20, 2024",
        platform: "prime",
        image: "https://via.placeholder.com/280x400/1a1a2e/e94560?text=The+Last+of+Us+2",
        description: "The critically acclaimed post-apocalyptic series returns for its second season.",
        cast: "Pedro Pascal, Bella Ramsey, Gabriel Luna",
        story: "Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming. Living amongst a thriving community gives them stability, despite the constant threat of the infected and other survivors.",
        trailer: "https://www.youtube.com/embed/uLtkt8BonwM",
        upcoming: true
    }
];



// TMDB API Loaders
async function loadTMDBTrending() {
    try {
        const [movies, tv] = await Promise.all([
            fetchTMDB('/trending/movie/day'),
            fetchTMDB('/trending/tv/day')
        ]);
        const items = [
            ...movies.results.slice(0, 6).map(m => tmdbToMovie(m, 'movie', { trending: true })),
            ...tv.results.slice(0, 4).map(t => tmdbToMovie(t, 'tv', { trending: true }))
        ];
        trendingGrid.innerHTML = items.map(createMovieCard).join('');
    } catch (e) {
        console.warn('TMDB trending failed, using local data', e);
        trendingGrid.innerHTML = moviesData.filter(m => m.trending).map(createMovieCard).join('');
    }
}

async function loadTMDBUpcoming() {
    try {
        const [movies, tv] = await Promise.all([
            fetchTMDB('/movie/upcoming', { region: 'US' }),
            fetchTMDB('/tv/on_the_air')
        ]);
        const items = [
            ...movies.results.slice(0, 6).map(m => tmdbToMovie(m, 'movie', { upcoming: true })),
            ...tv.results.slice(0, 4).map(t => tmdbToMovie(t, 'tv', { upcoming: true }))
        ];
        upcomingGrid.innerHTML = items.map(createMovieCard).join('');
    } catch (e) {
        console.warn('TMDB upcoming failed, using local data', e);
        upcomingGrid.innerHTML = moviesData.filter(m => m.upcoming).map(createMovieCard).join('');
    }
}

async function loadTMDBOTT() {
    try {
        const [netflix, prime, hotstar] = await Promise.all([
            fetchTMDB('/discover/tv', { with_networks: '213', sort_by: 'first_air_date.desc' }),   // Netflix
            fetchTMDB('/discover/tv', { with_networks: '1024', sort_by: 'first_air_date.desc' }),  // Prime
            fetchTMDB('/discover/tv', { with_networks: '3919', sort_by: 'first_air_date.desc' })   // Hotstar
        ]);
        const items = [
            ...netflix.results.slice(0, 4).map(t => ({ ...tmdbToMovie(t, 'tv'), platform: 'netflix' })),
            ...prime.results.slice(0, 4).map(t => ({ ...tmdbToMovie(t, 'tv'), platform: 'prime' })),
            ...hotstar.results.slice(0, 4).map(t => ({ ...tmdbToMovie(t, 'tv'), platform: 'hotstar' }))
        ];
        ottGrid.innerHTML = items.map(createMovieCard).join('');
    } catch (e) {
        console.warn('TMDB OTT failed, using local data', e);
        ottGrid.innerHTML = moviesData.map(createMovieCard).join('');
    }
}

async function loadTrailer(tmdbId, tmdbType, containerId) {
    try {
        const data = await fetchTMDB(`/${tmdbType}/${tmdbId}/videos`);
        const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
            document.getElementById(containerId).innerHTML = `
                <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    } catch (e) { /* no trailer */ }
}

async function loadCredits(tmdbId, tmdbType, castId) {
    try {
        const data = await fetchTMDB(`/${tmdbType}/${tmdbId}/credits`);
        const cast = data.cast.slice(0, 5).map(c => c.name).join(', ');
        document.getElementById(castId).textContent = cast || 'N/A';
    } catch (e) { /* no credits */ }
}

// Search TMDB
async function searchTMDB(query) {
    try {
        const [movies, tv] = await Promise.all([
            fetchTMDB('/search/movie', { query }),
            fetchTMDB('/search/tv', { query })
        ]);
        return [
            ...movies.results.slice(0, 6).map(m => tmdbToMovie(m, 'movie')),
            ...tv.results.slice(0, 4).map(t => tmdbToMovie(t, 'tv'))
        ];
    } catch (e) {
        return moviesData.filter(m =>
            m.title.toLowerCase().includes(query) ||
            m.description.toLowerCase().includes(query)
        );
    }
}

// DOM Elements
const trendingGrid = document.getElementById('trendingGrid');
const upcomingGrid = document.getElementById('upcomingGrid');
const ottGrid = document.getElementById('ottGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const ottBtns = document.querySelectorAll('.ott-btn');
const scrollTopBtn = document.getElementById('scrollTop');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const modal = document.getElementById('movieModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTMDBTrending();
    loadTMDBUpcoming();
    loadTMDBOTT();
    setupEventListeners();
});

// Render Movies (local fallback)
function renderMovies() {
    trendingGrid.innerHTML = moviesData.filter(m => m.trending).map(createMovieCard).join('');
    upcomingGrid.innerHTML = moviesData.filter(m => m.upcoming).map(createMovieCard).join('');
    ottGrid.innerHTML = moviesData.map(createMovieCard).join('');
}

// Create Movie Card
function createMovieCard(movie) {
    const idAttr = typeof movie.id === 'string' ? `'${movie.id}'` : movie.id;
    const rating = movie.rating ? `<span><i class="fas fa-star" style="color:#f5c518"></i> ${movie.rating}</span>` : '';
    return `
        <div class="movie-card" data-id="${movie.id}" data-category="${movie.category}" data-platform="${movie.platform}">
            <img src="${movie.image}" alt="${movie.title}" loading="lazy">
            <div class="movie-card-content">
                <h3>${movie.title}</h3>
                <div class="movie-meta">
                    <span><i class="fas fa-calendar"></i> ${movie.releaseDate}</span>
                    <span><i class="fas fa-tv"></i> ${movie.platform}</span>
                    ${rating}
                </div>
                <p>${movie.description.substring(0, 100)}${movie.description.length > 100 ? '...' : ''}</p>
                <button class="read-more-btn" onclick="openModal(${idAttr})">Read More</button>
            </div>
        </div>
    `;
}

// Open Modal
async function openModal(movieId) {
    // Find in local data or reconstruct from TMDB card
    let movie = moviesData.find(m => m.id === movieId);

    // For TMDB items, find from rendered cards
    if (!movie) {
        const card = document.querySelector(`[data-id="${movieId}"]`);
        if (!card) return;
        // Reconstruct minimal movie from card DOM
        movie = {
            id: movieId,
            tmdbId: movieId.toString().replace(/^tmdb_(movie|tv)_/, ''),
            tmdbType: movieId.toString().startsWith('tmdb_tv') ? 'tv' : 'movie',
            title: card.querySelector('h3').textContent,
            image: card.querySelector('img').src,
            releaseDate: card.querySelectorAll('.movie-meta span')[0]?.textContent.replace(/.*\s/, '') || '',
            platform: card.querySelectorAll('.movie-meta span')[1]?.textContent.replace(/.*\s/, '') || '',
            category: card.dataset.category,
            story: card.querySelector('p').textContent,
            cast: 'Loading...'
        };
    }

    const trailerId = 'modal-trailer-' + Date.now();
    const castId = 'modal-cast-' + Date.now();

    modalBody.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" class="modal-banner">
        <h2 class="modal-title">${movie.title}</h2>
        <div class="modal-meta">
            <span><i class="fas fa-calendar"></i> ${movie.releaseDate}</span>
            <span><i class="fas fa-tv"></i> ${(movie.platform || '').toUpperCase()}</span>
            <span><i class="fas fa-tag"></i> ${(movie.category || '').toUpperCase()}</span>
        </div>
        <div class="modal-section">
            <h3>Cast</h3>
            <p id="${castId}">${movie.cast || 'Loading...'}</p>
        </div>
        <div class="modal-section">
            <h3>Story</h3>
            <p>${movie.story || movie.description || ''}</p>
        </div>
        <div class="modal-section">
            <h3>Trailer</h3>
            <div class="trailer-container" id="${trailerId}">
                ${movie.trailer
                    ? `<iframe src="${movie.trailer}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                    : '<p style="color:var(--text-secondary)">Loading trailer...</p>'}
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load TMDB trailer & cast dynamically
    if (movie.tmdbId) {
        loadTrailer(movie.tmdbId, movie.tmdbType || 'movie', trailerId);
        if (!movie.cast || movie.cast === 'Loading...') {
            loadCredits(movie.tmdbId, movie.tmdbType || 'movie', castId);
        }
    }
}

// Close Modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Search Functionality
async function searchMovies() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        if (TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE') {
            loadTMDBTrending();
            loadTMDBUpcoming();
            loadTMDBOTT();
        } else {
            renderMovies();
        }
        return;
    }

    trendingGrid.innerHTML = '<p style="color:var(--text-secondary);text-align:center;grid-column:1/-1">Searching...</p>';
    upcomingGrid.innerHTML = '';
    ottGrid.innerHTML = '';

    const results = TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE'
        ? await searchTMDB(searchTerm)
        : moviesData.filter(m =>
            m.title.toLowerCase().includes(searchTerm) ||
            m.description.toLowerCase().includes(searchTerm) ||
            m.category.toLowerCase().includes(searchTerm)
        );

    trendingGrid.innerHTML = results.length
        ? results.map(createMovieCard).join('')
        : '<p style="color:var(--text-secondary);text-align:center;grid-column:1/-1">No results found.</p>';
}

// Category Filter
function filterByCategory(category) {
    const allCards = document.querySelectorAll('.movie-card');
    
    allCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// OTT Platform Filter
function filterByPlatform(platform) {
    const ottCards = ottGrid.querySelectorAll('.movie-card');
    
    ottCards.forEach(card => {
        if (platform === 'all' || card.dataset.platform === platform) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', searchMovies);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovies();
    });

    // Category Filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterByCategory(btn.dataset.category);
        });
    });

    // OTT Platform Filter
    ottBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ottBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterByPlatform(btn.dataset.platform);
        });
    });

    // Modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Mobile Menu Toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
                
                // Update active link
                document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Scroll to Top Button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Load More Button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn.addEventListener('click', () => {
        alert('Loading more articles... (This is a demo feature)');
    });
}

// Keyboard Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});
