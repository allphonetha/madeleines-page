// State halaman aktif & status animasi
let currentPage = 1;
let isTransitioning = false;

// 1. Fungsi untuk Membuka Scrapbook dari Cover Landing Page
function openScrapbook() {
    const coverSection = document.getElementById('cover-section');
    const scrapbookWrapper = document.getElementById('scrapbook-wrapper');
    const appContainer = document.getElementById('app-container');

    // Sembunyikan ornamen meja saat masuk ke halaman pages
    if (appContainer) {
        appContainer.classList.add('in-scrapbook');
    }

    // Animasi menghilang halus pada cover
    coverSection.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    coverSection.style.opacity = '0';
    coverSection.style.transform = 'scale(0.95)';

    setTimeout(() => {
        // Sembunyikan cover utama
        coverSection.classList.add('hidden');
        
        // Tampilkan buku scrapbook
        scrapbookWrapper.classList.remove('hidden');

        // Pastikan Halaman 1 tampil aktif tanpa animasi geser awal
        const allPages = document.querySelectorAll('.page-item');
        allPages.forEach(p => {
            p.classList.add('hidden');
            p.classList.remove('active', 'slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right');
        });

        const page1 = document.getElementById('page-1');
        if (page1) {
            page1.classList.remove('hidden');
            page1.classList.add('active');
            currentPage = 1;
        }
    }, 400);
}

