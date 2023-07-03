export default class Intention extends Promise {
    #current_plan; // private field
    #started = false;
    // #stopped = false;
    #desire; // to be achieved
    #args; // arguments of the desire
    #resolve; // resolve function of the promise
    #reject; // reject function of the promise, it is called when no plan is applicable to the desire

    constructor(desire, ...args) {
        var resolve, reject;
        super(async (res, rej) => {
            resolve = res;
            reject = rej;
        });
        this.#resolve = resolve;
        this.#reject = reject;
        this.#desire = desire;
        this.#args = args;
    }
    stop() {
        console.log('stop intention and current plan');
        this.#current_plan.stop();
        //this.#stopped = true;
    }

    //#stopped = false;
    async achieve() {
        // await for a promise
        if (this.#started) return this;
        else this.#started = true;

        for (const plan of plans) {
            if (plan.isApplicableTo(this.#desire)) {
                //look for a plan that is applicable to the desire
                this.#current_plan = plan;
                console.log(
                    'achieving desire',
                    this.#desire,
                    ...this.#args,
                    'with plan',
                    plan
                );
                try {
                    const plan_res = await plan.execute(...this.#args);
                    this.#resolve(plan_res);
                    console.log(
                        'plan',
                        plan,
                        'succesfully achieved intention',
                        this.#desire,
                        ...this.#args,
                        'with result',
                        plan_res
                    );
                    // TO DO : reset the intention when the plan is achieved

                    return plan_res;
                } catch (error) {
                    console.log(
                        'plan',
                        plan,
                        'failed while trying to achieve intention',
                        this.#desire,
                        ...this.#args,
                        'with error',
                        error
                    );
                    this.#current_plan.stop();
                }
            }
        }

        this.#reject();
        console.log(
            'no plan satisfied the desire ',
            this.#desire,
            ...this.#args
        );
        throw 'no plan satisfied the desire ' + this.#desire;
    }
}
