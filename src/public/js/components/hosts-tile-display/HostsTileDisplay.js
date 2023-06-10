const hostsTileDisplayTemplate = document.createElement('template');
hostsTileDisplayTemplate.innerHTML = `
    <link rel="stylesheet" href="js/components/hosts-tile-display/HostsTileDisplay.css"/>
    <div class="hosts-tile-display">
    </div>
`;

class HostsTileDisplay extends HTMLElement {

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(hostsTileDisplayTemplate.content.cloneNode(true));

        this.#fetchHosts();
    }

    #fetchHosts() {
        fetch('/api/hosts')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to get hosts. Status: ${res.status}`);
                }
                res.json()
                    .then(hosts => {
                        this.shadowRoot.querySelector('div.hosts-tile-display').innerHTML = `
                            ${Object.keys(hosts).map(id => `<host-card-view data-host-id="${id}"></host-card-view>`)}
                        `;
                    })
            })
    }

}

window.customElements.define('hosts-tile-display', HostsTileDisplay);