// Simple client helpers for the Farmer Marketplace backend
const API_BASE = '';

const $ = (sel) => document.querySelector(sel);
const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  ([]).concat(children).forEach((c) => c && node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return node;
};

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
  location.href = '/';
}

export function initAuthUI() {
  const logoutBtn = $('#logoutBtn');
  const authLinks = $('#auth-links');
  const profileLink = $('#profileLink');
  const token = getToken();
  if (logoutBtn && authLinks) {
    const loggedIn = !!token;
    logoutBtn.hidden = !loggedIn;
    authLinks.style.display = loggedIn ? 'none' : 'inline-block';
    logoutBtn.onclick = logout;
  }
  if (profileLink) {
    const info = getUserInfo();
    if (token && info?.name && info?.role) {
      profileLink.hidden = false;
      profileLink.href = '/profile';
      profileLink.innerHTML = `<div style="display:flex;flex-direction:column;line-height:1.1"><strong>${info.name}</strong><span class="muted" style="font-size:12px;text-transform:capitalize;">${info.role}</span></div>`;
    } else {
      profileLink.hidden = true;
    }
  }
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export async function listCrops({ limit, mountId = 'crops' } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  const res = await api(`/api/crops?${params.toString()}`);
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.innerHTML = '';
  const arr = res?.data || res;
  const items = Array.isArray(arr) ? arr : Array.isArray(arr?.data) ? arr.data : [];
  if (!items.length) {
    mount.appendChild(el('p', { class: 'muted', style: 'text-align: center; padding: 20px;' }, ['No products found.']));
    return;
  }
  items.forEach((product) => {
    const img = product.imageUrl || product.image?.url || 'https://via.placeholder.com/340x160.png?text=Product';
    const farmerName = product.farmerName || product.farmer?.name || 'Farmer';
    const unit = product.unit || 'kg';
    const p20 = product.price20kg || product.price20 || product.price;
    const p50 = product.price50kg || product.price50 || null;
    const p100 = product.price100kg || product.price100 || null;
    const desc = product.description || '';
    const quantity = product.quantity || 0;

    const connectHref = product.farmer?._id
      ? `/chat?farmerId=${encodeURIComponent(product.farmer._id)}&cropId=${encodeURIComponent(product._id)}`
      : '/chat';

    const card = el('div', { class: 'product-card' }, [
      el('div', { class: 'product-card-image' }, [
        el('img', { src: img, alt: product.name || 'Product image' }),
      ]),
      el('div', { class: 'product-card-content' }, [
        el('div', {}, [
          el('div', { class: 'product-header' }, [
            el('h3', { class: 'product-title' }, [product.name || 'Unnamed']),
          ]),
          el('p', { class: 'product-desc' }, [desc]),
          el('div', { class: 'farmer-info' }, [
            el('span', { class: 'farmer-badge' }, [`👤 ${farmerName}`])
          ]),
          el('div', { class: 'price-list' }, [
            p20 ? el('div', { class: 'price-item' }, [`20 kg: `, el('span', {}, [`₹${Number(p20).toLocaleString('en-IN')}`])]) : null,
            p50 ? el('div', { class: 'price-item' }, [`50 kg: `, el('span', {}, [`₹${Number(p50).toLocaleString('en-IN')}`])]) : null,
            p100 ? el('div', { class: 'price-item' }, [`100 kg: `, el('span', {}, [`₹${Number(p100).toLocaleString('en-IN')}`])]) : null,
          ].filter(Boolean))
        ]),

        el('div', { class: 'card-footer' }, [
          el('span', { class: 'availability' }, [`${quantity} ${unit} available`]),
          el('div', { class: 'action-icons' }, [
            el('a', { class: 'icon-btn', href: connectHref, title: 'Chat' }, ['💬'])
          ])
        ])
      ])
    ]);
    mount.appendChild(card);
  });
}

// Function to show edit modal
function showEditModal(product, mountId) {
  // Create modal overlay
  const modal = el('div', { class: 'modal-overlay' }, [
    el('div', { class: 'modal-content' }, [
      el('div', { class: 'modal-header' }, [
        el('h2', {}, ['Edit Product']),
        el('button', { class: 'modal-close', title: 'Close' }, ['×'])
      ]),
      el('form', { class: 'modal-form', id: 'editProductForm' }, [
        el('label', {}, ['Description']),
        el('textarea', { name: 'description', rows: '3', placeholder: 'Product description' }, [product.description || '']),

        el('label', {}, ['Price for 20 kg']),
        el('input', { type: 'number', step: '0.01', name: 'price20', value: product.price20kg || product.price20 || product.price || '' }),

        el('label', {}, ['Price for 50 kg']),
        el('input', { type: 'number', step: '0.01', name: 'price50', value: product.price50kg || product.price50 || '' }),

        el('label', {}, ['Price for 100 kg']),
        el('input', { type: 'number', step: '0.01', name: 'price100', value: product.price100kg || product.price100 || '' }),

        el('label', {}, ['Quantity Available']),
        el('input', { type: 'number', step: '1', name: 'quantity', value: product.quantity || '' }),

        el('label', {}, ['Product Image (optional)']),
        el('input', { name: 'imageFile', type: 'file', accept: 'image/*' }),
        el('small', { class: 'muted' }, ['Leave empty to keep current image']),

        el('div', { class: 'modal-actions' }, [
          el('button', { type: 'button', class: 'btn-outline modal-cancel' }, ['Cancel']),
          el('button', { type: 'submit', class: 'btn-primary' }, ['Save Changes'])
        ])
      ])
    ])
  ]);

  // Add close functionality
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.modal-cancel');
  const closeModal = () => document.body.removeChild(modal);

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle form submission
  const form = modal.querySelector('#editProductForm');
  let imageBase64 = '';

  const fileInput = form.querySelector('input[name="imageFile"]');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      imageBase64 = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      imageBase64 = reader.result;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      description: form.description.value.trim(),
      price20kg: Number(form.price20.value),
      price50kg: Number(form.price50.value),
      price100kg: Number(form.price100.value),
      quantity: Number(form.quantity.value),
    };

    // Only include image if a new one was selected
    if (imageBase64) {
      payload.imageBase64 = imageBase64;
    }

    form.querySelector('button[type="submit"]').disabled = true;
    try {
      await api(`/api/crops/${product._id}`, { method: 'PUT', body: payload });
      alert('Product updated successfully!');
      closeModal();
      listMyCrops({ mountId });
    } catch (err) {
      alert(err.message || 'Failed to update product');
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });

  document.body.appendChild(modal);
}

