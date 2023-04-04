import { DeliverooApi } from '@unitn-asa/deliveroo-js-client';

class Agent {
    constructor(options) {
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

    onConnect() {
        this.apiService.onConnect(() => {
            console.log('socket connect', this.apiService.socket.id);
        });
    }

    onDisconnect() {
        this.apiService.onDisconnect(() => {
            console.log('socket disconnect', this.apiService.socket.id);
        });
    }

    onTile() {
        this.apiService.onTile((x, y, isDeliveryTile) => {
            console.log('tile', x, y, isDeliveryTile);
        });
    }

    onYou() {
        this.apiService.onYou((me) => {
            console.log(
                `${me.name} (${me.id}) is at (${me.x}, ${me.y}) with score ${me.score}`
            );
        });
    }

    onAgentsSensing() {
        this.apiService.onAgentsSensing((agents) => {
            console.log(agents);
        });
    }

    onParcelsSensing() {
        this.apiService.onParcelsSensing((parcels) => {
            console.log(parcels);
        });
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

    async play() {
        var directionIndex = 1; // 'right'

        while (true) {
            await this.timer(100); // wait 0.1 sec and retry; if stucked, this avoid infinite loop

            await this.putdown();

            await this.timer(100); // wait 0.1 sec

            await this.pickup();

            await this.timer(100); // wait 0.1 sec

            directionIndex += [0, 1, 3][Math.floor(Math.random() * 3)]; // straigth or turn left or right, not going back

            var status = await this.move(this.getDirectionName(directionIndex));

            if (!status) {
                console.log('move failed');

                directionIndex += [2, 1, 3][Math.floor(Math.random() * 3)]; // backward or turn left or right, not try again straight, which just failed
            }
        }
    }
}

export default Agent;
