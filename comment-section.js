// Full, robust comment section script with EVERY feature, no omission, all lines included

// Escape HTML for XSS
function escapeHTML(str) {
  if (typeof str !== "string" || str === null || str === undefined) return "";
  return str.replace(/[<>&"'`]/g, c => ({
    '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;','`':'&#96;'
  })[c]);
}

// Star picker for comment
function makeStarPicker(container, value, cb, disabled = false) {
  container.innerHTML = '';
  for (let i=1; i<=5; i++) {
    const s = document.createElement('span');
    s.className = 'star' + (i <= value ? ' filled' : '') + (disabled ? ' disabled' : '');
    s.textContent = '★';
    if (!disabled) {
      s.addEventListener('mouseenter', () => {
        Array.from(container.children).forEach((star, idx) => {
          star.classList.toggle('filled', idx < i);
        });
      });
      s.addEventListener('mouseleave', () => {
        Array.from(container.children).forEach((star, idx) => {
          star.classList.toggle('filled', idx < value);
        });
      });
      s.addEventListener('click', () => cb(i));
    }
    container.appendChild(s);
  }
}

let commentStarRating = 0, currentUser = null, game = null;

function renderCommentStarPicker() {
  const container = document.querySelector('.comment-rating-stars');
  makeStarPicker(container, commentStarRating, (val) => {
    commentStarRating = val;
    document.querySelector('.star-value-preview').textContent = commentStarRating;
    renderCommentStarPicker();
    updateCommentPostBtn();
  }, !currentUser);
  document.querySelector('.star-value-preview').textContent = commentStarRating;
}

function updateCommentPostBtn() {
  const hasText = document.querySelector('.comment-input').value.trim().length > 0;
  document.querySelector('.comment-post-btn').disabled = !(hasText && commentStarRating > 0);
}

function containsBadWord(text) {
  const BAD_WORDS = [
    'fuck','shit','bitch','cunt','nigger','fag','asshole','bastard','slut','dick','pussy',
    'whore','faggot','cock','retard','cum','rape'
  ];
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
}

let lastCommentText = "", lastCommentTimestamp = 0, lastCommentTime = 0;
function isSpam(text) {
  let now = Date.now();
  if (text.trim() === lastCommentText && now - lastCommentTimestamp < 60*1000) return true;
  if (now - lastCommentTime < 30*1000) return true;
  return false;
}

// Emoji Picker
let emojiCallback = null;
const emojiPicker = document.getElementById('emojiPicker');
function showEmojiPicker(event, callback) {
  emojiCallback = callback;
  emojiPicker.style.display = 'block';
  emojiPicker.style.left = (event.pageX || event.clientX) + 'px';
  emojiPicker.style.top = (event.pageY || event.clientY) + 'px';
}
emojiPicker?.addEventListener('emoji-click', event => {
  const emoji = event.detail.unicode;
  if (emojiCallback) emojiCallback(emoji);
  emojiPicker.style.display = 'none';
});
document.body.addEventListener('click', function(e){
  if (!e.target.classList.contains("add-reaction-btn") && emojiPicker && emojiPicker.style.display === "block") {
    emojiPicker.style.display = 'none';
  }
});

// Comment CRUD
let commentsUnsubscribe = null;
let commentSort = 'newest', commentStarFilter = 0;

function renderCommentSortFilterUI() {
  const container = document.querySelector('.comment-sort-filter');
  if (!container) return;
  container.innerHTML = `
    <select class="comment-sort-dropdown">
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>
    <span class="comment-filter-stars">
      ${[5,4,3,2,1].map(star => 
        `<button class="filter-star-btn${commentStarFilter===star?' active':''}" data-star="${star}">${star}★</button>`
      ).join('')}
      <button class="filter-star-btn${commentStarFilter===0?' active':''}" data-star="0">All</button>
    </span>
  `;
  document.querySelector('.comment-sort-dropdown').value = commentSort;
  document.querySelector('.comment-sort-dropdown').onchange = (e) => {
    commentSort = e.target.value;
    setupComments();
  };
  document.querySelectorAll('.filter-star-btn').forEach(btn => {
    btn.onclick = () => {
      commentStarFilter = +btn.dataset.star;
      setupComments();
    };
  });
}

