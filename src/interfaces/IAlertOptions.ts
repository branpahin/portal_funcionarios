export interface IAlertRole {
    text: string;
    role: string;
}

export interface IAlertAction {
    text: string;
    role?: string; // opcional, por si usas 'cancel', 'destructive', etc.
    handler: (data?: any) => void;
}