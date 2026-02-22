export const clc = {
    sec: 1000,
    get min() {
        return this.sec * 60;
    },
    get hour() {
        return this.min * 60;
    },
    get day() {
        return this.hour * 24;
    },
}