// 2. Fungsi Navigasi Pindah Halaman dengan Efek Slide/Flow
function goToPage(pageNumber) {
    if (isTransitioning) return; // Cegah spam klik selama transisi berjalan

    const appContainer = document.getElementById('app-container');
    const coverSection = document.getElementById('cover-section');
    const scrapbookWrapper = document.getElementById('scrapbook-wrapper');

    // Kalau user klik tombol previous dari Page 1 untuk kembali ke Cover
    if (pageNumber === 0) {
        if (appContainer) {
            appContainer.classList.remove('in-scrapbook'); // Tampilkan kembali ornamen di cover
        }
        scrapbookWrapper.classList.add('hidden');
        coverSection.classList.remove('hidden');
        coverSection.style.opacity = '1';
        coverSection.style.transform = 'scale(1)';
        currentPage = 0;
        return;
    }

    const currentPageElement = document.getElementById(`page-${currentPage}`);
    const targetPageElement = document.getElementById(`page-${pageNumber}`);

    if (!targetPageElement || currentPageElement === targetPageElement) return;

    isTransitioning = true;

    // Tentukan arah geser (Flow/Slide)
    const isNext = pageNumber > currentPage;
    const outAnimation = isNext ? 'slide-out-left' : 'slide-out-right';
    const inAnimation = isNext ? 'slide-in-right' : 'slide-in-left';

    // Bersihkan sisa animasi sebelumnya
    currentPageElement.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right');
    targetPageElement.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right');

    // Jalankan animasi slide keluar pada halaman lama & slide masuk pada halaman baru
    currentPageElement.classList.add(outAnimation);

    targetPageElement.classList.remove('hidden');
    targetPageElement.classList.add('active', inAnimation);

    // Setelah durasi animasi selesai (450ms)
    setTimeout(() => {
        currentPageElement.classList.remove('active', outAnimation);
        currentPageElement.classList.add('hidden');

        targetPageElement.classList.remove(inAnimation);

        currentPage = pageNumber;
        isTransitioning = false;
    }, 450);

    // Scroll otomatis ke atas buku jika di mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. Navigasi Keyboard (Panah Kiri & Kanan, Escape untuk Tutup Modal)
document.addEventListener('keydown', (e) => {
    // Tutup modal dengan Escape
    if (e.key === 'Escape') {
        const letterModal = document.getElementById('special-letter-modal');
        if (letterModal && !letterModal.classList.contains('hidden')) {
            closeSpecialLetter();
            return;
        }

        const popup = document.getElementById('memo-popup-overlay');
        if (popup && !popup.classList.contains('hidden')) {
            closeMemoPopup();
            return;
        }
    }

    const scrapbookWrapper = document.getElementById('scrapbook-wrapper');
    if (!scrapbookWrapper || scrapbookWrapper.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
        const activePage = document.querySelector('.page-item.active');
        if (activePage) {
            const nextBtn = activePage.querySelector('.btn-next');
            if (nextBtn) nextBtn.click();
        }
    } else if (e.key === 'ArrowLeft') {
        const activePage = document.querySelector('.page-item.active');
        if (activePage) {
            const prevBtn = activePage.querySelector('.btn-prev');
            if (prevBtn) prevBtn.click();
        }
    }
});

// 4. Fungsi Pop Up Memo Dinamis (Uhh.. press this?)
function openMemoPopup(pageNumber) {
    const targetPageNum = pageNumber || currentPage || 1;
    const popup = document.getElementById('memo-popup-overlay');
    if (!popup) return;

    // Cari elemen halaman target
    const pageEl = document.getElementById(`page-${targetPageNum}`);
    const popupTitleEl = popup.querySelector('.popup-title');
    const popupSubtitleEl = popup.querySelector('.popup-subtitle');
    const popupBodyEl = popup.querySelector('.memo-popup-body');

    if (pageEl) {
        const customData = pageEl.querySelector('.page-popup-data');
        if (customData) {
            const customTitle = customData.querySelector('.popup-custom-title');
            const customSubtitle = customData.querySelector('.popup-custom-subtitle');
            const customBody = customData.querySelector('.popup-custom-body');

            if (popupTitleEl && customTitle) popupTitleEl.innerHTML = customTitle.innerHTML;
            if (popupSubtitleEl && customSubtitle) popupSubtitleEl.innerHTML = customSubtitle.innerHTML;
            if (popupBodyEl && customBody) popupBodyEl.innerHTML = customBody.innerHTML;
        } else {
            // Fallback otomatis jika data belum dispesifikasikan di halaman terkait
            if (popupTitleEl) popupTitleEl.innerHTML = `Special Story & Notes 📖`;
            if (popupSubtitleEl) popupSubtitleEl.innerHTML = `From the desk of Maddy • Page ${targetPageNum}`;
            if (popupBodyEl) {
                popupBodyEl.innerHTML = `
                    <p class="popup-greeting"><strong>Catatan Khusus Halaman ${targetPageNum} ✨</strong></p>
                    <p>Ini adalah cerita dan memori rahasia untuk halaman ke-${targetPageNum}.</p>
                    <p>Kamu bisa dengan mudah mengedit teks ini langsung di dalam tag <code>&lt;div class="page-popup-data"&gt;</code> pada Halaman ${targetPageNum} di file <code>index.html</code>.</p>
                    <p>Teks di sini bebas sepanjang apa pun karena area pop-up ini sudah dilengkapi dengan scrollbar estetik yang halus.</p>
                `;
            }
        }
    }

    // Selalu reset scroll ke posisi paling atas saat pop-up dibuka
    if (popupBodyEl) {
        popupBodyEl.scrollTop = 0;
    }

    popup.classList.remove('hidden');
}

function closeMemoPopup() {
    const popup = document.getElementById('memo-popup-overlay');
    if (popup) {
        popup.classList.add('hidden');
    }
}

function handlePopupBackdropClick(event) {
    // Hanya tutup bila yang diklik adalah background gelap (backdrop)
    if (event.target.id === 'memo-popup-overlay') {
        closeMemoPopup();
    }
}

// 5. Fungsi Tambahan Interaksi Halaman 2 (Secret Note)
function toggleSecretNote() {
    const secretNote = document.getElementById('secret-note');
    if (secretNote) {
        secretNote.classList.toggle('hidden');
    }
}

// 6. INTERAKSI HALAMAN 22: TIUP LILIN (HOLD TO BLOW) & SURAT RAHASIA
let candleHoldTimer = null;

function startBlowing(element) {
    if (!element || element.classList.contains('extinguished')) return;

    // Tambahkan class getar api seolah sedang ditiup
    element.classList.add('blowing');

    // Timer tekan dan tahan selama 650ms untuk meniup lilin sampai padam
    candleHoldTimer = setTimeout(() => {
        element.classList.remove('blowing');
        element.classList.add('extinguished');

        // Cek apakah semua lilin di halaman 22 sudah padam
        checkAllCandlesBlown();
    }, 650);
}

function stopBlowing(element) {
    if (candleHoldTimer) {
        clearTimeout(candleHoldTimer);
        candleHoldTimer = null;
    }
    if (element && !element.classList.contains('extinguished')) {
        element.classList.remove('blowing');
    }
}

function checkAllCandlesBlown() {
    const allFlames = document.querySelectorAll('#page-22 .flame-wrap');
    if (!allFlames || allFlames.length === 0) return;

    const allBlown = Array.from(allFlames).every(f => f.classList.contains('extinguished'));

    if (allBlown) {
        // 1. Ubah teks instruksi jadi pesan ucapan meriah
        const hintText = document.getElementById('party-hint-text');
        if (hintText) {
            hintText.innerHTML = '✨ <strong>Yayy! Semua lilin padam! Make a wish!</strong> Ada surat untukmu di pojok kanan atas! 💌';
            hintText.style.background = '#fef08a';
            hintText.style.color = '#78350f';
            hintText.style.transform = 'scale(1.05)';
        }

        // 2. Munculkan amplop notifikasi berdenyut di pojok atas
        const envelopeBtn = document.getElementById('special-letter-envelope');
        if (envelopeBtn) {
            envelopeBtn.classList.remove('hidden');
        }

        // 3. Efek confetti perayaan meriah
        triggerPartyConfetti();
    }
}

// 7. Buka & Tutup Surat Pop-Up Halaman 22
function openSpecialLetter() {
    const letterModal = document.getElementById('special-letter-modal');
    if (letterModal) {
        letterModal.classList.remove('hidden');

        // Hilangkan badge notifikasi merah karena surat sudah dibuka
        const badge = document.getElementById('letter-badge');
        if (badge) {
            badge.style.display = 'none';
        }
    }
}

function closeSpecialLetter() {
    const letterModal = document.getElementById('special-letter-modal');
    if (letterModal) {
        letterModal.classList.add('hidden');
    }
}

function handleLetterBackdropClick(event) {
    if (event.target.id === 'special-letter-modal') {
        closeSpecialLetter();
    }
}

// 8. Efek Confetti Warna-warni di Layar
function triggerPartyConfetti() {
    const celebrationPage = document.getElementById('page-22');
    if (!celebrationPage) return;

    const colors = ['#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#eab308'];

    for (let i = 0; i < 45; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'party-confetti-particle';
        confetti.style.position = 'absolute';
        confetti.style.top = `${Math.random() * 40}%`;
        confetti.style.left = `${Math.random() * 95}%`;
        confetti.style.width = `${Math.random() * 10 + 6}px`;
        confetti.style.height = `${Math.random() * 14 + 8}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.zIndex = '90';
        confetti.style.pointerEvents = 'none';
        confetti.style.opacity = '1';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.transition = 'all 2.4s cubic-bezier(0.25, 1, 0.5, 1)';

        celebrationPage.appendChild(confetti);

        // Animasi melayang jatuh ke bawah
        setTimeout(() => {
            confetti.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 400 + 200}px) rotate(${Math.random() * 720}deg)`;
            confetti.style.opacity = '0';
        }, 30);

        // Bersihkan partikel setelah animasi selesai
        setTimeout(() => {
            confetti.remove();
        }, 2600);
    }
}