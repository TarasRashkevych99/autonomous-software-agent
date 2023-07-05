import Agent from './Agent.js';
// import GoPickUp from '../models/GoPickUp.js';

export default class SingleAgent extends Agent {
    constructor(options) {
        super(options);
        this.me = {};
        this.map = {};
        this.config = {};
        this.visibleAgents = new Map();
        this.visibleParcels = new Map();
        this.deliveryTiles = [];
        this.intetion_queue = new Array();
        this.plans = [];
        // plans.push(new GoPickUp()); // building the plan library // not sure if this is the right way to do it
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

    onConfig() {
        this.apiService.onConfig((config) => {
            this.config = config;
            const { PARCEL_DECADING_INTERVAL } = this.config;
            if (PARCEL_DECADING_INTERVAL === 'infinite') {
                this.config.PARCEL_DECADING_INTERVAL = 0;
            } else {
                this.config.PARCEL_DECADING_INTERVAL = parseInt(
                    PARCEL_DECADING_INTERVAL.split('s')[0]
                );
            }
            this.config.MOVEMENT_DURATION =
                this.config.MOVEMENT_DURATION / 1000;
            console.log('config', this.config);
        });
    }

    onYou() {
        this.apiService.onYou((me) => {
            this.me = {
                id: me.id,
                name: me.name,
                x: me.x,
                y: me.y,
                score: me.score,
            };
        });
    }

    // this method lists all the agents that you can see
    onAgentsSensing() {
        this.apiService.onAgentsSensing((agents) => {
            console.log('agents', agents);
            for (const agent of agents) {
                // round the coordinates to avoid floating point positions
                agent.x = Math.round(agent.x);
                agent.y = Math.round(agent.y);
                this.visibleAgents.set(agent.id, agent);
            }
        });
    }

    // this method lists all the parcels that you can see
    onParcelsSensing() {
        this.apiService.onParcelsSensing((parcels) => {
            for (const parcel of parcels) {
                // set is used to avoid duplicates
                this.visibleParcels.set(parcel.id, parcel);
            }
        });
    }

    onMap() {
        this.apiService.onMap((width, height, cells) => {
            //console.log('map', width, height, cells);
            this.map.width = width;
            this.map.height = height;
            this.map.cells = cells;

            // get the delivery tiles
            cells.forEach((cell) => {
                if (cell.delivery) {
                    this.deliveryTiles.push({ x: cell.x, y: cell.y });
                }
            });
        });
    }

    // this method lists all the tiles on which you can move
    onTile() {
        // this.apiService.onTile((x, y, isDeliveryTile) => {
        //     console.log('tile', x, y, isDeliveryTile);
        // });
    }

    // this method lists all the tiles on which you cannot move (walls in the game)
    onNotTile() {
        // this.apiService.onNotTile((x, y) => {
        //     console.log('Not tile', x, y);
        // });
    }

    /**
     * BDI loop
     */

    async play() {
        this.apiService.onParcelsSensing(async (parcels) => {
            this.visibleParcels.clear();
            for (const parcel of parcels) {
                // set is used to avoid duplicates
                this.visibleParcels.set(parcel.id, parcel);
            }
            const options = [];
            console.log('playing');
            console.log('visible parcels', this.visibleParcels);
            // console.log(this);
            // TO DO: Extend this part for the generation of the options
            for (const parcel of this.visibleParcels.values()) {
                if (!parcel.carriedBy) {
                    options.push({ desire: 'go_pick_up', args: [parcel] });
                }
            }

            // TO DO: Revisit the selection of the best option
            let best_option;
            let nearest = Number.MAX_VALUE;
            for (const option of options) {
                if (option[0] == 'go_pick_up') {
                    let [go_pick_up, x, y, id] = option;
                    let current_d = distance({ x, y }, me);
                    if (current_d < nearest) {
                        best_option = option;
                        nearest = current_d;
                    }
                }
            }
            console.log('before move');
            // await this.move(this.PossibleMove.Down);
            console.log('============================');
            console.log(this.me);
            console.log(this.chooseBestParcelAndDeliveryTile());
            console.log('============================');
            console.log('after move');
            /**
             * Revise/queue intention if I have a better option
             */
            if (best_option)
                this.queue(best_option.desire, ...best_option.args);
        }); //maybe this can work
    }

    async intentionLoop() {
        while (true) {
            if (this.intetion_queue.length > 0) {
                const intention = this.intetion_queue.shift();
                if (intention) {
                    await this.execute.achieve();
                }
                await new Promise((resolve) => setImmediate(resolve)); // wait for the next tick
            }
        }
    }

    // TO DO: modify it to a better queue system
    async queue(desire, ...args) {
        const last = this.intetion_queue[this.intetion_queue.length - 1]; // get the last intention
        const current = new Intention(desire, ...args); // create a new intention
        this.intetion_queue.push(current); // add the new intention to the queue to be executed
    }

    async stop() {
        console.log('stop agent queued intentions');
        for (const intention of this.intetion_queue) {
            intention.stop();
        }
    }

    chooseBestParcelAndDeliveryTile() {
        let maxReward = Number.MIN_VALUE;
        let bestParcel;
        let bestDeliveryTile;
        let bestDistance = Number.MAX_VALUE;
        let parcelDecadingInterval = this.config.PARCEL_DECADING_INTERVAL;
        let agentMovementDuration = this.config.MOVEMENT_DURATION;
        let agentVelocity = 1 / agentMovementDuration;
        for (const parcel of this.visibleParcels.values()) {
            if (!parcel.carriedBy) {
                for (const deliveryTile of this.deliveryTiles) {
                    const distanceFromMeToParcel = this.distance(
                        { x: this.me.x, y: this.me.y },
                        parcel
                    );
                    const distanceFromParceltoDeliveryTile = this.distance(
                        parcel,
                        deliveryTile
                    );
                    const totalDistance =
                        distanceFromMeToParcel +
                        distanceFromParceltoDeliveryTile;
                    const timeToDeliverParcel = totalDistance / agentVelocity;
                    const parcelLostReward =
                        timeToDeliverParcel / parcelDecadingInterval;
                    const parcelRemainingReward =
                        parcel.reward - parcelLostReward;
                    if (parcelRemainingReward > maxReward) {
                        bestParcel = parcel;
                        bestDeliveryTile = deliveryTile;
                        maxReward = parcelRemainingReward;
                    }
                }
            }
        }
        return { bestParcel, bestDeliveryTile, maxReward };
    }
}