export async function listMyCrops({ limit, mountId = 'myProducts' } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  const res = await api(`/api/crops/my-crops?${params.toString()}`);
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.innerHTML = '';
  const arr = res?.data || res;
  const items = Array.isArray(arr) ? arr : Array.isArray(arr?.data) ? arr.data : [];
  if (!items.length) {
    mount.appendChild(el('p', { class: 'muted', style: 'text-align: center; padding: 20px;' }, ['No products found.']));
    return;
  }
  items.forEach((product) => {
    const img = product.imageUrl || product.image?.url || 'https://via.placeholder.com/340x160.png?text=Product';
    const farmerName = product.farmerName || product.farmer?.name || 'You';
    const unit = product.unit || 'kg';
    const p20 = product.price20kg || product.price20 || product.price;
    const p50 = product.price50kg || product.price50 || null;
    const p100 = product.price100kg || product.price100 || null;
    const desc = product.description || '';
    const quantity = product.quantity || 0;

    // Create edit button
    const editBtn = el('button', { class: 'icon-btn', title: 'Edit Product' }, ['✏️']);
    editBtn.addEventListener('click', () => {
      showEditModal(product, mountId);
    });

    // Create delete button
    const deleteBtn = el('button', { class: 'icon-btn delete', title: 'Delete Product' }, ['🗑️']);
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await api(`/api/crops/${product._id}`, { method: 'DELETE' });
          alert('Product deleted successfully!');
          listMyCrops({ mountId });
        } catch (err) {
          alert(err.message || 'Failed to delete product');
        }
      }
    });

    const card = el('div', { class: 'product-card' }, [
      el('div', { class: 'product-card-image' }, [
        el('img', { src: img, alt: product.name || 'Product image' }),
      ]),
      el('div', { class: 'product-card-content' }, [
        el('div', {}, [
          el('div', { class: 'product-header' }, [
            el('h3', { class: 'product-title' }, [product.name || 'Unnamed']),
          ]),
          el('p', { class: 'product-desc' }, [desc]),
          el('div', { class: 'farmer-info' }, [
            el('span', { class: 'farmer-badge' }, [`👤 ${farmerName}`])
          ]),
          el('div', { class: 'price-list' }, [
            p20 ? el('div', { class: 'price-item' }, [`20 kg: `, el('span', {}, [`₹${Number(p20).toLocaleString('en-IN')}`])]) : null,
            p50 ? el('div', { class: 'price-item' }, [`50 kg: `, el('span', {}, [`₹${Number(p50).toLocaleString('en-IN')}`])]) : null,
            p100 ? el('div', { class: 'price-item' }, [`100 kg: `, el('span', {}, [`₹${Number(p100).toLocaleString('en-IN')}`])]) : null,
          ].filter(Boolean))
        ]),

        el('div', { class: 'card-footer' }, [
          el('span', { class: 'availability' }, [`${quantity} ${unit} available`]),
          el('div', { class: 'action-icons' }, [
            editBtn,
            deleteBtn
          ])
        ])
      ])
    ]);
    mount.appendChild(card);
  });
}


