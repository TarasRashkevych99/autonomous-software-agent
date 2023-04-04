import Agent from './agent/Agent.js';

export default async () => {
    const agent = new Agent();
    await agent.play();
};
