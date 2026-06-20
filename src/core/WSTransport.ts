import {EventBus} from './EventBus';

type WSEvent = 'open' | 'close' | 'message' | 'error';

export class WSTransport {
    private socket: WebSocket | null = null;
    private url: string;
    private eventBus: EventBus<WSEvent>;
    private pingInterval: ReturnType<typeof setInterval> | null = null;
    private pingIntervalMs = 5000;

    constructor(url: string) {
        this.url = url;
        this.eventBus = new EventBus<WSEvent>();
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url);

            this.socket.addEventListener('open', () => {
                this.startPing();
                this.eventBus.emit('open');
                resolve();
            });

            this.socket.addEventListener('close', (event) => {
                this.stopPing();
                this.eventBus.emit('close', event);
            });

            this.socket.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.eventBus.emit('message', data);
                } catch {
                    this.eventBus.emit('message', event.data);
                }
            });

            this.socket.addEventListener('error', (error) => {
                this.stopPing();
                this.eventBus.emit('error', error);
                reject(error);
            });
        });
    }

    public send(data: unknown): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }
        this.socket.send(JSON.stringify(data));
    }

    public close(): void {
        this.stopPing();
        this.socket?.close();
        this.socket = null;
    }

    public on(event: WSEvent, callback: (...args: any[]) => void): void {
        this.eventBus.on(event, callback);
    }

    private startPing(): void {
        this.pingInterval = setInterval(() => {
            try {
                this.send({type: 'ping'});
            } catch {
                // ignore ping errors when socket is closed
            }
        }, this.pingIntervalMs);
    }

    private stopPing(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }
}
