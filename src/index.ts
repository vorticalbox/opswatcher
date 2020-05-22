import {
  connect, ChangeStream, MongoClient, MongoClientOptions, Timestamp, MongoError,
} from 'mongodb';
import { EventEmitter } from 'events';

export interface ChangeEvent {
  _id: {
    _data: string
  }
  operationType: string
  clusterTime: Timestamp
  ns: { db: string, coll: string }
  documentKey: { _id: string }
  updateDescription?: { updatedFields: any, removedFields: string[] }
  fullDocument?: any
}
interface Events {
  change: ChangeEvent,
  end: void,
  close: void,
  error: MongoError,
}
interface TypedEventEmitter<T> {
  on<K extends keyof T>(s: K, listener: (v: T[K]) => void): any;
}
interface Watchers {
  [key: string]: EventEmitter
}
export default class OpsWater {
  private uri: string

  private conn: MongoClient

  private stream: ChangeStream

  private startTime: Timestamp

  public watchers: Watchers = {}

  constructor(uri: string, startTime?: Date) {
    this.uri = uri;
    if (startTime) {
      this.startTime = new Timestamp(0, Math.floor(startTime.getTime() / 1000));
    }
  }

  public async connect(options?: MongoClientOptions) {
    this.conn = await connect(this.uri, { useUnifiedTopology: true, ...options });
    return this.conn;
  }

  public addWatcher(collection: string) {
    this.watchers[collection] = new EventEmitter();
    return this.watchers[collection] as TypedEventEmitter<Events>;
  }

  public watch(pipeline?: object[]) {
    this.stream = this.conn.watch(pipeline, {
      ...this.startTime && { startAtOperationTime: this.startTime },
    });
    this.stream.on('change', (event: any) => {
      const doc: ChangeEvent = event;
      const { coll } = doc.ns;
      if (this.watchers[coll]) {
        this.watchers[coll].emit('data', doc);
      }
    });
    this.stream.on('close', () => {
      this.emitToWatchers('close');
    });
    this.stream.on('end', () => {
      this.emitToWatchers('end');
    });
    this.stream.on('error', (error: MongoError) => {
      this.emitToWatchers('error', error);
    });
  }

  private emitToWatchers(action: string, message?: MongoError) {
    Object.values(this.watchers).forEach((watcher) => watcher.emit(action, message));
  }
}
