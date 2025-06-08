let cart = [];
    let totalHarga = 0;
    let totalItem = 0;
    let antrianCounter = 1;

    function addToCart(nama, harga, qtyId) {
      const qty = parseInt(document.getElementById(qtyId).value);
      if (qty < 1) return alert("Jumlah minimal 1");

      const subtotal = harga * qty;
      cart.push({ nama, harga, qty, subtotal });

      updateTotals();
      renderCart();
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      updateTotals();
      renderCart();
    }

    function updateQty(index, newQty) {
      const qty = parseInt(newQty);
      if (qty < 1) return;
      cart[index].qty = qty;
      cart[index].subtotal = cart[index].harga * qty;
      updateTotals();
      renderCart();
    }

    function updateTotals() {
      totalHarga = 0;
      totalItem = 0;
      cart.forEach(item => {
        totalHarga += item.subtotal;
        totalItem += item.qty;
      });
      document.getElementById("cart-total").innerText = totalHarga.toLocaleString();
      document.getElementById("item-count").innerText = totalItem;
    }

    function renderCart() {
      const cartList = document.getElementById("cart-list");
      cartList.innerHTML = "";
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.nama} - 
          <input type="number" min="1" value="${item.qty}" onchange="updateQty(${index}, this.value)">
          x Rp ${item.harga.toLocaleString()} = Rp ${item.subtotal.toLocaleString()}
          <button onclick="removeFromCart(${index})">❌</button>
        `;
        cartList.appendChild(li);
      });
    }

    function clearCart() {
      cart = [];
      totalHarga = 0;
      totalItem = 0;
      renderCart();
      updateTotals();
      document.getElementById("qris-container").style.display = "none";
      document.getElementById("btn-paid").style.display = "none";
    }

    function checkout() {
      const customerName = document.getElementById("customer-name").value.trim();
      if (!customerName) return alert("Masukkan nama customer.");
      if (cart.length === 0) return alert("Keranjang kosong!");

      let nota = `🧾 NOTA PEMBAYARAN\n`;
      nota += `Nomor Antrian: #${String(antrianCounter).padStart(3, '0')}\n`;
      nota += `Nama: ${customerName}\n\n`;

      cart.forEach(item => {
        nota += `${item.nama} x${item.qty} = Rp ${item.subtotal.toLocaleString()}\n`;
      });
      nota += `\nTotal Item: ${totalItem}\nTotal Bayar: Rp ${totalHarga.toLocaleString()}`;

      alert(nota);

      document.getElementById("qris-container").style.display = "block";
      document.getElementById("btn-paid").style.display = "inline-block";
    }

    function showReceipt() {
      const customerName = document.getElementById("customer-name").value.trim();
      const now = new Date();
      const waktu = now.toLocaleString();

      document.getElementById("receipt-time").innerText = `Waktu: ${waktu}`;
      document.getElementById("receipt-antrian").innerText = `Nomor Antrian: #${String(antrianCounter).padStart(3, '0')}`;
      document.getElementById("receipt-customer").innerText = `Nama: ${customerName}`;

      const itemsList = document.getElementById("receipt-items");
      itemsList.innerHTML = "";
      cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nama} x${item.qty} = Rp ${item.subtotal.toLocaleString()}`;
        itemsList.appendChild(li);
      });

      document.getElementById("receipt-total-item").innerText = totalItem;
      document.getElementById("receipt-total-harga").innerText = totalHarga.toLocaleString();

      alert("✅ Pembayaran berhasil! Struk siap dicetak.");
      printReceipt();

      antrianCounter++;
      clearCart();
      document.getElementById("customer-name").value = "";
    }

    function printReceipt() {
      const printContents = document.getElementById("receipt").innerHTML;
      const win = window.open('', '', 'height=600,width=400');
      win.document.write('<html><head><title>Struk Pembayaran</title></head><body>');
      win.document.write(printContents);
      win.document.write('</body></html>');
      win.document.close();
      win.print();
    }