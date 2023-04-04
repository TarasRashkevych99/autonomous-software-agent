import { DeliverooApi } from '@unitn-asa/deliveroo-js-client';

class Agent {
    constructor(options) {
        if (this.constructor === Agent) {
            throw new TypeError('Cannot instantiate abstract class');
        }
        this.apiService = new DeliverooApi(process.env.HOST, process.env.TOKEN);
        this.data = new Map();
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
