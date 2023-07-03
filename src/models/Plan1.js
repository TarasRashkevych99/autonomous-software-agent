import Plan from './Plan';
// importo tutti i metodi da pddlParser.js
import * as pddlParser from '../pddl/PDDLParser.js';
import SingleAgent from '../agents/SingleAgent';

export default class GoPickUp extends Plan {
    isApplicableTo(desire) {
        return desire == 'go_pick_up';
    }

    // async execute({ desire, args }) {
    //     // create PDDL
    //     var goal = pddlParser.goalParser(desire, args, me); // me because I need to know where I am
    //     var plan = await pddlParser.planner(
    //         visibleParcels,
    //         visibleAgents,
    //         map,
    //         goal,
    //         me
    //     );
    //     // execute PDDL
    //     this.executePlan(plan);
    // }

    async execute({ x, y }) {
        await this.subIntention('go_to', { x, y });
        await client.pickup();
    }
}
// TO DO reset the intention when the plan is achieved
