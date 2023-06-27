import SingleAgent from './agents/SingleAgent.js';

export default async () => {
    const randomAgent = new SingleAgent();
    await randomAgent.play();
};
