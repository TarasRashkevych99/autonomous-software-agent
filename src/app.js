import SingleAgent from './agents/SingleAgent.js';

export default async () => {
    const singleAgent = new SingleAgent();
    await singleAgent.play();
};
