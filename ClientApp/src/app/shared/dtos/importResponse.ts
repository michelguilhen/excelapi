import { ImportError } from './importError';

export interface ImportResponse {
    success: boolean,
    errors: ImportError[]
}