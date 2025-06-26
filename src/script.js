function addToCart(name, price, image_url) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name: name, price: price, image_url: image_url, assurance: false });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(name + " ajouté au panier !");
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.length;
  // Sur toutes les pages, mettre à jour le badge du panier
  document.querySelectorAll('.cart-button').forEach(btn => {
    let badge = btn.querySelector('.cart-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count';
      btn.appendChild(badge);
    }
    badge.textContent = count > 0 ? `(${count})` : '';
  });
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function toggleAssurance(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].assurance = !cart[index].assurance;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-list");
  const totalDisplay = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const paymentSection = document.getElementById("payment-section");
  if (!list || !totalDisplay) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  list.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#888;">Votre panier est vide.</p>' +
      '<div style="text-align:center;margin-top:1.5rem;">' +
      '<a href="index.html" class="empty-cart-btn">Voir les bonnes affaires</a>' +
      '</div>';
    totalDisplay.textContent = '';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    if (paymentSection) paymentSection.style.display = 'none';
    return;
  }

  // Création du tableau
  const table = document.createElement('table');
  table.className = 'cart-table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Image</th><th>Produit</th><th>Prix</th><th>Assurance</th><th>Action</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');

  cart.forEach((item, i) => {
    const tr = document.createElement('tr');
    let assuranceChecked = item.assurance ? 'checked' : '';
    let assuranceLabel = `<label style="cursor:pointer;"><input type="checkbox" class="assurance-checkbox" data-index="${i}" ${assuranceChecked}> Assurance (+39,90 €)</label>`;
    let prixTotal = item.price + (item.assurance ? 39.90 : 0);
    let image = item.image_url ? `<img src="${item.image_url}" alt="${item.name}" class="cart-img">` : '';
    tr.innerHTML = `<td>${image}</td><td>${item.name}</td><td>${item.price} €</td><td>${assuranceLabel}</td><td><button class="remove-btn" data-index="${i}">Supprimer</button></td>`;
    tbody.appendChild(tr);
    total += prixTotal;
  });
  table.appendChild(tbody);
  list.appendChild(table);

  totalDisplay.textContent = "Total : " + total.toFixed(2) + " €";

  // Ajout des listeners pour les boutons supprimer
  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-index'));
      removeFromCart(idx);
    });
  });
  // Ajout des listeners pour les cases à cocher assurance
  list.querySelectorAll('.assurance-checkbox').forEach(box => {
    box.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-index'));
      toggleAssurance(idx);
    });
  });

  // Afficher le bouton paiement si panier non vide
  if (checkoutBtn) checkoutBtn.style.display = 'block';
  if (paymentSection) paymentSection.style.display = 'none';
}                     

window.onload = function () {
  renderCart();
  updateCartCount();
};

// Pour mettre à jour le nombre d'articles même si on revient sur la page sans reload
window.addEventListener('storage', function() {
  renderCart();
  updateCartCount();
});

// Gestion du paiement
window.addEventListener('DOMContentLoaded', function() {
  const checkoutBtn = document.getElementById('checkout-btn');
  const paymentSection = document.getElementById('payment-section');
  const paymentForm = document.getElementById('payment-form');
  const paymentMessage = document.getElementById('payment-message');

  if (checkoutBtn && paymentSection) {
    checkoutBtn.onclick = function() {
      paymentSection.style.display = 'block';
      window.scrollTo({ top: paymentSection.offsetTop - 40, behavior: 'smooth' });
    };
  }

  if (paymentForm) {
    paymentForm.onsubmit = function(e) {
      e.preventDefault();
      // Validation simple
      const name = document.getElementById('card-name').value.trim();
      const number = document.getElementById('card-number').value.replace(/\s+/g, '');
      const expiry = document.getElementById('card-expiry').value.trim();
      const cvc = document.getElementById('card-cvc').value.trim();
      let valid = true;
      let msg = '';
      if (name.length < 2) { valid = false; msg = 'Nom invalide.'; }
      else if (!/^\d{16,19}$/.test(number)) { valid = false; msg = 'Numéro de carte invalide.'; }
      else if (!/^\d{2}\/\d{2}$/.test(expiry)) { valid = false; msg = 'Date d\'expiration invalide.'; }
      else if (!/^\d{3,4}$/.test(cvc)) { valid = false; msg = 'CVC invalide.'; }
      if (!valid) {
        paymentMessage.style.color = 'red';
        paymentMessage.textContent = msg;
        return;
      }
      // Paiement simulé réussi
      paymentMessage.style.color = 'green';
      paymentMessage.textContent = 'Paiement réussi ! Merci pour votre commande.';

      // Récupère les articles et le total du panier
      localStorage.setItem('cart_backup', localStorage.getItem('cart'));
      const cart = JSON.parse(localStorage.getItem('cart_backup')) || [];
      let total = 0;
      cart.forEach(item => {
        total += item.price + (item.assurance ? 39.90 : 0);
      });

      // Envoie la commande à l'API
      fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: cart, total: total.toFixed(2) })
      });

      localStorage.removeItem('cart');
      setTimeout(() => {
        paymentSection.style.display = 'none';
        renderCart();
        updateCartCount();
        paymentMessage.textContent = '';
        paymentForm.reset();
      }, 2000);
    };
  }
});
