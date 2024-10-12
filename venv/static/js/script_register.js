// Отримання елементів
var register_button = document.getElementById('register');
var login_button = document.getElementById('login');
var container = document.getElementById('container');
var reg_button = document.getElementById('reg');
var log_button = document.getElementById('log');

// Реєстрація
var uname = document.getElementById('signup-name');
var unameDiv = document.querySelector('.sign-up .in1');
var errIcon01 = document.querySelector('.sign-up .i01');
var em01 = document.querySelector('.sign-up .em01');
var em02 = document.querySelector('.sign-up .em02');

var email = document.getElementById('signup-email');
var emailDiv = document.querySelector('.sign-up .in2');
var errIcon02 = document.querySelector('.sign-up .i02');
var em03 = document.querySelector('.sign-up .em03');
var em04 = document.querySelector('.sign-up .em04');

var password = document.getElementById('signup-password');
var passwordDiv = document.querySelector('.sign-up .in3');
var em05 = document.querySelector('.sign-up .em05');
var em06 = document.querySelector('.sign-up .em06');

let iconShow1 = document.querySelector('.is01');
let iconShow2 = document.querySelector('.is02');
let passwordInput = document.getElementById('signup-password');

// Вхід
var email1 = document.getElementById('login-email');
var emailDiv1 = document.querySelector('.sign-in .in4');
var errIcon04 = document.querySelector('.sign-in .i04');
var errIcon05 = document.querySelector('.sign-in .i05');
var em03_login = document.querySelector('.sign-in .em03');
var em04_login = document.querySelector('.sign-in .em04');

var password1 = document.getElementById('login-password');
var passwordDiv1 = document.querySelector('.sign-in .in5');
var em05_login = document.querySelector('.sign-in .em05');
var em06_login = document.querySelector('.sign-in .em06');

let iconShow3 = document.querySelector('.is03');
let iconShow4 = document.querySelector('.is04');
let passwordInput2 = document.getElementById('login-password');

// Функції для показу та очищення помилок
function showError(div, icon, em, message) {
    div.classList.add('err');
    if(icon) icon.classList.add('show');
    if(em) {
        em.textContent = message;
        em.classList.add('show');
    }
}

function clearError(div, icon, em) {
    div.classList.remove('err');
    if(icon) icon.classList.remove('show');
    if(em) {
        em.classList.remove('show');
        em.textContent = '';
    }
}

// Функція для отримання IP-адреси
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log("IP Address:", data.ip); // Додаємо логування
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
}

async function addUser(name, email, password) {
    const ipAddress = await getUserIP();

    const data = {
        name,
        email,
        password,
        ip_address: ipAddress
    };

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        console.log('Response:', body);
        if (status === 200) {
            window.location.replace('/home');
        } else {
            handleRegisterErrors(body.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Сталася помилка при реєстрації. Спробуйте ще раз.');
    });
}


// Аналогічно, в функції входу можна додати отримання IP-адреси
async function LogIn(email, password) {
    const ipAddress = await getUserIP(); // Отримуємо IP-адресу

    const data = {
        email,
        password,
        ip_address: ipAddress // Додаємо IP-адресу до даних (правильне ім'я ключа)
    };

    console.log("Attempting to log in with data:", data); // Для перевірки

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        console.log('Response:', body);
        if (status === 200) {
            window.location.replace('/home');
        } else {
            handleLoginErrors(body.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Сталася помилка при вході. Перевірте ваші дані.');
    });
}


function handleRegisterErrors(message) {
    clearError(unameDiv, errIcon01, em01);
    clearError(emailDiv, errIcon02, em03);
    clearError(passwordDiv, null, em05);
    iconShow1.style.fill = '';
    iconShow2.style.fill = '';

    switch(message) {
        case "Missing fields":
            alert("Будь ласка, заповніть всі поля.");
            break;
        case "Invalid email format":
            showError(emailDiv, errIcon02, em03, "Будь ласка, введіть коректну електронну пошту.");
            break;
        case "Password does not meet complexity requirements":
            showError(passwordDiv, null, em05, "Пароль повинен містити мінімум одну велику літеру, одну малу літеру та цифри.");
            iconShow1.style.fill = 'red';
            iconShow2.style.fill = 'red';
            break;
        case "Username already exists":
            showError(unameDiv, errIcon01, em02, "Це ім'я користувача вже зайняте.");
            break;
        case "Email already exists":
            showError(emailDiv, errIcon02, em04, "Цей email вже зареєстрований.");
            break;
        default:
            if (message.startsWith("Database error")) {
                alert(message);
            } else {
                alert("Сталася невідома помилка.");
            }
    }
}