function setupComments() {
  if (commentsUnsubscribe) commentsUnsubscribe();
  renderCommentsList([]);
  if (!game) return;
  const q = db.collection('games').doc(game.id).collection('comments').orderBy('createdAt', 'desc');
  commentsUnsubscribe = q.onSnapshot(snap => {
    let comments = [];
    snap.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    renderCommentsList(comments);
  });
}

function toggleReaction(commentId, emoji, currentList) {
  if (!currentUser) return alert("Login first!");
  const ref = db.collection("games").doc(game.id).collection("comments").doc(commentId);
  ref.get().then(docSnap => {
    let data = docSnap.data();
    if (!data.reactions) data.reactions = {};
    if (!data.reactions[emoji] || !Array.isArray(data.reactions[emoji])) data.reactions[emoji] = [];
    let arr = data.reactions[emoji];
    const idx = arr.indexOf(currentUser.uid);
    if (idx !== -1) arr.splice(idx, 1);
    else arr.push(currentUser.uid);
    ref.update({ [`reactions.${emoji}`]: arr });
  });
}

async function reportComment(commentId) {
  await db.collection('games').doc(game.id).collection('comments').doc(commentId).update({reported: true});
  alert('Reported!');
}

function renderCommentsList(comments) {
  const badge = document.querySelector('.comment-count-badge');
  if (badge) badge.textContent = comments.length;
  let filtered = comments;
  if (commentStarFilter) filtered = filtered.filter(c => c.stars === commentStarFilter);
  if (commentSort === 'oldest') filtered = [...filtered].reverse();
  const list = document.querySelector('.comments-list');
  list.innerHTML = '';
  if (!filtered.length) {
    list.innerHTML = `<div style="color:#888b9a;padding:1.4em;text-align:center;">No comments yet. Be the first to comment!</div>`;
    return;
  }
  filtered.forEach(comment => {
    const div = document.createElement('div');
    div.className = 'comment';
    if(comment.deleted) {
      div.textContent = 'This comment was removed by a moderator.';
      list.appendChild(div);
      return;
    }
    let starsHtml = '';
    if (typeof comment.stars === 'number' && comment.stars > 0) {
      for (let i=1; i<=5; i++) {
        starsHtml += `<span class="star"${i <= comment.stars ? ' style="color:#ffd600;"' : ' style="color:#888;"'}>&#9733;</span>`;
      }
    }
    // Safely handle user data with proper null checks
    const userUid = comment.user && comment.user.uid ? comment.user.uid : '';
    const userName = comment.user && comment.user.name ? comment.user.name : 'Unknown';
    const userPhoto = comment.user && comment.user.photo ? comment.user.photo : '';
    const userBadge = comment.user && comment.user.badge ? comment.user.badge : '';
    let userLink = `/public-profile.html?uid=${userUid}`;
    let badge = '';
    if (userBadge) badge = `<span class="user-badge">${userBadge}</span>`;
    const avatarUrl = userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
    div.innerHTML = `
      <a href="${userLink}" target="_blank">
        <img class="comment-avatar" src="${escapeHTML(avatarUrl)}" alt="">
      </a>
      <div class="comment-main">
        <span class="comment-user">
          <a href="${userLink}" target="_blank">${escapeHTML(userName)}</a> ${badge}
        </span>
        <span class="comment-date">${comment.createdAt && comment.createdAt.toDate ? escapeHTML(comment.createdAt.toDate().toLocaleString()) : ''}</span>
        <div class="stars">${starsHtml}</div>
        <div class="comment-text">${escapeHTML(comment.text || '')}</div>
        <div class="comment-actions">
          <button class="reply-btn" data-comment="${comment.id}"><i class='bx bx-reply'></i> Reply</button>
          <button class="show-replies-btn" data-comment="${comment.id}">Show replies</button>
          <button class="report-btn" data-comment="${comment.id}">Report</button>
        </div>
        <div class="emoji-picker-bar">
          ${Object.keys(comment.reactions||{}).map(emoji => {
            let userList = comment.reactions[emoji];
            if (!Array.isArray(userList)) userList = [];
            const active = currentUser && userList.includes(currentUser.uid);
            return `<button class="reaction-btn${active ? ' reacted' : ''}" data-emoji="${emoji}" data-comment="${comment.id}">${emoji} <span>${userList.length}</span></button>`;
          }).join('')}
          <button class="reaction-btn add-reaction-btn" data-comment="${comment.id}" title="Add Emoji Reaction">➕</button>
        </div>
        <div class="replies-container" id="replies-${comment.id}"></div>
      </div>
    `;
    list.appendChild(div);
  });
  document.querySelectorAll('.report-btn').forEach(btn => {
    btn.onclick = () => {
      reportComment(btn.dataset.comment);
      btn.disabled = true; 
      btn.textContent = "Reported!";
    };
  });
  bindEmojiAndReplyEvents(comments);
}

