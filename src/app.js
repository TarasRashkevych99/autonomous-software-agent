import RandomAgent from './agent/RandomAgent.js';

export default async () => {
    const randomAgent = new RandomAgent();
    await randomAgent.play();
};
