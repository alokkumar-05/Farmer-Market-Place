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
    const img = product.imageUrl || product.image?.url || 'https://via.placeholder.com/110x110.png?text=Product';
    const farmerName = product.farmerName || product.farmer?.name || 'Farmer';
    const card = el('div', { class: 'product-card' }, [
      el('img', { src: img, alt: product.name }),
      el('div', { class: 'product-card-info' }, [
        el('h3', { class: 'product-card-name' }, [product.name || 'Unnamed']),
        el('div', { class: 'product-card-price' }, [`₹${(product.price || 0).toLocaleString('en-IN')}`]),
        el('div', { class: 'product-card-meta' }, [
          el('span', { class: 'badge' }, [farmerName])
        ])
      ])
    ]);
    mount.appendChild(card);
  });
}

function setUserInfo(info) {
  try {
    localStorage.setItem('userInfo', JSON.stringify(info || {}));
  } catch {}
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

export async function listMyCrops({ mountId = 'myProducts' } = {}) {
  const res = await api('/api/crops/my-crops');
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.innerHTML = '';
  const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
  if (!items.length) {
    mount.appendChild(el('p', { class: 'muted', style: 'text-align: center; padding: 20px;' }, ['No products yet.']));
    return;
  }
  items.forEach((product) => {
    const img = product.image?.url || 'https://via.placeholder.com/110x110.png?text=Product';
    const card = el('div', { class: 'product-card' }, [
      el('img', { src: img, alt: product.name }),
      el('div', { class: 'product-card-info' }, [
        el('h3', { class: 'product-card-name' }, [product.name || 'Unnamed']),
        el('div', { class: 'product-card-price' }, [`₹${(product.price || 0).toLocaleString('en-IN')}`])
      ])
    ]);
    mount.appendChild(card);
  });
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
  (async () => {
    try {
      const res = await api('/api/auth/profile');
      const user = res?.data || res;
      mount.innerHTML = '';
      mount.appendChild(el('div', { class: 'card' }, [
        el('h2', {}, [user?.name || 'User']),
        el('p', { class: 'muted' }, [user?.email || '']),
        el('p', {}, [String(user?.role || '')])
      ]));
    } catch (e) {
      mount.textContent = 'Failed to load profile';
    }
  })();
}

export function mountAddProductForm() {
  initAuthUI();
  const form = document.getElementById('addProductForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: Number(form.price.value),
      quantity: Number(form.quantity.value),
      category: form.category.value,
      imageUrl: form.imageUrl.value.trim(),
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
