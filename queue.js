import BetterQueue from "better-queue";
import chal from "chalk";

export default class Queue extends BetterQueue {
    _size = 0;

    constructor (taskRunner, options = null) {
        super((data, cb = (err, result) => null) => {
            taskRunner(data)
                .then((result) => {
                    this._size--
                    return cb(null, result)
                })
                .catch((err) => {
                    console.error(`Error from Queue ${this._size} -> ${err.toString()}`)
                    this._size--
                    return cb(error)
                })
        }, options);

        this.on('task_queued', () => this._size++);
    } 

    size() {
        return this._size;
    }
}