import { SummaryType } from "../common/constant";

export interface UpdateSummary {
    userId: string | Object;
    summary: string;
    type: SummaryType
}

export interface CustomError {
    error: string;
    statusCode: number;
    valid: boolean;
}
