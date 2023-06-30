import Agent from './Agent.js';

export default class SingleAgent extends Agent {
    constructor(options) {
        super(options);
        this.me = {};
        this.map = {};
        this.visibleAgents = new Map();
        this.visibleParcels = new Map();
        this.deliveryTiles = [];
        //const client = this.apiService;
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
    /**
     * Beliefs (information that the agent has about the world)
     */

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
                if (cell.isDeliveryTile) {
                    this.deliveryTiles.push([cell.x, cell.y]);
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

    agentLoop() {
        /**
         * Options
         */
        const options = [];
        for (const parcel of this.visibleParcels.values()) {
            if (!parcel.carriedBy) {
                options.push({ desire: 'go_pick_up', args: [parcel] });
            }
        }

        /**
         * Select best intention
         */
        let best_option;
        let nearest = Number.MAX_VALUE;
        for (const option of options) {
            let current_i = option.desire;
            let current_d = this.distance(option.args[0], this.me);
            if (current_i == 'go_pick_up' && current_d < nearest) {
                best_option = option;
                nearest = this.distance(option.args[0], this.me);
            }
        }

        /**
         * Revise/queue intention
         */
        if (best_option) this.queue(best_option.desire, ...best_option.args);
    }

    /**
     * TO DO
     * 
     *  // recall the agentLoop method when the agent perceives something new
    // in bdi_control_loop.js, this is done in the onParcelsSensing method
    // in this case we don't have to pass a function but a method of the class
    
    //prof version : client.onParcelSensing (agentLoop)
    //this.apiService.onParcelsSensing(this.agentLoop);
        */

    activateLoop() {
        this.apiService.onParcelsSensing(this.agentLoop); //maybe this can work
    }
}