function bindEmojiAndReplyEvents(comments) {
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    if (btn.classList.contains('add-reaction-btn')) return;
    btn.onclick = async e => {
      e.preventDefault();
      if (!currentUser) return;
      const emoji = btn.getAttribute('data-emoji');
      const commentId = btn.getAttribute('data-comment');
      const comment = comments.find(c => c.id === commentId);
      let userList = comment && comment.reactions ? comment.reactions[emoji] : [];
      if (!Array.isArray(userList)) userList = [];
      await toggleReaction(commentId, emoji, userList);
    };
  });
  document.querySelectorAll('.add-reaction-btn').forEach(btn => {
    btn.onclick = (e) => {
      const commentId = btn.getAttribute('data-comment');
      showEmojiPicker(e, (emoji) => {
        const comment = comments.find(c => c.id === commentId);
        let userList = comment && comment.reactions ? comment.reactions[emoji] : [];
        if (!Array.isArray(userList)) userList = [];
        toggleReaction(commentId, emoji, userList);
      });
    };
  });
  document.querySelectorAll('.reply-btn').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      const commentId = btn.getAttribute('data-comment');
      showReplyForm(commentId);
    };
  });
  document.querySelectorAll('.show-replies-btn').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      const commentId = btn.getAttribute('data-comment');
      showRepliesForComment(commentId);
      btn.style.display = "none";
      let hideBtn = btn.parentElement.querySelector('.hide-replies-btn');
      if (!hideBtn) {
        hideBtn = document.createElement("button");
        hideBtn.className = "hide-replies-btn";
        hideBtn.type = "button";
        hideBtn.textContent = "Hide replies";
        hideBtn.style.marginLeft = "0.7em";
        btn.parentElement.appendChild(hideBtn);
      }
      hideBtn.onclick = evt => {
        evt.preventDefault();
        const repliesDiv = document.getElementById('replies-' + commentId);
        if (repliesDiv) {
          repliesDiv.innerHTML = "";
          repliesDiv.dataset.loaded = "false";
        }
        hideBtn.remove();
        btn.style.display = "";
      };
    };
  });
}

function showReplyForm(commentId) {
  const repliesDiv = document.getElementById('replies-' + commentId);
  if (!repliesDiv) return;
  if (repliesDiv.querySelector('.reply-form')) return;
  repliesDiv.innerHTML = replyFormHTML(commentId) + repliesDiv.innerHTML;
  const input = repliesDiv.querySelector('.reply-input');
  const btn = repliesDiv.querySelector('.reply-post-btn');
  input.oninput = () => btn.disabled = input.value.trim().length === 0;
  repliesDiv.querySelector('.reply-form').onsubmit = async function(e) {
    e.preventDefault();
    const text = String(input.value || '').trim();
    if (!text) return;
    if (containsBadWord(text)) {
      repliesDiv.querySelector('.reply-error').textContent = "Please avoid inappropriate language.";
      return;
    }
    if (isSpam(text)) {
      repliesDiv.querySelector('.reply-error').textContent = "Please wait before posting again or avoid duplicate replies.";
      return;
    }
    btn.disabled = true;
    try {
      const userData = {
        uid: currentUser.uid || '',
        name: currentUser.displayName || 'Unknown User',
        photo: currentUser.photoURL || ''
      };
      await db.collection('games').doc(game.id).collection('comments').doc(commentId).collection('replies').add({
        text: escapeHTML(text),
        user: userData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        deleted: false
      });
      input.value = '';
      repliesDiv.querySelector('.reply-error').textContent = '';
      showRepliesForComment(commentId, true);
    } catch (err) {
      repliesDiv.querySelector('.reply-error').textContent = err.message || "Failed to post reply.";
    }
    btn.disabled = false;
  };
}

