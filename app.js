/*
HOW TO TEST:
1. Open index.html in a browser
2. Click "Get Started" to setup profile
3. Fill in details and connect wallet (use "Generate Test Key")
4. Complete setup to access the app
5. Create posts, vote, and check leaderboard
6. All data is stored in localStorage - refresh to see persistence
*/

// App State
let currentUser = null;
let posts = [];
let votes = [];
let ambassadors = [];

// DOM Elements
const landingView = document.getElementById('landing-view');
const appView = document.getElementById('app-view');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const walletModal = document.getElementById('wallet-modal');
const createPostModal = document.getElementById('create-post-modal');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeEventListeners();
    checkUserAuth();
    seedTestData();
    
    // Initialize feature animations
    setTimeout(() => {
        handleFeatureAnimations();
    }, 500);
});

// Load data from localStorage
function loadData() {
    const userData = localStorage.getItem('ambassadorApp.user');
    const postsData = localStorage.getItem('ambassadorApp.posts');
    const votesData = localStorage.getItem('ambassadorApp.votes');
    const ambassadorsData = localStorage.getItem('ambassadorApp.ambassadors');

    currentUser = userData ? JSON.parse(userData) : null;
    posts = postsData ? JSON.parse(postsData) : [];
    votes = votesData ? JSON.parse(votesData) : [];
    ambassadors = ambassadorsData ? JSON.parse(ambassadorsData) : [];
}

// Save data to localStorage
function saveData() {
    if (currentUser) {
        localStorage.setItem('ambassadorApp.user', JSON.stringify(currentUser));
    }
    localStorage.setItem('ambassadorApp.posts', JSON.stringify(posts));
    localStorage.setItem('ambassadorApp.votes', JSON.stringify(votes));
    localStorage.setItem('ambassadorApp.ambassadors', JSON.stringify(ambassadors));
}

// Check if user is authenticated
function checkUserAuth() {
    if (currentUser) {
        showApp();
    } else {
        showLanding();
    }
}

// Show landing view
function showLanding() {
    landingView.classList.add('active');
    appView.classList.remove('active');
}

// Show app view
function showApp() {
    landingView.classList.remove('active');
    appView.classList.add('active');
    loadFeed();
    loadLeaderboard();
    loadProfile();
}

// Initialize event listeners
function initializeEventListeners() {
    // Landing
    document.getElementById('get-started-btn').addEventListener('click', showSetupModal);
    
    // Landing navbar
    document.getElementById('landing-hamburger-menu').addEventListener('click', toggleLandingMobileMenu);
    document.getElementById('login-btn').addEventListener('click', showLoginModal);
    document.getElementById('signup-btn').addEventListener('click', showSignupModal);
    
    // Login modal
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('login-pin-toggle').addEventListener('click', () => togglePinVisibility('login-pin', 'login-pin-toggle'));
    document.getElementById('cancel-login-btn').addEventListener('click', () => {
        clearLoginForm();
        hideModal(loginModal);
    });
    
    // Signup modal
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('signup-pin-toggle').addEventListener('click', () => togglePinVisibility('signup-pin', 'signup-pin-toggle'));
    document.getElementById('cancel-signup-btn').addEventListener('click', () => {
        clearSignupForm();
        hideModal(signupModal);
    });
    
    // Wallet modal
    document.getElementById('connect-wallet-btn').addEventListener('click', showWalletModal);
    
    // Wallet modal
    document.getElementById('generate-key-btn').addEventListener('click', generateTestKey);
    document.getElementById('connect-wallet-confirm').addEventListener('click', connectWallet);
    
    // Create post modal
    document.getElementById('create-post-form').addEventListener('submit', handleCreatePost);
    document.getElementById('cancel-post-btn').addEventListener('click', hideCreatePostModal);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
            // Close mobile menu after navigation
            closeMobileMenu();
        });
    });
    
    // Hamburger menu
    document.getElementById('hamburger-menu').addEventListener('click', toggleMobileMenu);
    
    // Floating create post button
    document.getElementById('create-post-btn').addEventListener('click', showCreatePostModal);
    
    // Modal close on backdrop click
    [loginModal, signupModal, walletModal, createPostModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });
    
    // Landing navbar scroll effect
    window.addEventListener('scroll', handleLandingNavbarScroll);
    
    // Feature animations on scroll
    window.addEventListener('scroll', handleFeatureAnimations);
}

