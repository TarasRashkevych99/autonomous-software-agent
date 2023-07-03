import SingleAgent from '../agents/SingleAgent';

export default class Plan extends SingleAgent {
    #sub_intentions = [];
    stop() {
        console.log('stop plan and all sub intentions');
        for (const intention of this.#sub_intentions) {
            //stop all sub intentions
            intention.stop();
        }
    }
    async subIntention(desire, ...args) {
        const sub_intention = new Intention(desire, ...args);
        this.#sub_intentions.push(sub_intention);
        return await sub_intention.achieve();
    }

    // TO DO : add a method to manage sub intentions
    async executePlan(plan) {}
}
