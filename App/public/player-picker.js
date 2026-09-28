function setPlayerPickerOptions(players) {
    const list = document.getElementById('playerOptions');
    list.replaceChildren();
    players.forEach((player, index) => {
        const option = document.createElement('li');
        option.id = `player-option-${index}`;
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.tabIndex = -1;
        option.dataset.player = player;
        option.textContent = player;
        list.appendChild(option);
    });
}

function initPlayerPicker() {
    const picker = document.getElementById('playerDropdown');
    const selection = document.getElementById('playerSelection');
    const list = document.getElementById('playerOptions');
    const wrapper = picker.closest('.select-wrap');
    const options = () => [...list.querySelectorAll('[role="option"]')];

    function close(restoreFocus = false) {
        list.hidden = true;
        picker.setAttribute('aria-expanded', 'false');
        if (restoreFocus) picker.focus();
    }

    function open(focusIndex = null) {
        const items = options();
        if (!items.length) return;
        list.hidden = false;
        picker.setAttribute('aria-expanded', 'true');
        if (focusIndex !== null) items[focusIndex].focus();
    }

    function choose(option) {
        picker.dataset.player = option.dataset.player;
        selection.textContent = option.textContent;
        options().forEach((item) => {
            item.setAttribute('aria-selected', String(item === option));
        });
        close(true);
    }

    picker.addEventListener('click', () => {
        if (list.hidden) open();
        else close();
    });

    picker.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            const items = options();
            if (!items.length) return;
            event.preventDefault();
            const selectedIndex = items.findIndex((item) => item.getAttribute('aria-selected') === 'true');
            const index = selectedIndex < 0
                ? (event.key === 'ArrowDown' ? 0 : items.length - 1)
                : selectedIndex;
            open(index);
        } else if (event.key === 'Escape') {
            close();
        }
    });

    list.addEventListener('click', (event) => {
        const option = event.target.closest('[role="option"]');
        if (option && list.contains(option)) choose(option);
    });

    list.addEventListener('keydown', (event) => {
        const items = options();
        const index = items.indexOf(document.activeElement);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const step = event.key === 'ArrowDown' ? 1 : -1;
            items[(index + step + items.length) % items.length].focus();
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            items[event.key === 'Home' ? 0 : items.length - 1].focus();
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (index >= 0) choose(items[index]);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            close(true);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            close();
            if (event.shiftKey) picker.focus();
            else document.querySelector('#playerForm button[type="submit"]').focus();
        }
    });

    document.addEventListener('pointerdown', (event) => {
        if (!wrapper.contains(event.target)) close();
    });

    wrapper.addEventListener('focusout', (event) => {
        if (!wrapper.contains(event.relatedTarget)) close();
    });
}

document.addEventListener('DOMContentLoaded', initPlayerPicker);