// Show login modal
function showLoginModal() {
    loginModal.classList.add('active');
    closeLandingMobileMenu();
}

// Show signup modal
function showSignupModal() {
    signupModal.classList.add('active');
    closeLandingMobileMenu();
}

// Clear login form
function clearLoginForm() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-pin').value = '';
    document.getElementById('login-pin').type = 'password';
    document.getElementById('login-pin-toggle').textContent = '👁️';
}

// Clear signup form
function clearSignupForm() {
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-pin').value = '';
    document.getElementById('signup-pin').type = 'password';
    document.getElementById('signup-pin-toggle').textContent = '👁️';
}

// Show setup modal (for get started button)
function showSetupModal() {
    signupModal.classList.add('active');
    closeLandingMobileMenu();
}

// Hide modal
function hideModal(modal) {
    modal.classList.remove('active');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close mobile menu
function closeMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    
    hamburgerMenu.classList.remove('active');
    navLinks.classList.remove('active');
}

// Toggle landing mobile menu
function toggleLandingMobileMenu() {
    const hamburgerMenu = document.getElementById('landing-hamburger-menu');
    const navLinks = document.getElementById('landing-nav-links');
    
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close landing mobile menu
function closeLandingMobileMenu() {
    const hamburgerMenu = document.getElementById('landing-hamburger-menu');
    const navLinks = document.getElementById('landing-nav-links');
    
    hamburgerMenu.classList.remove('active');
    navLinks.classList.remove('active');
}

// Handle landing navbar scroll effect
function handleLandingNavbarScroll() {
    const landingNavbar = document.querySelector('.landing-navbar');
    if (landingNavbar && window.scrollY > 50) {
        landingNavbar.classList.add('scrolled');
    } else if (landingNavbar) {
        landingNavbar.classList.remove('scrolled');
    }
}

// Handle feature animations on scroll
function handleFeatureAnimations() {
    const featureItems = document.querySelectorAll('.feature-item');
    const windowHeight = window.innerHeight;
    
    featureItems.forEach((item, index) => {
        const elementTop = item.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 100); // Staggered animation
        }
    });
}

// Toggle PIN visibility
function togglePinVisibility(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const pin = document.getElementById('login-pin').value;
    
    // Check if user exists in localStorage
    const userData = localStorage.getItem('ambassadorApp.user');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.email === email && user.pin === pin) {
            currentUser = user;
            saveData();
            hideModal(loginModal);
            showApp();
        } else {
            alert('Invalid email or PIN');
        }
    } else {
        alert('No account found. Please sign up first.');
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const displayName = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pin = document.getElementById('signup-pin').value;
    
    // Create user object
    currentUser = {
        id: generateId(),
        displayName,
        email,
        pin,
        wallet: null,
        createdAt: new Date().toISOString()
    };
    
    saveData();
    hideModal(signupModal);
    showApp();
}

// Handle setup form submission
function handleSetup(e) {
    e.preventDefault();
    
    const displayName = document.getElementById('display-name').value;
    const email = document.getElementById('email').value;
    const pin = document.getElementById('pin').value;
    
    // Create user object (wallet is optional)
    currentUser = {
        id: generateId(),
        displayName,
        email,
        pin,
        wallet: currentUser ? currentUser.wallet : null,
        createdAt: new Date().toISOString()
    };
    
    // Add to ambassadors (only if wallet is connected)
    if (currentUser.wallet) {
        const ambassador = {
            id: currentUser.id,
            displayName,
            wallet: currentUser.wallet,
            score: 0
        };
        
        const existingAmbassador = ambassadors.find(a => a.wallet === currentUser.wallet);
        if (!existingAmbassador) {
            ambassadors.push(ambassador);
        }
    }
    
    saveData();
    hideModal(setupModal);
    showApp();
}

// Show wallet modal
function showWalletModal() {
    walletModal.classList.add('active');
}

// Generate test Stellar key
function generateTestKey() {
    // Simulate Stellar key generation
    const testKey = 'G' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    document.getElementById('public-key').value = testKey;
}

