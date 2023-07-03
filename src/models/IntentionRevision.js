import SingleAgent from '../agents/SingleAgent';
import Intention from './Intention';

class IntentionRevision extends Intention {
    #intention_queue = new Array();
    get intention_queue() {
        return this.#intention_queue;
    }

    async loop() {
        while (true) {
            if (this.#intention_queue.length > 0) {
                console.log(
                    'intentionRevision.loop',
                    this.intention_queue.map((i) => i.predicate)
                );

                // Current INTENTION
                const intention = this.#intention_queue[0];

                // Is queued intention still applicable?

                // TO DO

                // This is an hard coded example
                let id = intention.predicate[2];
                let p = parcels.get(id);
                if (p && p.carriedBy) {
                    console.log(
                        'intention is no longer applicable',
                        intention.predicate
                    );
                    continue;
                }

                await intention.achieve();
                this.#intention_queue.shift(); // remove the intention from the queue
            }
            await new Promise((resolve) => setImmediate(resolve)); // wait for the next tick (to avoid blocking the event loop)
        }
    }
}

class IntentionRevisionQueue extends IntentionRevision {
    async push(predicate) {
        // Check if already queued
        if (
            this.intention_queue.find(
                (i) => i.predicate.join(' ') == predicate.join(' ')
            )
        )
            return; // intention is already queued

        console.log('IntentionRevisionReplace.push', predicate);
        const intention = new Intention(this, predicate);
        this.intention_queue.push(intention);
    }
}

// this is the same as IntentionRevisionQueue but it stops the current intention
// when a new intention is queued

// Need to be started as "const myAgent = new IntentionRevisionReplace(); myAgent.loop();"
class IntentionRevisionReplace extends IntentionRevision {
    async push(predicate) {
        // Check if already queued
        const last = this.intention_queue.at(this.intention_queue.length - 1);
        if (last && last.predicate.join(' ') == predicate.join(' ')) {
            return; // intention is already being achieved
        }

        console.log('IntentionRevisionReplace.push', predicate);
        const intention = new Intention(this, predicate);
        this.intention_queue.push(intention);

        // Force current intention stop
        if (last) {
            last.stop();
        }
    }
}
