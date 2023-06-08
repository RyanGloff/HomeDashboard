const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="js/components/card-layout/CardLayout.css"/>
    <div class="card-layout">
        <ul class="tab-list"></ul>
        <slot></slot>
    </div>
`;

class CardLayout extends HTMLElement {

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(template.content.cloneNode(true));

        // Create tabs
        const tabList = shadow.querySelector('.tab-list');
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children.item(i);
            const label = child.getAttribute('label');
            
            // Create tab
            const tab = document.createElement('li');
            tab.innerText = label.charAt(0).toUpperCase() + label.slice(1);
            tab.addEventListener('click', e => this.active = label);
            tabList.appendChild(tab);
        }
    }

    get active () {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children.item(i).getAttribute('active') !== null)
                return this.children.item(i);
        }
        return null;
    }

    set active (label) {
        const tabList = this.shadowRoot.querySelector('ul.tab-list');
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children.item(i);
            const tab = tabList.children.item(i);
            if (child.getAttribute('label') === label) {
                child.setAttribute('active', '');
                tab.setAttribute('active', '');
            } else {
                child.removeAttribute('active');
                tab.removeAttribute('active');
            }
        }
    }

}

window.customElements.define('card-layout', CardLayout);