// Connect wallet
function connectWallet() {
    const publicKey = document.getElementById('public-key').value.trim();
    
    if (!publicKey || !publicKey.startsWith('G')) {
        alert('Please enter a valid Stellar public key');
        return;
    }
    
    // If user exists, update their wallet, otherwise initialize
    if (currentUser) {
        currentUser.wallet = publicKey;
        
        // Add to ambassadors if not already there
        const existingAmbassador = ambassadors.find(a => a.id === currentUser.id);
        if (!existingAmbassador) {
            const ambassador = {
                id: currentUser.id,
                displayName: currentUser.displayName,
                wallet: publicKey,
                score: 0
            };
            ambassadors.push(ambassador);
        }
        
        saveData();
        loadProfile();
        loadLeaderboard();
    } else {
        // Initialize user with wallet (for setup flow)
        currentUser = { wallet: publicKey };
        
        // Update wallet status in setup modal
        const walletStatus = document.getElementById('wallet-status');
        if (walletStatus) {
            walletStatus.textContent = `Connected: ${publicKey.substring(0, 8)}...`;
            walletStatus.className = 'wallet-status connected';
        }
    }
    
    hideModal(walletModal);
}

// Switch between views
function switchView(viewName) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    // Update view content
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');
}

// Load feed
function loadFeed() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    
    // Sort posts by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    sortedPosts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post-card';
    
    const author = ambassadors.find(a => a.id === post.authorId);
    const voteCount = votes.filter(v => v.postId === post.id).length;
    const hasVoted = currentUser && votes.some(v => v.postId === post.id && v.voterId === currentUser.id);
    
    div.innerHTML = `
        <div class="post-header">
            <div>
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-meta">
                    by <span class="post-author">${author ? author.displayName : 'Unknown'}</span>
                    <span class="post-wallet">(${author ? author.wallet.substring(0, 8) + '...' : 'Unknown'})</span>
                    • ${formatDate(post.createdAt)}
                </div>
            </div>
        </div>
        <div class="post-description">${escapeHtml(post.description)}</div>
        ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
        <div class="post-footer">
            <span class="vote-count">${voteCount} vote${voteCount !== 1 ? 's' : ''}</span>
            <button class="btn btn-primary vote-btn" ${hasVoted ? 'disabled' : ''} data-post-id="${post.id}">
                ${hasVoted ? 'Voted' : 'Vote'}
            </button>
        </div>
    `;
    
    // Add vote event listener
    const voteBtn = div.querySelector('.vote-btn');
    if (!hasVoted) {
        voteBtn.addEventListener('click', () => voteOnPost(post.id));
    }
    
    return div;
}

// Vote on post
function voteOnPost(postId) {
    if (!currentUser) return;
    
    // Check if already voted
    const existingVote = votes.find(v => v.postId === postId && v.voterId === currentUser.id);
    if (existingVote) return;
    
    // Add vote
    const vote = {
        id: generateId(),
        postId,
        voterId: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    votes.push(vote);
    
    // Update author's score
    const post = posts.find(p => p.id === postId);
    if (post) {
        const author = ambassadors.find(a => a.id === post.authorId);
        if (author) {
            author.score += 1; // 1 point per vote received
        }
    }
    
    saveData();
    loadFeed();
    loadLeaderboard();
}

// Show create post modal
function showCreatePostModal() {
    document.getElementById('post-title').value = '';
    document.getElementById('post-description').value = '';
    document.getElementById('post-image').value = '';
    createPostModal.classList.add('active');
}

// Hide create post modal
function hideCreatePostModal() {
    createPostModal.classList.remove('active');
}

// Handle create post
function handleCreatePost(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-description').value;
    const imageFile = document.getElementById('post-image').files[0];
    
    const post = {
        id: generateId(),
        title,
        description,
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
        image: null
    };
    
    // Handle image upload
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            post.image = e.target.result;
            savePost(post);
        };
        reader.readAsDataURL(imageFile);
    } else {
        savePost(post);
    }
}

// Save post
function savePost(post) {
    posts.push(post);
    
    // Update author's score
    const author = ambassadors.find(a => a.id === post.authorId);
    if (author) {
        author.score += 10; // 10 points per post submission
    }
    
    saveData();
    hideCreatePostModal();
    loadFeed();
    loadLeaderboard();
}

// Load leaderboard
function loadLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = '';
    
    // Sort ambassadors by score
    const sortedAmbassadors = [...ambassadors].sort((a, b) => b.score - a.score);
    
    sortedAmbassadors.forEach((ambassador, index) => {
        const div = document.createElement('div');
        div.className = 'leaderboard-item';
        div.innerHTML = `
            <div class="leaderboard-rank">#${index + 1}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${escapeHtml(ambassador.displayName)}</div>
                <div class="leaderboard-wallet">${ambassador.wallet}</div>
            </div>
            <div class="leaderboard-score">${ambassador.score} pts</div>
        `;
        container.appendChild(div);
    });
}

