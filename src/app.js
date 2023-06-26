import RandomAgent from './agents/RandomAgent.js';

export default async () => {
    const randomAgent = new RandomAgent();
    await randomAgent.play();
};
