import moment from "moment"

//#region  date to utc formate
export const getUTCDate = (currDate: string | Date = new Date()) => {
    return moment(currDate).utc()
}
//#endregion