document.addEventListener('DOMContentLoaded', () => {
    const correct_link = document.querySelector('#correct_link');
    const new_link = document.querySelector('#new_link');
    const button_add_link = document.querySelector('#button_add_link');
    const link_library = document.querySelector('.Link_Library');
    const buttons = document.querySelectorAll('.color_button');
    let links = [];

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((btn) => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    async function fetchAndDisplayLinks(linkLibrary) {
        try {
            const getResponse = await fetch('/api/links_get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!getResponse.ok) {
                const errorMessage = await getResponse.json();
                console.error('Помилка при отриманні даних:', errorMessage.message);
                return;
            }

            let result = await getResponse.json();
            result = result.replace(/[\[\]]/g, "");
            result = result.replace(/'/g, "");
            result = result.split(", ");

            linkLibrary.innerHTML = '';
            result.forEach(link => {
                const linkElement = document.createElement('div');
                linkElement.innerHTML = link;
                linkElement.addEventListener('contextmenu', () => {
                    const confirmation = confirm("Ви впевнені, що хочете видалити це посилання?");
                    if (confirmation) {
                        linkLibrary.removeChild(linkElement);
                        deleteLinkFromServer(link);
                    }
                });
                linkLibrary.appendChild(linkElement);
            });

            links = result;
            return links;
        } catch (error) {
            console.error('Сталася помилка:', error);
        }
    }

    async function deleteLinkFromServer(link) {
        try {
            const response = await fetch('/api/links_delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: link })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                console.error('Помилка при видаленні посилання:', errorMessage.message);
                return;
            }

        } catch (error) {
            console.error('Сталася помилка при видаленні:', error);
        }
    }

    async function updateAndGetLink() {
        try {
            const response = await fetch('/api/links_update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    links: links
                })
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                console.error('Помилка:', errorMessage.message);
                return;
            }
            return fetchAndDisplayLinks(link_library);
        } catch (error) {
            console.error('Сталася помилка:', error);
        }
    }

    button_add_link.addEventListener('click', () => {
        if (correct_link.value !== '' && new_link.value !== '') {
            const selectedButton = document.querySelector('.selected');
            const colorClass = selectedButton ? selectedButton.classList[0] : '';
            const newLinkHTML = '<a href="'+correct_link.value+'"><div class="link '+colorClass+'">'+new_link.value+'</div></a>';
            link_library.insertAdjacentHTML('beforeend', newLinkHTML);
            links.push(newLinkHTML);
            updateAndGetLink();
            correct_link.value = '';
            new_link.value = '';
        }
    });
    fetchAndDisplayLinks(link_library);
});
