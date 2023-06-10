const hostCardViewTemplate = document.createElement('template');
hostCardViewTemplate.innerHTML = `
    <link rel="stylesheet" href="js/components/host-card-view/HostCardView.css"/>
    <div class="host-card-view">
        <div class="loading">
            Loading...
        </div>
        <div class="details" hidden>
            <h3 class="name"></h3>
            <span class="host"></span>|
            <span class="model"></span>
            <div class="controllers"></div>
        </div>
    </div>
`;

class HostCardView extends HTMLElement {

    #hostId;
    #detailsView;
    #loadingView;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(hostCardViewTemplate.content.cloneNode(true));
        this.#hostId = this.dataset.hostId;
        this.#detailsView = this.shadowRoot.querySelector('div.details');
        this.#loadingView = this.shadowRoot.querySelector('div.loading');

        this.#fetchHostInfo();
    }

    #populateDetails(host, controllers) {
        console.log(host);
        const nameTag = this.shadowRoot.querySelector('h3.name');
        nameTag.innerText = host.name;
        
        const hostTag = this.shadowRoot.querySelector('span.host');
        hostTag.innerText = host.host;

        const modelTag = this.shadowRoot.querySelector('span.model');
        modelTag.innerText = host.model;

        const controllersTag = this.shadowRoot.querySelector('div.controllers');
        controllers.forEach(controller => {
            const ele = document.createElement('div');
            ele.className = 'controller';

            const controllerNameTag = document.createElement('h4');
            controllerNameTag.innerText = controller.name;
            ele.appendChild(controllerNameTag);

            controllersTag.appendChild(ele);
        });

        // Show details
        console.log('switch to details view');
        this.#loadingView.setAttribute('hidden', '');
        this.#detailsView.removeAttribute('hidden');
    }

    #fetchHostInfo() {
        fetch(`/api/hosts/${this.#hostId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error getting host with id: ${this.#hostId}\nStatus: ${res.status}`);
                }
                res.json()
                    .then(host => {
                        fetch(`/api/hosts/${this.#hostId}/controllers`)
                            .then(res => {
                                if (!res.ok) {
                                    throw new Error(`Error getting controllers with hostId: ${this.#hostId}\nStatus: ${res.status}`);
                                }
                                res.json()
                                    .then(controllers => {
                                        this.#populateDetails(host, Object.values(controllers.children));
                                    });
                            });
                    });
            })
            .catch(err => console.log(err));
    }

}

window.customElements.define('host-card-view', HostCardView);