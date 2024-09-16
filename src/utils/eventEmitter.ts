import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

export const EVENT_SESSION_EXPIRED = 'SESSION_EXPIRED';

export default eventEmitter;