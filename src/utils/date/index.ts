import { subHours, format } from 'date-fns';

export const getPreviousHourInUTC = (hoursToSubtract=1)=>{

    const prevHour = subHours(new Date(), hoursToSubtract);

    const prevHourInUtc = new Date(
        prevHour.getUTCFullYear(),
        prevHour.getUTCMonth(),
        prevHour.getUTCDate(),
        prevHour.getUTCHours(),
        prevHour.getUTCMinutes(),
        prevHour.getUTCSeconds(),
    );

    const prevHourInUtcFormatted = format(prevHourInUtc, 'yyyy-MM-dd HH:mm:ss');

    return prevHourInUtcFormatted;
};