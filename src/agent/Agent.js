import { DeliverooApi } from '@unitn-asa/deliveroo-js-client';
import ParcelsOnMap from './ParcelsOnMap.js';

class Agent {
    constructor(options) {
        if (this.constructor === Agent) {
            throw new TypeError('Cannot instantiate abstract class');
        }
        this.apiService = new DeliverooApi(process.env.HOST, process.env.TOKEN);
        this.data = new ParcelsOnMap();
        this.startTimestamp = Date.now();
        this.possibleMoves = ['up', 'right', 'down', 'left'];
        this.registerListeners();
    }

    registerListeners() {
        this.onConnect();
        this.onDisconnect();
        this.onTile();
        this.onYou();
        this.onAgentsSensing();
        this.onParcelsSensing();
    }

    async move(direction) {
        await this.apiService.move(direction);
    }

    async putdown() {
        await this.apiService.putdown();
    }

    async pickup() {
        await this.apiService.pickup();
    }

    async timer(ms) {
        await this.apiService.timer(ms);
    }

    async pickANDput() {
        await this.timer(100); // wait 0.1 sec and retry; if stucked, this avoid infinite loop
        await this.putdown();
        await this.timer(100); // wait 0.1 sec
        await this.pickup();
        await this.timer(100); // wait 0.1 sec
    }

    distance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
        const dx = Math.abs(Math.round(x1) - Math.round(x2));
        const dy = Math.abs(Math.round(y1) - Math.round(y2));
        return dx + dy;
    }

    onPosition() {
        const x = this.apiService.onYou((me) => {
            return `${me.x}`;
        });
    }

    getDirectionName(directionIndex) {
        if (directionIndex > 3) directionIndex = directionIndex % 4;
        return this.possibleMoves[directionIndex];
    }
}

Agent.prototype.onConnect = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onDisconnect = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onTile = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onYou = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onAgentsSensing = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onParcelsSensing = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.play = function () {
    throw new Error('Method not implemented');
};

export default Agent;
