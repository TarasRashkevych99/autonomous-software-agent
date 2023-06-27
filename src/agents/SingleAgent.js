import Agent from './Agent.js';

export default class SingleAgent extends Agent {
    constructor(options) {
        super(options);
        this.me = {};
        this.map = {};
        this.visibleAgents = new Map();
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

    onMap() {
        this.apiService.onMap((width, height, cells) => {
            console.log('map', width, height, cells);
            this.map.width = width;
            this.map.height = height;
            this.map.cells = cells;
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

    onYou() {
        this.apiService.onYou((me) => {
            // console.log(
            //     `${me.name} (${me.id}) is at (${me.x}, ${me.y}) with score ${me.score}`
            // );
            this.me = {
                id: me.id,
                name: me.name,
                x: me.x,
                y: me.y,
                score: me.score,
            };
        });
    }

    onAgentsSensing() {
        this.apiService.onAgentsSensing((agents) => {
            // console.log(agents);
            // this.visibleAgents = agents;
            console.log('visible agents', this.visibleAgents);
            for (const agent of agents) {
                if (agent.x % 1 != 0 || agent.y % 1 != 0) {
                    continue;
                }

                // I meet someone for the first time
                if (!this.visibleAgents.has(agent.id)) {
                    this.visibleAgents.set(agent.id, [agent]);
                } else {
                    // I already met him
                    const history = this.visibleAgents.get(agent.id);

                    // this is about the last time I saw him
                    const last = history[history.length - 1];
                    const second_last =
                        history.length > 2
                            ? history[history.length - 2]
                            : 'no knowledge';

                    if (last != 'lost') {
                        // I was seeing him also last time
                        if (last.x != agent.x || last.y != agent.y) {
                            // He moved
                            history.push(agent);
                        }
                    } else {
                        // I see him again after some time and he could have moved or not in the meanwhile
                        history.push(agent);
                    }
                }
            }
            for (const [id, history] of this.visibleAgents.entries()) {
                const last = history[history.length - 1];
                const second_last =
                    history.length > 1
                        ? history[history.length - 2]
                        : 'no knowledge';

                if (!agents.map((a) => a.id).includes(id)) {
                    // If I am not seeing him anymore

                    if (last != 'lost') {
                        // Just went off
                        history.push('lost');
                    } else {
                        // A while since last time I saw him

                        if (this.distance(this.me, second_last) <= 3) {
                            this.visibleAgents.delete(id);
                        }
                    }
                } else {
                    // If I am still seing him ... see above
                    // console.log( 'still seing him', last.name )
                }
            }
        });
    }

    onParcelsSensing() {
        // this.apiService.onParcelsSensing((parcels) => {
        //     console.log(parcels);
        // });
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
