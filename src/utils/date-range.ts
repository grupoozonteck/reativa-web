export interface DefaultDateRange {
    startDate: string;
    endDate: string;
}

function pad(value: number) {
    return String(value).padStart(2, '0');
}

function parseIsoDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    return { year, month, day };
}

function formatIsoDate(year: number, month: number, day: number) {
    return `${year}-${pad(month)}-${pad(day)}`;
}

function clampDay(year: number, month: number, day: number) {
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    return Math.min(day, lastDayOfMonth);
}

export function getCurrentMonthDateRange(
    referenceDate = new Date(),
): DefaultDateRange {
    const currentYear = referenceDate.getFullYear();
    const currentMonth = String(referenceDate.getMonth() + 1).padStart(2, '0');
    const currentDay = String(referenceDate.getDate()).padStart(2, '0');

    return {
        startDate: `${currentYear}-${currentMonth}-01`,
        endDate: `${currentYear}-${currentMonth}-${currentDay}`,
    };
}

export function getPreviousMonthEquivalentRange(
    startDate: string,
    endDate: string,
): DefaultDateRange {
    const start = parseIsoDate(startDate);
    const end = parseIsoDate(endDate);

    const previousStartMonth =
        start.month === 1 ? 12 : start.month - 1;
    const previousStartYear =
        start.month === 1 ? start.year - 1 : start.year;
    const previousEndMonth = end.month === 1 ? 12 : end.month - 1;
    const previousEndYear = end.month === 1 ? end.year - 1 : end.year;

    return {
        startDate: formatIsoDate(
            previousStartYear,
            previousStartMonth,
            clampDay(previousStartYear, previousStartMonth, start.day),
        ),
        endDate: formatIsoDate(
            previousEndYear,
            previousEndMonth,
            clampDay(previousEndYear, previousEndMonth, end.day),
        ),
    };
}
