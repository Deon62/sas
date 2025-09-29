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
    // console.log('DOM Content Loaded');
    loadData();
    initializeEventListeners();
    checkUserAuth();
    seedTestData();
    
    // Initialize feature animations
    setTimeout(() => {
        handleFeatureAnimations();
    }, 500);
    
    // Test if elements exist after DOM load
    setTimeout(() => {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        // console.log('After DOM load - Hamburger menu:', hamburgerMenu);
        // console.log('After DOM load - Mobile sidebar:', mobileSidebar);
    }, 1000);
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
    // console.log('Showing app view');
    landingView.classList.remove('active');
    appView.classList.add('active');
    // console.log('App view active:', appView.classList.contains('active'));
    // Load the default view (feed)
    switchView('feed');
}

// Initialize event listeners
function initializeEventListeners() {
    // Landing (only if element exists)
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', showSetupModal);
    }
    
    // Landing navbar (only if element exists)
    const landingHamburgerMenu = document.getElementById('landing-hamburger-menu');
    if (landingHamburgerMenu) {
        landingHamburgerMenu.addEventListener('click', toggleLandingMobileMenu);
    }
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', showSignupModal);
    }
    
    // Login modal (only if elements exist)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const loginPinToggle = document.getElementById('login-pin-toggle');
    if (loginPinToggle) {
        loginPinToggle.addEventListener('click', () => togglePinVisibility('login-pin', 'login-pin-toggle'));
    }
    
    const cancelLoginBtn = document.getElementById('cancel-login-btn');
    if (cancelLoginBtn) {
        cancelLoginBtn.addEventListener('click', () => {
            clearLoginForm();
            hideModal(loginModal);
        });
    }
    
    // Signup modal (only if elements exist)
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    const signupPinToggle = document.getElementById('signup-pin-toggle');
    if (signupPinToggle) {
        signupPinToggle.addEventListener('click', () => togglePinVisibility('signup-pin', 'signup-pin-toggle'));
    }
    
    const cancelSignupBtn = document.getElementById('cancel-signup-btn');
    if (cancelSignupBtn) {
        cancelSignupBtn.addEventListener('click', () => {
            clearSignupForm();
            hideModal(signupModal);
        });
    }
    
    // Wallet modal (only if elements exist)
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', showWalletModal);
    }
    
    const generateKeyBtn = document.getElementById('generate-key-btn');
    if (generateKeyBtn) {
        generateKeyBtn.addEventListener('click', generateTestKey);
    }
    
    const connectWalletConfirm = document.getElementById('connect-wallet-confirm');
    if (connectWalletConfirm) {
        connectWalletConfirm.addEventListener('click', connectWallet);
    }
    
    // Create post modal (only if elements exist)
    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }
    
    const cancelPostBtn = document.getElementById('cancel-post-btn');
    if (cancelPostBtn) {
        cancelPostBtn.addEventListener('click', hideCreatePostModal);
    }
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
        });
    });
    
    // Mobile sidebar navigation (only if elements exist)
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                switchView(view);
                closeMobileSidebar();
            });
        });
    }
    
    // Bottom navigation (only if elements exist)
    const bottomNavBtns = document.querySelectorAll('.bottom-nav-btn');
    if (bottomNavBtns.length > 0) {
        bottomNavBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                switchView(view);
                updateBottomNavActive(view);
            });
        });
    }
    
    // Hamburger menu
    const hamburgerMenu = document.getElementById('hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileSidebar();
        });
    }
    
    // Close sidebar
    const closeSidebar = document.getElementById('close-sidebar');
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeMobileSidebar);
    }
    
    // Close sidebar on backdrop click
    const mobileSidebar = document.getElementById('mobile-sidebar');
    if (mobileSidebar) {
        mobileSidebar.addEventListener('click', (e) => {
            if (e.target === mobileSidebar) {
                closeMobileSidebar();
            }
        });
    }
    
    // Create post button in bottom navigation (only if element exists)
    const createPostBtn = document.getElementById('create-post-btn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', showCreatePostModal);
    }
    
    // Modal close on backdrop click (only if modals exist)
    [loginModal, signupModal, walletModal, createPostModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    hideModal(modal);
                }
            });
        }
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

// Toggle mobile sidebar
function toggleMobileSidebar() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    
    // console.log('toggleMobileSidebar called');
    // console.log('hamburgerMenu:', hamburgerMenu);
    // console.log('mobileSidebar:', mobileSidebar);
    
    if (hamburgerMenu && mobileSidebar) {
        hamburgerMenu.classList.toggle('active');
        mobileSidebar.classList.toggle('active');
        // console.log('Classes toggled. Hamburger active:', hamburgerMenu.classList.contains('active'));
        // console.log('Sidebar active:', mobileSidebar.classList.contains('active'));
    } else {
        // console.log('Elements not found for toggle');
    }
}

// Close mobile sidebar
function closeMobileSidebar() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    
    if (hamburgerMenu && mobileSidebar) {
        hamburgerMenu.classList.remove('active');
        mobileSidebar.classList.remove('active');
    }
}

