import { DeliverooApi } from '@unitn-asa/deliveroo-js-client';

export default class Agent {
    constructor(options) {
        if (this.constructor === Agent) {
            throw new TypeError('Cannot instantiate abstract class');
        }
        this.apiService = new DeliverooApi(process.env.HOST, process.env.TOKEN);
        this.PossibleMove = Object.freeze({
            Up: 'up',
            Right: 'right',
            Down: 'down',
            Left: 'left',
        });
        this.registerListeners();
    }

    registerListeners() {
        this.onConnect();
        this.onDisconnect();
        this.onMap();
        this.onConfig();
        this.onTile();
        this.onNotTile();
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

    distance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
        const dx = Math.abs(Math.round(x1) - Math.round(x2));
        const dy = Math.abs(Math.round(y1) - Math.round(y2));
        return dx + dy;
    }
}

Agent.prototype.onConnect = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onDisconnect = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onMap = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onConfig = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onTile = function () {
    throw new Error('Method not implemented');
};

Agent.prototype.onNotTile = function () {
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
