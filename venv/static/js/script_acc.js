document.addEventListener('DOMContentLoaded', () => {
    const spans = document.querySelectorAll('.set_edit_span');
    const formProfile = document.querySelector('.form_profile');
    const profileInfo = document.querySelector('.profile_info');
    const exit = document.getElementById("exit");
    const email = document.getElementById("email");
    const old_password = document.getElementById("password");
    const new_password = document.getElementById("new_password");
    const first_name = document.getElementById("first_name");
    const last_name = document.getElementById("last_name");
    const username = document.getElementById("username");
    const info = document.getElementById("info");
    const saveButton = document.getElementById('save_changes');
    const usernameDiv = document.querySelector('.form_profile .in1');
    const emailDiv = document.querySelector('.form_profile .in2');
    const old_passwordDiv = document.querySelector('.form_profile .in3');
    const new_passwordDiv = document.querySelector('.form_profile .in4');
    const usernameIcon = document.querySelector('.form_profile .i01');
    const emailIcon = document.querySelector('.form_profile .i02');
    const iconShow1 = document.querySelector('.form_profile .is01');
    const iconShow2 = document.querySelector('.form_profile .is02');
    const iconShow3 = document.querySelector('.form_profile .is03');
    const iconShow4 = document.querySelector('.form_profile .is04');
    const em01 = document.querySelector('.form_profile .em01');
    const em02 = document.querySelector('.form_profile .em02');
    const em03 = document.querySelector('.form_profile .em03');
    const em04 = document.querySelector('.form_profile .em04');

    if (!saveButton) {
        console.error('Save button not found');
        return;
    }

    function showError(div, icon, em, message) {
        div.classList.add('error');
        if(icon) icon.classList.add('err_icon_show');
        if(em) {
            em.textContent = message;
            em.classList.add('show');
        }
    }

    function clearError(div, icon, em) {
        div.classList.remove('error');
        if(icon) icon.classList.remove('err_icon_show');
        if(em) {
            em.classList.remove('show');
            em.textContent = '';
        }
    }

    iconShow1.addEventListener('click', () => {
        old_password.type = 'text';
        iconShow1.style.display = 'none';
        iconShow2.style.display = 'block';
    });

    iconShow2.addEventListener('click', () => {
        old_password.type = 'password';
        iconShow2.style.display = 'none';
        iconShow1.style.display = 'block';
    });

    iconShow3.addEventListener('click', () => {
        new_password.type = 'text';
        iconShow3.style.display = 'none';
        iconShow4.style.display = 'block';
    });

    iconShow4.addEventListener('click', () => {
        new_password.type = 'password';
        iconShow4.style.display = 'none';
        iconShow3.style.display = 'block';
    });

    spans[0].addEventListener('click', () => {
        spans[1].classList.remove("set_edit_show");
        spans[0].classList.add("set_edit_show");
        formProfile.style.display = 'block';
        profileInfo.style.display = 'none';
    });

    spans[1].addEventListener('click', () => {
        spans[0].classList.remove("set_edit_show");
        spans[1].classList.add("set_edit_show");
        formProfile.style.display = 'none';
        profileInfo.style.display = 'flex';
    });

    exit.addEventListener("click",()=>{window.location.replace('/')});

    async function getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            console.log("IP Address:", data.ip);
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return null;
        }
    }

    async function createMapFromIP(ipAddress) {
        try {
            const response = await fetch('https://ipapi.co/'+ipAddress+'/json/');
            const data = await response.json();

            if (!data.latitude || !data.longitude) {
                throw new Error('Не вдалося отримати геолокацію для IP.');
            }

            const lat = data.latitude;
            const lon = data.longitude;

            const map = L.map('map').setView([lat, lon], 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            L.marker([lat, lon]).addTo(map)
                .bindPopup('Location')
                .openPopup();

        } catch (error) {
            console.error('Помилка при отриманні геолокації:', error);
        }
    }


    function handleRegisterErrors(message) {
        clearError(usernameDiv, usernameIcon, em01);
        clearError(emailDiv, emailIcon, em02);
        clearError(new_passwordDiv, null, em04);
        clearError(old_passwordDiv, null, em03);
        iconShow1.style.fill = '';
        iconShow2.style.fill = '';
        iconShow3.style.fill = '';
        iconShow4.style.fill = '';

        switch(message) {
            case "Missing fields":
                alert("Будь ласка, заповніть всі поля.");
                break;
            case "Invalid email format":
                showError(emailDiv, emailIcon, em02, "Будь ласка, введіть коректну електронну пошту.");
                break;
            case "Password does not meet complexity requirements":
                showError(new_passwordDiv, null, em04, "Пароль повинен містити мінімум одну велику літеру, одну малу літеру та цифри.");
                iconShow3.style.fill = 'red';
                iconShow4.style.fill = 'red';
                break;
            case "Username already exists":
                showError(usernameDiv, usernameIcon, em01, "Це ім'я користувача вже зайняте.");
                break;
            case "Invalid email or password":
                showError(old_passwordDiv, null, em03, "Невірний пароль.");
                iconShow1.style.fill = 'red';
                iconShow2.style.fill = 'red';
                break;
            case "Email already exists":
                showError(emailDiv, emailIcon, em02, "Цей email вже зареєстрований.");
                break;
            default:
                if (message.startsWith("Database error")) {
                    alert(message);
                } else {
                    alert("Сталася невідома помилка.");
                }
        }
    }
    async function get_info(first_name, last_name, username, email, old_password, new_password, info) {
        const ip_address = await getUserIP();
        const data = { first_name, last_name, username, email, old_password, new_password, info, ip_address };
        fetch('/api/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200) {
                spans[0].classList.remove("set_edit_show");
                spans[1].classList.add("set_edit_show");
                formProfile.style.display = 'none';
                profileInfo.style.display = 'flex';
                location.reload();
            } else {
                handleRegisterErrors(body.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Сталася помилка при зміні. Перевірте ваші дані.');
        });
    }

    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        let allIsOkey = true;

        if (username.value.trim().length < 3) {
            allIsOkey = false;
            showError(usernameDiv, usernameIcon, em01, "Будь ласка, введіть довше ім'я.");
        } else {
            clearError(usernameDiv, usernameIcon, em01);
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            allIsOkey = false;
            showError(emailDiv, emailIcon, em02, "Будь ласка, введіть коректну електронну пошту.");
        } else {
            clearError(emailDiv, emailIcon, em02);
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordPattern.test(old_password.value)) {
            allIsOkey = false;
            showError(old_passwordDiv, null, em03, "Enter correct password");
            iconShow1.style.fill = 'red';
            iconShow2.style.fill = 'red';
        } else {
            clearError(old_passwordDiv, null, em03);
            iconShow1.style.fill = '';
            iconShow2.style.fill = '';
        }

        if (allIsOkey) {
            event.preventDefault();
            get_info(
                first_name.value.trim(),
                last_name.value.trim(),
                username.value.trim(),
                email.value.trim(),
                old_password.value.trim(),
                new_password.value.trim(),
                info.value.trim()
            );
        };
    });
    async function fetchUserData() {
        try {
            const response = await fetch('/api/user');
            if (!response.ok) {
                throw new Error('Не вдалося отримати дані користувача');
            }
            const userData = await response.json();
            if (userData.success) {
                if (userData.user_data.first_name !== 'Undefined' && userData.user_data.last_name !== 'Undefined') {
                    document.getElementById('name_display').textContent = userData.user_data.first_name + ' ' + userData.user_data.last_name;
                } else if (userData.user_data.first_name !== 'Undefined' && userData.user_data.last_name === 'Undefined') {
                    document.getElementById('name_display').textContent = userData.user_data.first_name;
                } else if (userData.user_data.first_name === 'Undefined' && userData.user_data.last_name !== 'Undefined') {
                    document.getElementById('name_display').textContent = userData.user_data.last_name;
                } else {
                    document.getElementById('name_display').textContent = 'No Name';
                }

                document.getElementById('username_display').textContent = userData.user_data.user_name;
                document.getElementById('email_display').textContent = userData.user_data.email;
                document.getElementById('status_display').textContent = userData.user_data.status;
                console.log(userData);
                if (userData.user_data.info != '' && userData.user_data.info != null){
                    document.getElementById('info_display').textContent = userData.user_data.info;
                }else{
                    document.getElementById('info_display').textContent = 'No Info';
                }

                if (userData.user_data.first_name != 'Undefined' && userData.user_data.first_name != ' '){
                    document.getElementById('first_name').value = userData.user_data.first_name;
                }
                if (userData.user_data.last_name != 'Undefined' && userData.user_data.last_name != ' '){
                    document.getElementById('last_name').value = userData.user_data.last_name;
                }
                document.getElementById('username').value = userData.user_data.user_name;
                document.getElementById('email').value = userData.user_data.email;
                document.getElementById('info').value = userData.user_data.info;
            } else {
                alert(userData.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Виникла помилка при отриманні даних користувача.');
        }
    }
    window.onload = async function() {
        const userIP = await getUserIP();
        createMapFromIP(userIP);
    };

    fetchUserData();
});
