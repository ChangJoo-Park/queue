// Import the queue object.
import Queue from "./mod.ts";

// Create a new queue.
const queue = new Queue();

const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Run stuff…
queue.push(async () => {
	await delay(1000);
	console.log("1");
});
queue.push(async () => {
	console.log("2")
	await delay(1000);
});
queue.push(() => console.log("3"));

// You can even wait for your
// function to be executed in
// the queue.

console.log("Adding 4 to queue.");
const value = await queue.push(() => "hello world");
console.log("4 was executed:", value);