// Update bottom navigation active state
function updateBottomNavActive(activeView) {
    const bottomNavBtns = document.querySelectorAll('.bottom-nav-btn');
    bottomNavBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === activeView) {
            btn.classList.add('active');
        }
    });
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
    const navLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // Update sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    const sidebarLink = document.querySelector(`.sidebar-link[data-view="${viewName}"]`);
    if (sidebarLink) {
        sidebarLink.classList.add('active');
    }
    
    // Update bottom navigation
    updateBottomNavActive(viewName);
    
    // Update view content
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');
    
    // Load content for the view
    switch(viewName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'feed':
            loadFeed();
            break;
        case 'leaderboard':
            loadLeaderboard();
            break;
        case 'chat':
            loadChat();
            break;
        case 'ai':
            loadAI();
            break;
        case 'notifications':
            loadNotifications();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// Load dashboard
function loadDashboard() {
    const container = document.getElementById('dashboard-container');
    
    // Calculate user's rank
    const userScore = ambassadors.find(a => a.id === currentUser?.id)?.score || 0;
    const sortedAmbassadors = [...ambassadors].sort((a, b) => b.score - a.score);
    const userRank = sortedAmbassadors.findIndex(a => a.id === currentUser?.id) + 1;
    const totalAmbassadors = ambassadors.length;
    
    // Get latest 3 earnings (mock data for now)
    const latestEarnings = [
        { type: 'Post Creation', amount: '10', date: '2 hours ago' },
        { type: 'Vote Received', amount: '5', date: '1 day ago' },
        { type: 'Community Bonus', amount: '15', date: '3 days ago' }
    ];
    
    container.innerHTML = `
        <div class="dashboard-welcome">
            <h2>Welcome back, ${currentUser ? currentUser.displayName : 'User'}!</h2>
            <p>Here's your activity overview</p>
        </div>
        
        <div class="dashboard-rank">
            <div class="rank-card">
                <h3>Your Rank</h3>
                <p class="rank-number">${userRank}/${totalAmbassadors}</p>
            </div>
        </div>
        
        <div class="dashboard-stats">
            <div class="stat-card">
                <h3>Your Posts</h3>
                <p class="stat-number">${posts.filter(p => p.authorId === currentUser?.id).length}</p>
            </div>
            <div class="stat-card">
                <h3>Votes Received</h3>
                <p class="stat-number">${votes.filter(v => posts.find(p => p.id === v.postId && p.authorId === currentUser?.id)).length}</p>
            </div>
            <div class="stat-card">
                <h3>Your Score</h3>
                <p class="stat-number">${userScore}</p>
            </div>
            <div class="stat-card">
                <h3>Total Earnings</h3>
                <p class="stat-number">${userScore}</p>
            </div>
        </div>
        
        <div class="dashboard-earnings">
            <h3>Latest Earnings</h3>
            <div class="earnings-list">
                ${latestEarnings.map(earning => `
                    <div class="earning-item">
                        <span class="earning-text">${earning.type} - +${earning.amount} (${earning.date})</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
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

// Load chat
function loadChat() {
    const container = document.getElementById('chat-container');
    container.innerHTML = `
        <div class="chat-header">
            <h2>Messages</h2>
        </div>
        <div class="chat-list">
            <div class="chat-item">
                <div class="chat-avatar">👤</div>
                <div class="chat-info">
                    <h4>John Ambassador</h4>
                    <p>Hey! How's your Stellar project going?</p>
                    <span class="chat-time">2 min ago</span>
                </div>
            </div>
            <div class="chat-item">
                <div class="chat-avatar">👩</div>
                <div class="chat-info">
                    <h4>Sarah Developer</h4>
                    <p>Thanks for the great post about DeFi!</p>
                    <span class="chat-time">1 hour ago</span>
                </div>
            </div>
        </div>
    `;
}

// Load AI
function loadAI() {
    const container = document.getElementById('ai-container');
    container.innerHTML = `
        <div class="ai-header">
            <h2>AI Assistant</h2>
            <p>Ask me anything about Stellar or being an ambassador!</p>
        </div>
        <div class="ai-chat">
            <div class="ai-message">
                <div class="ai-avatar">🤖</div>
                <div class="ai-content">
                    <p>Hello! I'm your Stellar Ambassador AI assistant. I can help you with:</p>
                    <ul>
                        <li>Stellar network questions</li>
                        <li>Ambassador program guidance</li>
                        <li>Technical support</li>
                        <li>Community best practices</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="ai-input">
            <input type="text" placeholder="Ask me anything..." class="ai-text-input">
            <button class="ai-send-btn">Send</button>
        </div>
    `;
}

// Load notifications
function loadNotifications() {
    const container = document.getElementById('notifications-container');
    container.innerHTML = `
        <div class="notifications-header">
            <h2>Notifications</h2>
        </div>
        <div class="notifications-list">
            <div class="notification-item">
                <div class="notification-icon">🔔</div>
                <div class="notification-content">
                    <h4>Welcome to SAS!</h4>
                    <p>You've successfully joined the Stellar Ambassador community.</p>
                    <span class="notification-time">Just now</span>
                </div>
            </div>
        </div>
    `;
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
