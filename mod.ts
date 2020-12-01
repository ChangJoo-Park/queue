type Fn<Arguments extends unknown[]> = (...args: Arguments) => any;
type PromiseWrap<X> = X extends Promise<any>
	? X
	: Promise<X>;


export class Queue {

	#_queue: [fn: any, args: any[], resolve: any, reject: any][] = [];
	#_isRunning = false;

	public push<Arguments extends unknown[], Callback extends Fn<Arguments>>(fn: Callback, ...args: Arguments): PromiseWrap<ReturnType<Callback>> {
		return new Promise((resolve, reject) => {
			this.#_queue.push([fn, args, resolve, reject]);
			if (!this.#_isRunning) this._run();
		}) as any;
	}

	private _run(): void {
		if (this.#_isRunning) return;
		this.#_isRunning = true;
		(async () => {
			let value = this.#_queue.shift();
			while (value !== undefined) {
				const [fn, args, resolve, reject] = value;
				try {
					const value = await fn(...args);
					resolve(value);
				} catch (error) {
					reject(error);
				}
				value = this.#_queue.shift();
			}
			this.#_isRunning = false;
		})();
	}

}

export default Queue;
