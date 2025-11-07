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
  const token = getToken();
  if (logoutBtn && authLinks) {
    const loggedIn = !!token;
    logoutBtn.hidden = !loggedIn;
    authLinks.style.display = loggedIn ? 'none' : 'inline-block';
    logoutBtn.onclick = logout;
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
  const data = await api(`/api/products?${params.toString()}`);
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.innerHTML = '';
  const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  if (!items.length) {
    mount.appendChild(el('p', { class: 'muted', style: 'text-align: center; padding: 20px;' }, ['No products found.']));
    return;
  }
  items.forEach((product) => {
    const card = el('div', { class: 'product-card' }, [
      el('img', { src: product.imageUrl || 'https://via.placeholder.com/110x110.png?text=Product', alt: product.name }),
      el('div', { class: 'product-card-info' }, [
        el('h3', { class: 'product-card-name' }, [product.name || 'Unnamed']),
        el('div', { class: 'product-card-price' }, [`₹${(product.price || 0).toLocaleString('en-IN')}`]),
        el('div', { class: 'product-card-meta' }, [
          el('span', { class: 'badge' }, [product.farmerName || 'Farmer'])
        ])
      ])
    ]);
    mount.appendChild(card);
  });
}

export async function login({ email, password }) {
  const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
  if (data?.token) setToken(data.token);
  return data;
}

export async function register({ name, email, password, role }) {
  const data = await api('/api/auth/register', { method: 'POST', body: { name, email, password, role } });
  if (data?.token) setToken(data.token);
  return data;
}

// Page initializers
export function mountLoginForm() {
  const form = $('#loginForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    form.querySelector('button[type="submit"]').disabled = true;
    try {
      await login({ email, password });
      location.href = '/';
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
      await register(payload);
      location.href = '/';
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}
