// ─── OUTPUT ELEMENTS ───────────────────────────────────────────────────────────
const apiOutput        = document.getElementById('apiOutput');
const profileOutput    = document.getElementById('profileOutput');
const productApiOutput = document.getElementById('productApiOutput');
const productsList     = document.getElementById('productsList');

// ─── BASE URLS ─────────────────────────────────────────────────────────────────
const usersUrl    = '/api/users';
const productsUrl = '/api/products';

// ─── TOKEN ─────────────────────────────────────────────────────────────────────
function getToken()        { return localStorage.getItem('token'); }
function setToken(token)   { localStorage.setItem('token', token); }
function clearToken()      { localStorage.removeItem('token'); }

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function showOutput(element, data) {
  element.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro na requisição.');
  return data;
}

// ─── TABS ──────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ─── USUÁRIOS ──────────────────────────────────────────────────────────────────
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await request(`${usersUrl}/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value
      })
    });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await request(`${usersUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      })
    });
    setToken(data.token);
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('loadProfileBtn').addEventListener('click', async () => {
  try {
    const data = await request(`${usersUrl}/me`);
    showOutput(profileOutput, data);
  } catch (err) { showOutput(profileOutput, err.message); }
});

document.getElementById('loadUsersBtn').addEventListener('click', async () => {
  try {
    const data = await request(usersUrl);
    showOutput(apiOutput, data);
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const userId  = document.getElementById('updateId').value;
    const payload = {};
    const name    = document.getElementById('updateName').value;
    const email   = document.getElementById('updateEmail').value;
    const role    = document.getElementById('updateRole').value;
    if (name)  payload.name  = name;
    if (email) payload.email = email;
    if (role)  payload.role  = role;

    const data = await request(`${usersUrl}/${userId}`, { method: 'PUT', body: JSON.stringify(payload) });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('passwordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const userId = document.getElementById('passwordId').value;
    const data   = await request(`${usersUrl}/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: document.getElementById('newPassword').value })
    });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('deleteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const userId = document.getElementById('deleteId').value;
    const data   = await request(`${usersUrl}/${userId}`, { method: 'DELETE' });
    showOutput(apiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(apiOutput, err.message); }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  showOutput(apiOutput, 'Token removido com sucesso.');
  showOutput(profileOutput, 'Sessão encerrada.');
});

// ─── PRODUTOS ──────────────────────────────────────────────────────────────────
function renderProducts(products) {
  if (!products.length) {
    productsList.innerHTML = '<p style="color:#6b7280;font-size:14px">Nenhum produto cadastrado.</p>';
    return;
  }
  productsList.innerHTML = products.map(p => `
    <div class="product-card ${p.active ? '' : 'product-inactive'}">
      <div class="product-info">
        <strong>${p.name}</strong>
        <span>${p.category} · Estoque: ${p.stock} · ${p.active ? 'Ativo' : 'Inativo'}</span>
        <span style="display:block;margin-top:4px;font-size:12px;color:#9ca3af">${p._id}</span>
        <span style="display:block;font-size:13px;margin-top:4px">${p.description}</span>
      </div>
      <div class="product-price">R$ ${Number(p.price).toFixed(2)}</div>
    </div>
  `).join('');
}

document.getElementById('createProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const data = await request(productsUrl, {
      method: 'POST',
      body: JSON.stringify({
        name:        document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price:       parseFloat(document.getElementById('productPrice').value),
        category:    document.getElementById('productCategory').value,
        stock:       parseInt(document.getElementById('productStock').value)
      })
    });
    showOutput(productApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(productApiOutput, err.message); }
});

document.getElementById('loadProductsBtn').addEventListener('click', async () => {
  try {
    const data = await request(productsUrl);
    renderProducts(data);
    showOutput(productApiOutput, `${data.length} produto(s) carregado(s).`);
  } catch (err) { showOutput(productApiOutput, err.message); }
});

document.getElementById('getProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id   = document.getElementById('getProductId').value;
    const data = await request(`${productsUrl}/${id}`);
    showOutput(productApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(productApiOutput, err.message); }
});

document.getElementById('updateProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id      = document.getElementById('updateProductId').value;
    const payload = {};
    const name    = document.getElementById('updateProductName').value;
    const desc    = document.getElementById('updateProductDescription').value;
    const price   = document.getElementById('updateProductPrice').value;
    const cat     = document.getElementById('updateProductCategory').value;
    const stock   = document.getElementById('updateProductStock').value;
    const active  = document.getElementById('updateProductActive').value;

    if (name)   payload.name        = name;
    if (desc)   payload.description = desc;
    if (price)  payload.price       = parseFloat(price);
    if (cat)    payload.category    = cat;
    if (stock)  payload.stock       = parseInt(stock);
    if (active) payload.active      = active === 'true';

    const data = await request(`${productsUrl}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    showOutput(productApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(productApiOutput, err.message); }
});

document.getElementById('deleteProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id   = document.getElementById('deleteProductId').value;
    const data = await request(`${productsUrl}/${id}`, { method: 'DELETE' });
    showOutput(productApiOutput, data);
    e.target.reset();
  } catch (err) { showOutput(productApiOutput, err.message); }
});

// ─── PWA: SERVICE WORKER ───────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
