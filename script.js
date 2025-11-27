// DOM Elementleri
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const passwordOutput = document.getElementById('passwordOutput');
const generateBtn = document.getElementById('generateBtn');
const refreshBtn = document.getElementById('refreshBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthText = document.getElementById('strengthText');
const bar1 = document.getElementById('bar1');
const bar2 = document.getElementById('bar2');
const bar3 = document.getElementById('bar3');
const infoText = document.getElementById('infoText');
const downloadBtn = document.getElementById('downloadBtn');

// Karakter Kümeleri
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Event Listeners
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    generatePassword();
});

uppercaseCheck.addEventListener('change', generatePassword);
lowercaseCheck.addEventListener('change', generatePassword);
numbersCheck.addEventListener('change', generatePassword);
symbolsCheck.addEventListener('change', generatePassword);

generateBtn.addEventListener('click', generatePassword);
refreshBtn.addEventListener('click', () => {
    lengthSlider.value = 12;
    lengthValue.textContent = 12;
    uppercaseCheck.checked = true;
    lowercaseCheck.checked = true;
    numbersCheck.checked = true;
    symbolsCheck.checked = true;
    generatePassword();
    showMessage('Ayarlar sıfırlandı!', false);
});

copyBtn.addEventListener('click', copyPassword);
downloadBtn.addEventListener('click', downloadPassword);

// Parola Oluştur
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let chars = '';

    // Seçilen karakter kümelerini birleştir
    if (uppercaseCheck.checked) chars += UPPERCASE;
    if (lowercaseCheck.checked) chars += LOWERCASE;
    if (numbersCheck.checked) chars += NUMBERS;
    if (symbolsCheck.checked) chars += SYMBOLS;

    // En az bir seçenek seçilmeli
    if (chars.length === 0) {
        showMessage('Lütfen en az bir seçenek seçiniz!', true);
        passwordOutput.value = '';
        updateStrength('');
        return;
    }

    // Parola oluştur
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    passwordOutput.value = password;
    updateStrength(password);
    infoText.textContent = '';
}

// Parola Gücünü Hesapla
function calculateStrength(password) {
    if (!password) return 0;

    let strength = 0;

    // Uzunluk
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;

    // Türlendirme
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) strength++;

    return strength;
}

// Parola Gücünü Güncelle
function updateStrength(password) {
    const strength = calculateStrength(password);
    
    // Barları sıfırla
    bar1.className = 'strength-bar';
    bar2.className = 'strength-bar';
    bar3.className = 'strength-bar';
    
    // Gücü belirleme
    let level = 'Zayıf';
    let levelClass = 'weak';

    if (strength >= 1 && strength <= 3) {
        bar1.classList.add('weak');
        level = 'Zayıf';
        levelClass = 'weak';
    } else if (strength >= 4 && strength <= 5) {
        bar1.classList.add('medium');
        bar2.classList.add('medium');
        level = 'Orta Seviye';
        levelClass = 'medium';
    } else if (strength >= 6) {
        bar1.classList.add('strong');
        bar2.classList.add('strong');
        bar3.classList.add('strong');
        level = 'Güçlü';
        levelClass = 'strong';
    }

    // Metni güncelle
    strengthText.textContent = level;
    strengthText.className = `strength-text ${levelClass}`;
}

// Parolayı Kopyala
function copyPassword() {
    if (!passwordOutput.value) {
        showMessage('Önce bir parola oluşturun!', true);
        return;
    }

    navigator.clipboard.writeText(passwordOutput.value).then(() => {
        showMessage('✓ Parola kopyalandı!', false);
        copyBtn.textContent = '✓';
        setTimeout(() => {
            copyBtn.textContent = '📋';
        }, 2000);
    }).catch(() => {
        // Fallback
        passwordOutput.select();
        document.execCommand('copy');
        showMessage('✓ Parola kopyalandı!', false);
        copyBtn.textContent = '✓';
        setTimeout(() => {
            copyBtn.textContent = '📋';
        }, 2000);
    });
}

// Mesaj Göster
function showMessage(message, isError) {
    infoText.textContent = message;
    if (isError) {
        infoText.classList.add('error');
    } else {
        infoText.classList.remove('error');
    }
}

// Parolayı İndir
function downloadPassword() {
    if (!passwordOutput.value) {
        showMessage('Önce bir parola oluşturun!', true);
        return;
    }

    const password = passwordOutput.value;
    const strength = calculateStrength(password);
    
    let strengthLevel = 'Zayıf';
    if (strength >= 4 && strength <= 5) {
        strengthLevel = 'Orta Seviye';
    } else if (strength >= 6) {
        strengthLevel = 'Güçlü';
    }

    const timestamp = new Date().toLocaleString('tr-TR');
    
    // Dosya içeriği
    const content = `PAROLA OLUŞTURUCU - İNDİRİLEN PAROLA
=====================================

Parola: ${password}

Parola Gücü: ${strengthLevel}
Parola Uzunluğu: ${password.length} karakter

İndirme Tarihi: ${timestamp}

UYARI: Bu dosyayı güvenli bir yerde saklayınız!
=====================================`;

    // Blob oluştur
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // Download linki oluştur
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `parola_${new Date().getTime()}.txt`;
    
    // İndir
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage('✓ Parola başarıyla indirildi!', false);
}

// Başlangıç
generatePassword();
