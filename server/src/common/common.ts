import moment from "moment"

//#region  date to utc formate
export const getUTCDate = (currDate: string | Date = new Date()) => {
    return moment(currDate).utc()
}
//#endregion

//#region generate random id
export const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // Generate a random string of 10 characters
    const randomString = Array.from({ length: 10 },
        () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    return "#" + randomString.substring(0, 10)
}
//#endregion
