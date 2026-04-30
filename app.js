// State
let currentUser = null; // null | { role: 'guest' } | { role: 'user', id: '...', name: '...' } | { role: 'admin', id: 'admin', name: 'Yönetici' }
let posts = [
    {
        id: 1,
        userId: 'u1',
        userName: 'Ahmet Y.',
        animal: 'kedi',
        breed: 'scottish',
        age: 'yetiskin',
        benefit: 'olumlu',
        price: 'fp',
        photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
        content: 'Kedim için uzun zamandır kullanıyorum, tüyleri çok daha parlak oldu. Sindirim sorunu da yaşamadık. Kesinlikle fiyat performans ürünü.',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        comments: [
            { id: 101, userName: 'Ayşe K.', content: 'Tüy dökümünü azalttı mı?' },
            { id: 102, userName: 'Ahmet Y.', content: 'Evet gözle görülür bir azalma var.' }
        ]
    },
    {
        id: 2,
        userId: 'u2',
        userName: 'Merve S.',
        animal: 'köpek',
        breed: 'golden',
        age: 'yavru',
        benefit: 'olumsuz',
        price: 'pahalli',
        photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
        content: 'Fiyatı çok yüksek olmasına rağmen köpeğimde alerji yaptı. Kaşınmaktan duramıyor. Tavsiye etmiyorum.',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        comments: []
    }
];

// Elements
const navActions = document.getElementById('nav-actions');
const heroButtons = document.getElementById('hero-buttons');
const addReviewBtn = document.getElementById('add-review-btn');
const reviewsContainer = document.getElementById('reviews-container');

// Modals
const authModal = document.getElementById('auth-modal');
const reviewModal = document.getElementById('review-modal');

// Close buttons
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.add('hidden');
    });
});

// Toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'error' ? 'var(--danger)' : (type === 'success' ? 'var(--success)' : 'var(--dark)');
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Initial Render
function init() {
    renderUI();
    renderPosts();
}

