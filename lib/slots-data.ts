import type {Slot} from './types';

// TODO: согласовать с тренером перед продом — НЕ выдумывать «свободно».
// На MVP допустимы ТОЛЬКО реально открытые окна (SPEC §9.4).
export const SLOTS: Slot[] = [
    {
        id: 'tue-19',
        day: 'Вторник',
        time: '19:00',
        label: 'Персональная · 60 мин · зал у дома',
        status: 'free',
        walkMinutes: 4,
    },
    {
        id: 'wed-08',
        day: 'Среда',
        time: '08:00',
        label: 'Персональная · 60 мин · зал у дома',
        status: 'free',
        walkMinutes: 4,
        profileHint: 'energy',
    },
    {
        id: 'thu-19',
        day: 'Четверг',
        time: '19:00',
        label: 'Персональная · 60 мин · зал у дома',
        status: 'free',
        walkMinutes: 4,
        profileHint: 'health',
    },
    {
        id: 'sat-10',
        day: 'Суббота',
        time: '10:00',
        label: 'Парная · 60 мин · зал у дома',
        status: 'free',
        walkMinutes: 4,
        profileHint: 'body',
    },
    {
        id: 'sun-11',
        day: 'Воскресенье',
        time: '11:00',
        label: 'Персональная · 60 мин · зал у дома',
        status: 'free',
        walkMinutes: 4,
    },
];