function replyFormHTML(commentId) {
  return `
  <form class="reply-form" data-comment="${commentId}">
    <textarea class="reply-input" placeholder="Write a reply..." maxlength="300"></textarea>
    <button class="reply-post-btn" type="submit" disabled>Reply</button>
    <div class="reply-error"></div>
  </form>
  `;
}

function showRepliesForComment(commentId, force = false) {
  const repliesDiv = document.getElementById('replies-' + commentId);
  if (!repliesDiv) return;
  if (repliesDiv.dataset.loaded === "true" && !force) return;
  repliesDiv.dataset.loaded = "true";
  const repliesQ = db.collection('games').doc(game.id).collection('comments').doc(commentId).collection('replies').orderBy('createdAt', 'asc');
  repliesQ.onSnapshot(snap => {
    let html = "";
    snap.forEach(doc => {
      const reply = doc.data();
      if (reply.deleted) {
        html += `<div class="reply" style="color:#888;">[deleted]</div>`;
        return;
      }
      const replyUserUid = reply.user && reply.user.uid ? reply.user.uid : '';
      const replyUserName = reply.user && reply.user.name ? reply.user.name : 'Unknown';
      const replyUserPhoto = reply.user && reply.user.photo ? reply.user.photo : '';
      const replyText = reply.text || '';
      let userLink = `/public-profile.html?uid=${replyUserUid}`;
      const avatarUrl = replyUserPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(replyUserName)}`;
      html += `
        <div class="reply">
          <a href="${userLink}" target="_blank">
            <img class="comment-avatar" src="${escapeHTML(avatarUrl)}" alt="">
          </a>
          <span class="comment-user"><a href="${userLink}" target="_blank">${escapeHTML(replyUserName)}</a></span>
          <span class="comment-date">${reply.createdAt && reply.createdAt.toDate ? escapeHTML(reply.createdAt.toDate().toLocaleString()) : ''}</span>
          <div class="comment-text">${escapeHTML(replyText)}</div>
        </div>
      `;
    });
    const existingForm = repliesDiv.querySelector('.reply-form');
    repliesDiv.innerHTML = (existingForm ? existingForm.outerHTML : "") + html;
  });
}

async function postComment(text) {
  if (!currentUser) return;
  if (!game) return;
  const commentText = String(text || '').trim();
  if (!commentText) throw new Error("Comment text cannot be empty.");
  if (containsBadWord(commentText)) throw new Error("Inappropriate language detected.");
  if (isSpam(commentText)) throw new Error("Please wait before posting again or avoid duplicate comments.");
  const userData = {
    uid: currentUser.uid || '',
    name: currentUser.displayName || 'Unknown User',
    photo: currentUser.photoURL || '',
    badge: "" // Optionally assign badge here
  };
  await db.collection('games').doc(game.id).collection('comments').add({
    text: escapeHTML(commentText),
    stars: commentStarRating,
    user: userData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    likes: [],
    deleted: false,
    reactions: {} // Initialize reactions object
  });
  lastCommentText = commentText;
  lastCommentTimestamp = Date.now();
  lastCommentTime = Date.now();
  commentStarRating = 0;
  renderCommentStarPicker();
  updateCommentPostBtn();
}