// Render UI based on auth state
function renderUI() {
    navActions.innerHTML = '';
    heroButtons.innerHTML = '';

    if (!currentUser) {
        // Not logged in
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="openAuthModal('login')">Giriş Yap</button>
            <button class="btn btn-primary" onclick="openAuthModal('register')">Kayıt Ol</button>
        `;
        heroButtons.innerHTML = `
            <button class="btn btn-primary" onclick="openAuthModal('register')">Aramıza Katıl</button>
            <button class="btn btn-outline" onclick="loginAsGuest()">İncelemelere Göz At</button>
        `;
        addReviewBtn.classList.add('hidden');
    } else if (currentUser.role === 'guest') {
        // Guest
        navActions.innerHTML = `
            <span style="font-weight: 500; color: var(--text-muted);">Misafir Kullanıcı</span>
            <button class="btn btn-outline" onclick="openAuthModal('register')">Kayıt Ol</button>
        `;
        addReviewBtn.classList.add('hidden');
    } else if (currentUser.role === 'admin') {
        // Admin
        navActions.innerHTML = `
            <span style="font-weight: 600; color: var(--danger);"><i class="fa-solid fa-shield-halved"></i> Güvenlik Yöneticisi</span>
            <button class="btn btn-outline" onclick="logout()">Çıkış Yap</button>
        `;
        addReviewBtn.classList.remove('hidden');
    } else {
        // Normal User
        navActions.innerHTML = `
            <span style="font-weight: 500; color: var(--dark);"><i class="fa-solid fa-user"></i> ${currentUser.name}</span>
            <button class="btn btn-outline" onclick="logout()">Çıkış Yap</button>
        `;
        addReviewBtn.classList.remove('hidden');
    }
}

// Auth Logic
const authForm = document.getElementById('auth-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
let authMode = 'login';

function openAuthModal(mode) {
    authMode = mode;
    updateAuthTabs();
    authModal.classList.remove('hidden');
}

tabLogin.addEventListener('click', () => { authMode = 'login'; updateAuthTabs(); });
tabRegister.addEventListener('click', () => { authMode = 'register'; updateAuthTabs(); });

function updateAuthTabs() {
    if (authMode === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        document.getElementById('auth-submit-btn').textContent = 'Giriş Yap';
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        document.getElementById('auth-submit-btn').textContent = 'Kayıt Ol';
    }
}

document.getElementById('guest-login-btn').addEventListener('click', loginAsGuest);

function loginAsGuest() {
    currentUser = { role: 'guest' };
    authModal.classList.add('hidden');
    renderUI();
    renderPosts();
    showToast('Misafir olarak devam ediyorsunuz. Yorum yapabilmek için kayıt olmalısınız.', 'info');
}

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const identifier = document.getElementById('auth-identifier').value;
    const password = document.getElementById('auth-password').value;

    if (identifier.toLowerCase() === 'admin') {
        currentUser = { role: 'admin', id: 'admin', name: 'Yönetici' };
        showToast('Yönetici olarak giriş yapıldı.', 'success');
    } else {
        // Mock user login/register
        const namePart = identifier.split('@')[0];
        currentUser = { role: 'user', id: 'u_' + Date.now(), name: namePart };
        showToast('Başarıyla giriş yapıldı.', 'success');
    }

    authModal.classList.add('hidden');
    renderUI();
    renderPosts();
});

function logout() {
    currentUser = null;
    renderUI();
    renderPosts();
    showToast('Çıkış yapıldı.');
}

// Add/Edit Review Logic
addReviewBtn.addEventListener('click', () => {
    document.getElementById('review-form').reset();
    document.getElementById('review-id').value = '';
    document.getElementById('review-modal-title').textContent = 'Mama Yorumu Ekle';
    reviewModal.classList.remove('hidden');
});

function containsPhoneNumber(text) {
    // Basic phone number regex check (disallow 10-11 digit numbers with spaces/dashes)
    const phoneRegex = /(?:\+90|0)?[-\s]*[1-9](?:\d[-\s]*){9}/;
    return phoneRegex.test(text);
}

document.getElementById('review-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentUser || currentUser.role === 'guest') {
        showToast('Yorum yapmak için giriş yapmalısınız.', 'error');
        return;
    }

    const content = document.getElementById('review-content').value;

    // Security Check: No phone numbers
    if (containsPhoneNumber(content)) {
        showToast('Güvenlik ihlali: Yorumunuzda telefon numarası veya iletişim bilgisi bulunamaz! Bu site satış platformu değildir.', 'error');
        return;
    }

    const reviewId = document.getElementById('review-id').value;

    const newPost = {
        id: reviewId ? parseInt(reviewId) : Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        animal: document.getElementById('review-animal').value,
        breed: document.getElementById('review-breed').value,
        age: document.getElementById('review-age').value,
        benefit: document.getElementById('review-benefit').value,
        price: document.getElementById('review-price').value,
        photo: document.getElementById('review-photo').value,
        content: content,
        date: reviewId ? posts.find(p => p.id == reviewId).date : new Date().toISOString(),
        comments: reviewId ? posts.find(p => p.id == reviewId).comments : []
    };

    if (reviewId) {
        const index = posts.findIndex(p => p.id == reviewId);
        posts[index] = newPost;
        showToast('Yorumunuz güncellendi.', 'success');
    } else {
        posts.unshift(newPost);
        showToast('Yorumunuz paylaşıldı.', 'success');
    }

    reviewModal.classList.add('hidden');
    renderPosts();
});

// Edit Post
window.editPost = function (id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('review-id').value = post.id;
    document.getElementById('review-animal').value = post.animal;
    document.getElementById('review-breed').value = post.breed;
    document.getElementById('review-age').value = post.age;
    document.getElementById('review-benefit').value = post.benefit;
    document.getElementById('review-price').value = post.price;
    document.getElementById('review-photo').value = post.photo || '';
    document.getElementById('review-content').value = post.content;

    document.getElementById('review-modal-title').textContent = 'Yorumu Düzenle';
    reviewModal.classList.remove('hidden');
};

// Delete Post
window.deletePost = function (id) {
    if (confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
        posts = posts.filter(p => p.id !== id);
        renderPosts();
        showToast('Yorum silindi.', 'success');
    }
};

// Add Comment
window.addComment = function (postId) {
    if (!currentUser || currentUser.role === 'guest') {
        showToast('Yorumlara yanıt vermek için kayıt olmalısınız.', 'error');
        return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value.trim();
    if (!text) return;

    if (containsPhoneNumber(text)) {
        showToast('Güvenlik ihlali: Yorumunuzda telefon numarası bulunamaz!', 'error');
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            id: Date.now(),
            userName: currentUser.name,
            content: text
        });
        input.value = '';
        renderPosts();
        showToast('Yanıt eklendi.', 'success');
    }
};

// Filters
document.getElementById('apply-filters-btn').addEventListener('click', renderPosts);

// Render Posts Feed
function renderPosts() {
    // Get filters
    const fAnimal = document.getElementById('filter-animal').value;
    const fBreed = document.getElementById('filter-breed').value;
    const fAge = document.getElementById('filter-age').value;
    const fBenefit = document.getElementById('filter-benefit').value;
    const fPrice = document.getElementById('filter-price').value;

    let filteredPosts = posts.filter(p => {
        if (fAnimal !== 'all' && p.animal !== fAnimal) return false;
        if (fBreed !== 'all' && p.breed !== fBreed) return false;
        if (fAge !== 'all' && p.age !== fAge) return false;
        if (fBenefit !== 'all' && p.benefit !== fBenefit) return false;
        if (fPrice !== 'all' && p.price !== fPrice) return false;
        return true;
    });

    reviewsContainer.innerHTML = '';

    if (filteredPosts.length === 0) {
        reviewsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:40px;">Kriterlere uygun yorum bulunamadı.</p>';
        return;
    }

    filteredPosts.forEach(post => {
        const canEdit = currentUser && (currentUser.id === post.userId);
        const canDelete = currentUser && (currentUser.role === 'admin' || currentUser.id === post.userId);

        const card = document.createElement('div');
        card.className = 'review-card glass-panel';

        let actionsHtml = '';
        if (canEdit || canDelete) {
            actionsHtml = `<div class="owner-actions">`;
            if (canEdit) actionsHtml += `<button class="action-btn" onclick="editPost(${post.id})"><i class="fa-solid fa-pen"></i> Düzenle</button>`;
            if (canDelete) actionsHtml += `<button class="action-btn" style="color: var(--danger)" onclick="deletePost(${post.id})"><i class="fa-solid fa-trash"></i> Sil</button>`;
            actionsHtml += `</div>`;
        }

        let tagsHtml = `
            <span class="tag ${post.animal}">${post.animal === 'kedi' ? 'Kedi' : 'Köpek'}</span>
            <span class="tag">${post.breed}</span>
            <span class="tag">${post.age}</span>
            <span class="tag ${post.benefit}">${post.benefit === 'olumlu' ? 'Olumlu Etki' : 'Olumsuz Etki'}</span>
            <span class="tag">${post.price === 'fp' ? 'Fiyat/Performans' : (post.price === 'uygun' ? 'Uygun Fiyat' : 'Pahallı')}</span>
        `;

        let commentsHtml = '';
        if (post.comments && post.comments.length > 0) {
            commentsHtml = `<div class="comments-section">
                <h4 style="font-size:1rem; margin-bottom:10px;">Yanıtlar (${post.comments.length})</h4>
                ${post.comments.map(c => `
                    <div class="comment">
                        <div class="comment-avatar">${c.userName.charAt(0)}</div>
                        <div class="comment-content">
                            <h5>${c.userName}</h5>
                            <p>${c.content}</p>
                        </div>
                    </div>
                `).join('')}
            </div>`;
        } else {
            commentsHtml = `<div class="comments-section"><p style="font-size:0.9rem; color:var(--text-muted)">Henüz yanıt yok.</p></div>`;
        }

        let commentInputHtml = '';
        if (currentUser && currentUser.role !== 'guest') {
            commentInputHtml = `
                <div class="comment-input-area">
                    <input type="text" id="comment-input-${post.id}" placeholder="Yanıt yazın...">
                    <button class="btn btn-secondary" onclick="addComment(${post.id})">Gönder</button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="review-header">
                <div class="user-info">
                    <div class="avatar">${post.userName.charAt(0)}</div>
                    <div class="user-details">
                        <h4>${post.userName}</h4>
                        <span>${new Date(post.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>
                ${actionsHtml}
            </div>
            <div class="review-tags">
                ${tagsHtml}
            </div>
            <div class="review-body">
                <p>${post.content}</p>
                ${post.photo ? `<img src="${post.photo}" class="review-photo" alt="Mama Fotoğrafı">` : ''}
            </div>
            <div class="review-actions">
                <div class="action-btns">
                    <button class="action-btn"><i class="fa-regular fa-heart"></i> Faydalı</button>
                    <button class="action-btn"><i class="fa-regular fa-comment"></i> ${post.comments.length} Yanıt</button>
                </div>
            </div>
            ${commentsHtml}
            ${commentInputHtml}
        `;

        reviewsContainer.appendChild(card);
    });
}

// Initialize
init();
