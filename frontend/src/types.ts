export interface LogEntry {
    id: number;
    timestamp: string;
    level: string;
    service: string;
    message: string;
    metadata_json?: string;
}

export interface ChatResponse {
    response: string;
}