function handleLoginErrors(message) {
    clearError(emailDiv1, errIcon04, em04_login);
    clearError(passwordDiv1, null, em05_login);
    iconShow3.style.fill = '';
    iconShow4.style.fill = '';

    switch(message) {
        case "Missing fields":
            alert("Будь ласка, заповніть всі поля.");
            break;
        case "Invalid email or password":
            showError(emailDiv1, errIcon04);
            showError(passwordDiv1, errIcon05, em05_login, "Невірний email або пароль.");
            iconShow3.style.fill = 'red';
            iconShow4.style.fill = 'red';
            break;
        default:
            if (message.startsWith("Database error")) {
                alert(message);
            } else {
                alert("Сталася невідома помилка.");
            }
    }
}
register_button.addEventListener('click', () => {
    container.classList.add('active');
});

login_button.addEventListener('click', () => {
    container.classList.remove('active');
});
iconShow1.addEventListener('click', () => {
    passwordInput.type = 'text';
    iconShow1.style.display = 'none';
    iconShow2.style.display = 'block';
});

iconShow2.addEventListener('click', () => {
    passwordInput.type = 'password';
    iconShow2.style.display = 'none';
    iconShow1.style.display = 'block';
});

iconShow3.addEventListener('click', () => {
    passwordInput2.type = 'text';
    iconShow3.style.display = 'none';
    iconShow4.style.display = 'block';
});

iconShow4.addEventListener('click', () => {
    passwordInput2.type = 'password';
    iconShow4.style.display = 'none';
    iconShow3.style.display = 'block';
});

reg_button.addEventListener('click', (event) => {
    event.preventDefault();
    let allIsOkey = true;

    if (uname.value.trim().length < 3) {
        allIsOkey = false;
        showError(unameDiv, errIcon01, em01, "Будь ласка, введіть довше ім'я.");
    } else {
        clearError(unameDiv, errIcon01, em01);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        allIsOkey = false;
        showError(emailDiv, errIcon02, em03, "Будь ласка, введіть коректну електронну пошту.");
    } else {
        clearError(emailDiv, errIcon02, em03);
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(password.value)) {
        allIsOkey = false;
        showError(passwordDiv, null, em05, "Пароль повинен містити мінімум одну велику літеру, одну малу літеру та цифри.");
        iconShow1.style.fill = 'red';
        iconShow2.style.fill = 'red';
    } else {
        clearError(passwordDiv, null, em05);
        iconShow1.style.fill = '';
        iconShow2.style.fill = '';
    }

    if (allIsOkey) {
        addUser(uname.value.trim(), email.value.trim(), password.value);
    }
});

log_button.addEventListener('click', (event) => {
    event.preventDefault();
    LogIn(email1.value.trim(), password1.value);
});

uname.addEventListener('input', () => {
    if (uname.value.trim().length > 2) {
        clearError(unameDiv, errIcon01, em01);
        if (em02){
            em02.textContent = '';
            em02.classList.remove('show');
        }
    }
});

email.addEventListener('input', () => {
    if (email.value.trim().includes('@')) {
        clearError(emailDiv, errIcon02, em03);
        if (em04){
            em04.textContent = '';
            em04.classList.remove('show');
        }
    }
});

password.addEventListener('input', () => {
    if (password.value.length > 7 && /[A-Z]/.test(password.value) && /[a-z]/.test(password.value) && /[0-9]/.test(password.value)) {
        clearError(passwordDiv, null, em05);
        iconShow1.style.fill = '';
        iconShow2.style.fill = '';
    }
});

email1.addEventListener('input', () => {
    if (email1.value.trim().includes('@')) {
        clearError(emailDiv1, errIcon04, em04_login);
    }
});

password1.addEventListener('input', () => {
    if (password1.value.length > 7 && /[A-Z]/.test(password1.value) && /[a-z]/.test(password1.value) && /[0-9]/.test(password1.value)) {
        clearError(passwordDiv1, null, em05_login);
        iconShow3.style.fill = '';
        iconShow4.style.fill = '';
    }
});