function setUserInfo(info) {
  try {
    localStorage.setItem('userInfo', JSON.stringify(info || {}));
  } catch { }
}
function getUserInfo() {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || '{}');
  } catch {
    return {};
  }
}

export async function login({ email, password }) {
  const res = await api('/api/auth/login', { method: 'POST', body: { email, password } });
  // Backend responds with { success: true, data: { token, role, ... } }
  const data = res?.data || res;
  if (data?.token) setToken(data.token);
  if (data) setUserInfo({ name: data.name, role: data.role, email: data.email, _id: data._id });
  return data;
}

export async function register({ name, email, password, role }) {
  const res = await api('/api/auth/register', { method: 'POST', body: { name, email, password, role } });
  const data = res?.data || res;
  if (data?.token) setToken(data.token);
  if (data) setUserInfo({ name: data.name, role: data.role, email: data.email, _id: data._id });
  return data;
}

function redirectByRole(role) {
  if (role === 'farmer') {
    location.href = '/farmer';
  } else if (role === 'buyer') {
    location.href = '/buyer';
  } else {
    location.href = '/';
  }
}

export function mountChatPage() {
  initAuthUI();
  const token = getToken();
  const info = getUserInfo();
  if (!token || !info?._id) {
    alert('Please log in to use chat.');
    location.href = '/login';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const farmerIdParam = params.get('farmerId');
  const cropIdParam = params.get('cropId');
  const farmerNameParam = params.get('farmerName');

  const chatCardTitle = document.getElementById('chatProductTitle');
  const chatCardDesc = document.getElementById('chatProductDesc');
  const chatCardMeta = document.getElementById('chatProductMeta');
  const chatCardImage = document.getElementById('chatCardImage');
  const messagesEl = document.getElementById('chatMessages');
  const chatListContainer = document.getElementById('chatListContainer');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  let otherUserId = farmerIdParam || '';
  let cropId = cropIdParam || '';
  let otherUserName = farmerNameParam || 'Farmer';

  // Helper to append message to UI
  const appendMessage = (msg) => {
    if (!msg) return;
    const senderId = String(msg.sender?._id || msg.sender);
    const receiverId = String(msg.receiver?._id || msg.receiver);
    const currentUserId = String(info._id);
    const targetUserId = otherUserId ? String(otherUserId) : '';

    // If this is the first message and we don't know the other user yet,
    // infer them from the message (so farmer opening /chat directly still sees messages).
    if (!targetUserId) {
      otherUserId = senderId === currentUserId ? receiverId : senderId;
    }

    // Only show messages in this conversation once we have the other user ID
    // We compare with the updated otherUserId (which might have just been set)
    const activeTargetId = String(otherUserId);

    if (
      !(
        (senderId === currentUserId && receiverId === activeTargetId) ||
        (senderId === activeTargetId && receiverId === currentUserId)
      )
    ) {
      return;
    }

    const isMe = senderId === currentUserId;
    const row = document.createElement('div');
    row.className = 'chat-row ' + (isMe ? 'me' : 'them');

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (isMe ? 'me' : 'them');

    const textNode = document.createElement('div');
    textNode.textContent = msg.message;
    bubble.appendChild(textNode);

    const meta = document.createElement('span');
    meta.className = 'chat-bubble-meta';
    const when = msg.createdAt ? new Date(msg.createdAt) : new Date();
    meta.textContent = when.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    bubble.appendChild(meta);

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  // Helper to load conversations
  const loadConversations = async () => {
    try {
      const res = await api('/api/chat/conversations');
      const conversations = res?.data?.data || res?.data || [];

      if (!conversations.length) {
        chatListContainer.innerHTML = '<p class="muted" style="text-align:center;padding:20px;">No conversations yet.</p>';
        return;
      }

      chatListContainer.innerHTML = '';
      conversations.forEach(conv => {
        const user = conv.user;
        const isUnread = conv.unreadCount > 0;
        const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

        const div = el('div', {
          class: `chat-list-item ${isUnread ? 'unread' : ''}`
        }, [
          el('div', { class: 'chat-list-avatar' }, [initial]),
          el('div', { class: 'chat-list-content' }, [
            el('div', { class: 'chat-list-header' }, [
              el('div', { class: 'chat-list-name' }, [user.name]),
              el('div', { class: 'chat-list-time' }, [new Date(conv.lastMessageTime).toLocaleDateString()])
            ]),
            el('div', { class: 'chat-list-footer' }, [
              el('div', { class: 'chat-list-message' }, [conv.lastMessage]),
              isUnread ? el('div', { class: 'chat-list-badge' }, [String(conv.unreadCount)]) : null
            ])
          ])
        ]);
        div.onclick = () => location.href = `/chat?farmerId=${user._id}&farmerName=${encodeURIComponent(user.name)}`;
        chatListContainer.appendChild(div);
      });
    } catch (e) {
      console.error('Failed to load conversations', e);
    }
  };

  // Initialize Socket.IO client (global io comes from script tag)
  const socket = window.io ? window.io() : null;
  if (socket) {
    socket.emit('join', info._id);

    socket.on('receiveMessage', (msg) => {
      // If in list view, refresh the list
      if (!otherUserId && chatListContainer && !chatListContainer.hidden) {
        loadConversations();
      } else {
        appendMessage(msg);
      }
    });

    socket.on('messageSent', (msg) => {
      appendMessage(msg);
    });
  }

  // If no specific chat is selected, show conversation list
  if (!otherUserId) {
    if (chatListContainer) chatListContainer.hidden = false;
    if (messagesEl) messagesEl.hidden = true;
    if (form) form.style.display = 'none'; // Ensure hidden
    const chatCard = document.getElementById('chatCard');
    if (chatCard) chatCard.style.display = 'none'; // Hide header in list view

    loadConversations();
    return; // Stop here, don't load chat logic
  }

  const loadCropAndHistory = async () => {
    try {
      // Load crop details to show in header card
      if (cropId) {
        const cropRes = await api(`/api/crops/${cropId}`);
        const cropPayload = cropRes?.data?.data || cropRes?.data || cropRes;
        const crop = cropPayload?.data || cropPayload; // handle both shapes
        if (crop) {
          chatCardTitle.textContent = crop.name || 'Product';
          chatCardDesc.textContent = crop.description || '';
          const unit = crop.unit || 'kg';
          const qty = crop.quantity != null ? `${crop.quantity} ${unit} available` : '';
          chatCardMeta.textContent = qty;
          if (crop.image?.url) {
            chatCardImage.style.display = 'flex';
            chatCardImage.textContent = '';
            const img = document.createElement('img');
            img.src = crop.image.url;
            img.alt = crop.name || 'Product image';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            chatCardImage.appendChild(img);
          }
          if (!otherUserId && crop.farmer?._id) {
            otherUserId = crop.farmer._id;
            otherUserName = crop.farmer.name || otherUserName;
          }
        }
      } else {
        // If no crop, show user info in header
        chatCardTitle.textContent = otherUserName;
        chatCardDesc.innerHTML = `<a href="/profile?userId=${otherUserId}">View Profile</a>`;
        if (chatCardImage) chatCardImage.style.display = 'none';
      }

      // Load chat history if we know who we are chatting with
      if (otherUserId) {
        const histRes = await api(`/api/chat/${otherUserId}`);
        const payload = histRes?.data?.data || histRes?.data || histRes;
        const msgs = Array.isArray(payload) ? payload : [];
        messagesEl.innerHTML = '';
        msgs.forEach(appendMessage);
        // Mark messages as read
        await api(`/api/chat/mark-read/${otherUserId}`, { method: 'PUT' });
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = (input.value || '').trim();
    if (!text || !otherUserId) return;

    if (socket) {
      socket.emit('sendMessage', {
        senderId: info._id,
        receiverId: otherUserId,
        message: text,
        cropId: cropId || null,
      });
    }
    input.value = '';
  });

  loadCropAndHistory();
}

// Page initializers
export function mountBuyerDashboard() {
  initAuthUI();
  const chatLink = document.getElementById('chatLink');
  if (chatLink) chatLink.href = '/chat';
  listCrops({ mountId: 'crops' });
}

export function mountFarmerDashboard() {
  initAuthUI();
  const chatLink = document.getElementById('chatLink');
  if (chatLink) chatLink.href = '/chat';
  listMyCrops({ mountId: 'myProducts' });
}

export function mountProfilePage() {
  initAuthUI();
  const mount = document.getElementById('profile');
  if (!mount) return;

  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');

  (async () => {
    try {
      let user;
      if (userId) {
        // Public Profile
        const res = await api(`/api/auth/${userId}`);
        user = res?.data || res;
      } else {
        // My Profile
        const res = await api('/api/auth/profile');
        user = res?.data || res;
      }

      mount.innerHTML = '';
      mount.appendChild(el('div', { class: 'card' }, [
        el('h2', {}, [user?.name || 'User']),
        el('p', { class: 'muted' }, [user?.email || '']),
        el('p', {}, [String(user?.role || '')]),
        user.location ? el('p', {}, [`📍 ${user.location}`]) : null
      ]));

      // Hide farmer-only navigation for buyers or public view
      const myProductsNav = document.getElementById('navMyProducts');
      const logoutBtn = document.getElementById('logoutBtn');

      if (userId) {
        // Public view: hide logout and my products
        if (logoutBtn) logoutBtn.hidden = true;
        if (myProductsNav) myProductsNav.style.display = 'none';
      } else {
        // My Profile
        if (myProductsNav) {
          if (user?.role !== 'farmer') {
            myProductsNav.style.display = 'none';
          } else {
            myProductsNav.style.display = 'inline-block';
          }
        }
      }
    } catch (e) {
      console.error('Profile load error:', e);
      mount.innerHTML = `<p class="muted">Failed to load profile. <button onclick="location.reload()">Retry</button></p>`;
    }
  })();
}

export function mountAddProductForm() {
  initAuthUI();
  const form = document.getElementById('addProductForm');
  if (!form) return;

  // Only allow farmers to access the add product page
  const info = getUserInfo();
  if (!info || info.role !== 'farmer') {
    alert('Only farmers can add products.');
    if (info && info.role === 'buyer') {
      location.href = '/buyer';
    } else {
      location.href = '/login';
    }
    return;
  }

  let imageBase64 = '';
  const fileInput = form.imageFile;
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        imageBase64 = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        imageBase64 = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Keep all small unit selects in sync (20/50/100 and quantity)
  const unitSelects = Array.from(form.querySelectorAll('.price-unit-select'));
  const syncUnits = (value) => {
    unitSelects.forEach((s) => {
      if (s) s.value = value;
    });
  };
  if (unitSelects.length) {
    syncUnits(unitSelects[0].value || 'kg');
    unitSelects.forEach((sel) => {
      sel.addEventListener('change', () => syncUnits(sel.value));
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!imageBase64) {
      alert('Please choose a product image from your gallery.');
      return;
    }

    const price20 = Number(form.price20.value);
    const price50 = Number(form.price50.value);
    const price100 = Number(form.price100.value);
    const quantity = Number(form.quantity.value);
    const unit = unitSelects[0]?.value || 'kg';

    const payload = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: price20, // base price (20 units)
      price20kg: price20,
      price50kg: price50,
      price100kg: price100,
      quantity,
      unit,
      category: form.category.value,
      imageBase64,
    };

    form.querySelector('button[type="submit"]').disabled = true;
    try {
      await api('/api/crops', { method: 'POST', body: payload });
      alert('Product added');
      location.href = '/farmer';
    } catch (err) {
      alert(err.message || 'Failed to add product');
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

export function mountLoginForm() {
  const form = $('#loginForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    form.querySelector('button[type="submit"]').disabled = true;
    try {
      const data = await login({ email, password });
      redirectByRole(data?.role);
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

export function mountRegisterForm() {
  const form = $('#registerForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      role: form.role.value,
    };
    form.querySelector('button[type="submit"]').disabled = true;
    try {
      const data = await register(payload);
      redirectByRole(data?.role);
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}
