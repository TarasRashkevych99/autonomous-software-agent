import Agent from './Agent.js';

export default class RandomAgent extends Agent {
    constructor(options) {
        super(options);
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
