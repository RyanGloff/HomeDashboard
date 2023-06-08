import Client from 'tplink-smarthome-api';

class KasaDiscovery {

    #client;

    constructor() {
        this.#client = new Client.Client();
    }

    async start () {
        const seenHosts = {};
        this.#client.startDiscovery().on('device-new', device => {
            if (!seenHosts.hasOwnProperty(device.host)) {
                seenHosts[device.host] = device._sysInfo.model;
                console.log(`New device discovered: \n{\n\tHost: "${device.host}",\n\t"model": "${device._sysInfo.model}"\n}`);
            }
        });
    }

}

const discovery = new KasaDiscovery();
discovery.start();