// Load profile
function loadProfile() {
    const container = document.getElementById('profile-container');
    
    if (!currentUser) {
        container.innerHTML = '<p>No user data available</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="profile-section">
            <h3>Profile Information</h3>
            <div class="profile-field">
                <label class="profile-label">Display Name</label>
                <div class="profile-value">${escapeHtml(currentUser.displayName)}</div>
            </div>
            <div class="profile-field">
                <label class="profile-label">Email</label>
                <div class="profile-value">${escapeHtml(currentUser.email)}</div>
            </div>
            <div class="profile-field">
                <label class="profile-label">Wallet Address</label>
                <div class="profile-value">${currentUser.wallet || 'Not connected'}</div>
            </div>
        </div>
        <div class="profile-section">
            <h3>Actions</h3>
            <div class="profile-actions">
                <button class="btn btn-secondary" onclick="editProfile()">Edit Profile</button>
                ${!currentUser.wallet ? '<button class="btn btn-secondary" onclick="connectWalletFromProfile()">Connect Wallet</button>' : ''}
                <button class="btn btn-secondary" onclick="logout()">Logout</button>
            </div>
        </div>
    `;
}

// Edit profile
function editProfile() {
    const newName = prompt('Enter new display name:', currentUser.displayName);
    if (newName && newName.trim()) {
        currentUser.displayName = newName.trim();
        
        // Update in ambassadors
        const ambassador = ambassadors.find(a => a.id === currentUser.id);
        if (ambassador) {
            ambassador.displayName = newName.trim();
        }
        
        saveData();
        loadProfile();
        loadFeed();
        loadLeaderboard();
    }
}

// Connect wallet from profile
function connectWalletFromProfile() {
    showWalletModal();
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('ambassadorApp.user');
        showLanding();
    }
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Seed test data if no data exists
function seedTestData() {
    if (posts.length === 0 && ambassadors.length === 0) {
        // Create test ambassadors
        const testAmbassadors = [
            {
                id: 'amb1',
                displayName: 'Alice Stellar',
                wallet: 'GALICE123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                score: 25
            },
            {
                id: 'amb2',
                displayName: 'Bob Lumens',
                wallet: 'GBOB123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                score: 18
            }
        ];
        
        ambassadors.push(...testAmbassadors);
        
        // Create test posts
        const testPosts = [
            {
                id: 'post1',
                title: 'Welcome to Stellar Ambassador Program!',
                description: 'Excited to be part of this amazing community. Looking forward to contributing to the Stellar ecosystem and helping onboard new users.',
                authorId: 'amb1',
                createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
            },
            {
                id: 'post2',
                title: 'Stellar Network Updates',
                description: 'The latest Stellar network improvements are now live! Enhanced transaction speeds and lower fees make it even better for cross-border payments.',
                authorId: 'amb2',
                createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
        ];
        
        posts.push(...testPosts);
        
        // Create test votes
        const testVotes = [
            { id: 'vote1', postId: 'post1', voterId: 'amb2', createdAt: new Date(Date.now() - 3600000).toISOString() },
            { id: 'vote2', postId: 'post1', voterId: 'amb1', createdAt: new Date(Date.now() - 7200000).toISOString() },
            { id: 'vote3', postId: 'post2', voterId: 'amb1', createdAt: new Date(Date.now() - 10800000).toISOString() }
        ];
        
        votes.push(...testVotes);
        
        saveData();
    }
}

// TODO: Backend Integration Points
/*
1. SEP-10 Authentication:
   - Replace localStorage user with SEP-10 JWT token
   - Add token validation and refresh logic
   - Implement proper wallet signature verification

2. Stellar Network Integration:
   - Connect to Stellar Horizon API for real wallet data
   - Implement transaction signing for votes/posts
   - Add Stellar account validation

3. Backend API:
   - Replace localStorage with REST API calls
   - Add proper error handling and loading states
   - Implement real-time updates via WebSocket

4. Security Enhancements:
   - Add input validation and sanitization
   - Implement rate limiting for votes/posts
   - Add CSRF protection

5. Advanced Features:
   - Add post categories and tags
   - Implement comment system
   - Add notification system
   - Add search and filtering
*/
