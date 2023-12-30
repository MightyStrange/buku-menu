document.addEventListener("DOMContentLoaded", function () {
    var rows = document.querySelectorAll("tbody tr");
    // Mengambil referensi ke tombol "Reset Jumlah Pesanan"
    var resetJumlahPesananButton = document.getElementById("reset-jumlah-pesanan-button");

    rows.forEach(function (row) {
        var input = row.querySelector("input[type='number']");
        input.addEventListener("input", function () {
            updatePemesanan(row);
            updateTotalPesanan();
        });
    });
    // Menambahkan event listener untuk tombol "Tampilkan Bukti Pesanan"
    var tampilkanBuktiPesananButton = document.getElementById("tampilkan-bukti-pesanan-button");
    tampilkanBuktiPesananButton.addEventListener("click", function () {
        tampilkanBuktiPesanan();
    });
    // Menambahkan event listener untuk tombol "Reset Jumlah Pesanan"
    resetJumlahPesananButton.addEventListener("click", function () {
    // Loop melalui semua input jumlah pesanan dan atur nilainya ke 0
    rows.forEach(function (row) {
        var jumlahInput = row.querySelector("input[type='number']");
        jumlahInput.value = "0";
        updatePemesanan(row); // Memastikan pembaruan total juga terjadi
    });
     // Reset total pesanan ke 0
     var totalPesananElement = document.getElementById("total-pesanan");
     totalPesananElement.textContent = "Total Pesanan: Rp 0";
});
  

  
    function updatePemesanan(row) {
        var jumlahInput = row.querySelector("input[type='number']");
        var hargaCell = row.querySelector("td:nth-child(2)"); // Kolom Harga
        var harga = parseInt(hargaCell.textContent.replace(/\D/g, "")); // Mendapatkan harga (menghapus semua karakter selain angka)
        var jumlahCell = row.querySelector("td:nth-child(4)"); // Kolom Jumlah pesanan
        var totalCell = row.querySelector("td:nth-child(5)"); // Kolom Total

        var jumlah = parseInt(jumlahInput.value);
        var total = harga * jumlah;

        // Format total harga ke dalam format nominal ribuan
        totalCell.textContent = formatNominalRibuan(total);
    }

    function updateTotalPesanan() {
        var totalHarga = 0;
        rows.forEach(function (row) {
            var totalCell = row.querySelector("td:nth-child(5)"); // Kolom Total
            var total = parseInt(totalCell.textContent.replace(/\D/g, "")); // Mendapatkan total (menghapus semua karakter selain angka)
            totalHarga += total;
        });

        // Format total pesanan ke dalam format nominal ribuan
        var totalPesananElement = document.getElementById("total-pesanan");
        totalPesananElement.textContent = "Total Pesanan: " + formatNominalRibuan(totalHarga);
    }

    // Fungsi untuk memformat angka ke dalam format nominal ribuan
    function formatNominalRibuan(angka) {
        var reverse = angka.toString().split("").reverse().join("");
        var ribuan = reverse.match(/\d{1,3}/g);
        var formatted = ribuan.join(".").split("").reverse().join("");
        return "Rp " + formatted;
    }
    // Fungsi untuk menampilkan bukti pesanan
    function tampilkanBuktiPesanan() {
        var nomorMeja = document.getElementById("table-number").value;
        var totalPesanan = document.getElementById("total-pesanan").textContent;
    

        // Mengumpulkan pesanan dari tabel
        var pesanan = [];
        rows.forEach(function (row) {
            var namaMakananCell = row.querySelector("td:nth-child(1)"); // Kolom Nama Makanan
            var jumlahCell = row.querySelector("td:nth-child(4)"); // Kolom Jumlah pesanan

            var namaMakanan = namaMakananCell.textContent;
            var jumlah = parseInt(jumlahCell.querySelector("input[type='number']").value);

            if (jumlah > 0) {
                pesanan.push({ nama: namaMakanan, jumlah: jumlah });
            }
        });

        // Menggabungkan makanan yang dipesan
        var makananDipesan = pesanan.map(function (item) {
            return `${item.nama}: ${item.jumlah} porsi`;
        }).join(", ");

        // Mengatur nilai dalam elemen bukti pesanan
        document.getElementById("bukti-nomor-meja").textContent = nomorMeja;
        document.getElementById("bukti-total-pesanan").textContent = totalPesanan;
        document.getElementById("bukti-makanan-dipesan").textContent = makananDipesan;
        document.getElementById("bukti-pesanan").style.display = "block";
    }
    var resetBuktiPesananButton = document.getElementById("reset-bukti-pesanan-button");
    // Menambahkan event listener untuk tombol "Reset Bukti Pesanan"
    resetBuktiPesananButton.addEventListener("click", function () {
    resetBuktiPesanan();
});
    function resetBuktiPesanan() {
        // Menghapus isi dari elemen-elemen bukti pesanan
        document.getElementById("bukti-nomor-meja").textContent = "";
        document.getElementById("bukti-total-pesanan").textContent = "";
        document.getElementById("bukti-makanan-dipesan").textContent = "";
    
        // Menyembunyikan elemen bukti pesanan
        document.getElementById("bukti-pesanan").style.display = "none";
    }
    // Fungsi untuk menyiapkan data bukti pesanan dan mencetak
function cetakBuktiPesanan() {
    // Ambil nomor meja yang dipilih
    var nomorMeja = document.getElementById("table-number").value;

    // Ambil elemen-elemen yang akan dicetak dalam bukti pesanan
    var buktiNomorMeja = "Nomor Meja: " + nomorMeja;
    var buktiTotalPesanan = "Jumlah " + document.getElementById("total-pesanan").textContent;
    var buktiMakananDipesan = "Makanan yang Dipesan:";

    // Loop melalui makanan yang ada di tabel
    for (var i = 1; i <= 7; i++) {
        var qtyId = "makanan" + i + "-qty";
        var qty = document.getElementById(qtyId).value;

        // Jika jumlah pesanan lebih dari 0, tambahkan makanan ke bukti pesanan
        if (qty > 0) {
            var namaMakanan = document.getElementById("makanan" + i).querySelector("td:first-child").textContent;
            buktiMakananDipesan += "\n- " + namaMakanan + ": " + qty + " porsi";
        }
    }

    // Buat teks yang akan dicetak
    var buktiPesananToPrint = buktiNomorMeja + "\n" + buktiMakananDipesan + "\n" + buktiTotalPesanan;

    // Buat elemen div sementara untuk mencetak
    var printWindow = window.open('', '', 'width=900,height=900');
    printWindow.document.open();
    printWindow.document.write('<style>pre { font-size: 20px; }</style></head><body>');
    printWindow.document.write('<html><head><title>Bukti Pesanan</title></head><body>');
    printWindow.document.write('<pre>' + buktiPesananToPrint + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Panggil metode cetak
    printWindow.print();
    printWindow.close();
}

// Menambahkan event listener untuk tombol "Buat Pesanan"
document.getElementById("buat-pesanan-button").addEventListener("click", cetakBuktiPesanan);

   
});
