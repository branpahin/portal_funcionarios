export interface IAlertRole {
    text: string;
    role: string;
}

export interface IAlertAction {
    text: string;
    handler: () => void
}