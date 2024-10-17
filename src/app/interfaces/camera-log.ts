export type CameraLogType = 'scanError' | 'scanFailure' | 'noMediaError' | 'httpError' | 'fetchError' | 'undefinedError';

export interface CameraLog{
    type:CameraLogType,
    message:string;
    date:string;
}

export interface LogsMailContent{
    subject:string,
    body:string
}
