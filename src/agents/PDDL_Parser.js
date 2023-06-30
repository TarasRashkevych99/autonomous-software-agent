import fs from 'fs';
import { PddlProblem, Beliefset, onlineSolver } from '@unitn-asa/pddl-client';

const BeliefSet = new Beliefset();

async function readDomain() {
    domain = await new Promise((resolve, reject) => {
        fs.readFile('./singleAgent/domain.pddl', 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

function MapInfoParser() {
    //TO DO
}
function mapParser() {
    //TO DO
}
function parcelParser() {
    //TO DO
}
function agentParser() {
    //TO DO
}
function goalParser() {
    //TO DO
}
function beliefParser() {
    //TO DO
}
function planParser() {
    //TO DO
}

async function planner(parcels, agents, map, goal, you) {
    let beliefs = new Beliefset(); //Set the beliefSet and parse the dynamic objects
    parcelParser(parcels, you, beliefs); //Declare the parcels in the beliefSet
    // in parcelParser dichiaro anche you per dichiarare se è portato o meno (?)
    agentParser(agents, beliefs); //Declare the agents in the beliefSet
    beliefs.declare('at me_' + you.id + ' c_' + you.x + '_' + you.y); //Add the agent position to the beliefSet

    //Create the PDDL problem
    let pddlProblem = new PddlProblem();
    //TO DO

    // see lab5\3beliefset.js !!!!

    //Parse the problem
    let problem = await pddlProblem.parse();
    //Solve the problem
    let plan = await onlineSolver(domain, problem);

    // check if the plan is valid
    if (plan.length === 0) {
        console.log('No plan found');
        return;
    }

    return planParser(plan);
}

export {
    planner,
    mapParser,
    MapInfoParser,
    goalParser,
    beliefParser,
    planParser,
    agentParser,
    parcelParser,
    readDomain,
};
