export type CameraLogType = 'error' | 'failure';

export interface CameraLog{
    id:string;
    type:CameraLogType,
    stack:string,
    message:string;
    date:Date;
}
