const DrawerInitiator = {
    init({ button, drawer, content }) {
        button.addEventListener('click', (event) => {
            this._toggleDrawer(event, button, drawer);
        });

        content.addEventListener('click', (event) => {
            this._closeDrawer(event, button, drawer);
        });

        // Close drawer on Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && drawer.classList.contains('open')) {
                this._closeDrawer(event, button, drawer);
            }
        });
    },

    _toggleDrawer(event, button, drawer) {
        event.stopPropagation();
        const isOpen = drawer.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen);
    },

    _closeDrawer(event, button, drawer) {
        event.stopPropagation();
        drawer.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
    },
};

export default DrawerInitiator;