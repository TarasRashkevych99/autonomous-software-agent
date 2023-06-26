import Agent from './Agent.js';

class RandomAgent extends Agent {
    constructor(options) {
        super(options);
        let you = { name: 'name', id: 'id', x: 0, y: 0, score: 0 };
        //this.parcels = { x: [], y: [], carriedBy: [], reward: [] };
        this.nearestParcelDistance = 1000;
        this.nearestParcel = {
            x: 0,
            y: 0,
            carriedBy: 0,
            reward: 0,
            distance: 0,
        };
        this.directionIndex = 0;
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
            //console.log('tile', x, y, isDeliveryTile);
        });
    }

    onYou() {
        this.apiService.onYou((me) => {
            // console.log(
            //     `${me.name} (${me.id}) is at (${me.x}, ${me.y}) with score ${me.score}`
            // );
            this.you = {
                name: me.name,
                id: me.id,
                x: me.x,
                y: me.y,
                score: me.score,
            };
        });
    }

    onAgentsSensing() {
        this.apiService.onAgentsSensing((agents) => {
            //console.log(agents);
        });
    }

    //emitted every time the player move or parcels reward timer decades
    onParcelsSensing() {
        this.apiService.onParcelsSensing((parcels) => {
            //console.log(parcels);
            this.data.parcelsHistory(this.startTimestamp, parcels);
            this.nearestParcel = this.data.nearestParcel(
                this.you,
                parcels,
                this.nearestParcelDistance
            );
            console.log(this.nearestParcel);
            this.directionIndex = this.data.getDirectionToParcel(
                this.you,
                this.nearestParcel
            );
            //console.log(this.directionIndex);
        });
    }

    async play() {
        var directionIndex = 1; // 'right'

        while (true) {
            //Definisco la parcel più vicina come parcel obiettivo, la raggiungo con il metodo getDirectionToParcel e la raccolgo
            // this.pickANDput();
            // if (this.nearestParcel.distance > 0) {
            //     var objectiveParcel = this.nearestParcel;
            //     var directionIndex = this.apiService.onParcelsSensing(
            //         (parcels) => {
            //             return this.data.getDirectionToParcel(
            //                 this.you,
            //                 objectiveParcel
            //             );
            //         }
            //     );
            //     console.log(directionIndex);
            // }

            /////////////////////// Move in a random direction
            // while (true) {
            //     this.pickANDput();

            directionIndex += [0, 1, 3][Math.floor(Math.random() * 3)]; // straigth or turn left or right, not going back

            var status = await this.move(this.getDirectionName(directionIndex));
            console.log(this.you.x);
            console.log(this.parcels.x);

            if (!status) {
                console.log('move failed');

                directionIndex += [2, 1, 3][Math.floor(Math.random() * 3)]; // backward or turn left or right, not try again straight, which just failed
                // }

                /////////////////////// Move towards the nearest parcel
                //     while (true) {
                //         this.pickANDput();
                //         if (this.nearestParcel.distance > 0) {
                //             var directionIndex = this.data.getDirectionToParcel(
                //                 this.you,
                //                 this.nearestParcel
                //             );
                //             await this.move(this.getDirectionName(directionIndex));
                //         }
                //     }
            }
        }
    }
}

export default RandomAgent;
