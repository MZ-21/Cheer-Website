import dayjs from 'dayjs';


export function getMonth(month = dayjs().month()){
    month = Math.floor(month);
    const year = dayjs().year();//represents current year
    const firstDayOfMonth = dayjs(new Date(year, month, 1)).day();//represents first day of the month (mon-sun)
    let currentMonthCount = 0 - firstDayOfMonth;
    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(()=>{
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        })
    });//5 rows, 7 coloumns
    return daysMatrix;
}