import { monthName } from "./constants/months";
import { clc } from "./constants/calc-date";
import { daysName } from "./constants/days-name";

import { DAYS_IN_WEEK } from "./constants/zaebal";
import { MONTHS_IN_YEAR } from "./constants/zaebal";

// доделать кнопку удалить
// добавить валидацию ввода
// добавить мн выбор
// прикрутить стили

const currentDate = {
    year: new Date().getFullYear(),
    _month: new Date().getMonth(),
    date: new Date().getDate(),

    get month() {
        return this._month;
    },
    set month(num) {
        num > 11 ? this.nextYear() :
        num < 0 ? this.previousYear() :
        this._month = num
    },
    nextYear() {
        this.year += 1;
        this._month = 0;
    },
    previousYear() {
        this.year -= 1
        this._month = 11;
    }
}
//123
///abc
//qwerty

const firstDate = () => {
    return new Date(currentDate.year, currentDate.month, 1);
}
const startsWithDay = () => {
    return firstDate().getDay() === 0 ? 7 : firstDate().getDay();
}
const firstCell = () => {
    return (firstDate() - (startsWithDay() - 1) * clc.day);
}

const header = document.createElement('header');
const main = document.createElement('main');

const storeDays = [];
const storeWeek = [];
const storeMonths = [];
const storeYears = [];
const selectedDates = []
const storeNotesByDates = {}

const createDates = (storeDates, amountOfWeeks = 1) => {
    for (let cell = firstCell(); 
         storeDates.length < DAYS_IN_WEEK * amountOfWeeks; 
         cell += clc.day) {
        const day = document.createElement('div');
        day.date = new Date(cell)
        storeDates.push(day);
    }
}

const styleCells = (storeDates, className) => {
    storeDates.forEach(day => {
        day.classList.add(className, 'clearable');
    });
}

const createMonths = () => {
    for (let cellIndex = 0; storeMonths.length < MONTHS_IN_YEAR; cellIndex++) {
        const month = document.createElement('div');
        month.index = cellIndex
        storeMonths.push(month);
    }
}

const createYears = () => {
    let index = Math.floor(currentDate.year / 10) * 10
    for (let cellIndex = 0; storeYears.length < 10; cellIndex++) {
        const year = document.createElement('div');
        year.index = index + cellIndex
        storeYears.push(year);
    }
}

const setupDates = () => {
    storeDays.forEach(day => {
        day.isCurrentMonth = currentDate.month === day.date.getMonth();
        if (day.date < firstDate()) day.addEventListener('click', funcPrevMonth)
        if (day.date > firstDate() && !day.isCurrentMonth) day.addEventListener('click', funcNextMonth)
        if (day.isCurrentMonth) day.addEventListener('click', funcSelect)
        
        day.isWeekend = 
        day.date.getDay() === 6 || day.date.getDay() === 0;
        
        for (const key in day) {
            if (!Object.hasOwn(day, key) || key === 'date') continue;
            day.setAttribute(key, day[key]);
            day.textContent = day.date.getDate();
        }
    });
}

const setupMonths = () => {
    storeMonths.forEach(month => {
        month.addEventListener('click', () => {
            clearCalendar();
            currentDate.month = month.index;
            renderSelectedMonth();
        });
        month.textContent = (monthName[month.index]);
    })
}

const setupYears = () => {
    storeYears.forEach(year => {
        year.addEventListener('click', () => {
            clearCalendar();
            currentDate.year = year.index;
            renderSelectedYear();
        });
        year.textContent = year.index;
    })
}

const datesCallback = () => {
    createDates(storeDays, 6);
    setupDates();
    styleCells(storeDays, 'calendar-base');
    return storeDays;
}

const monthsCallback = () => {
    createMonths();
    setupMonths();
    styleCells(storeMonths, 'month-of-year');
    return storeMonths;
}

const yearsCallback = () => {
    createYears();
    setupYears();
    styleCells(storeYears, 'year');
    return storeYears;
}

const buildDates = callback => {
    const main = document.createElement('main');
    main.classList.add('cell-container');
    callback().forEach(elem => {
        main.appendChild(elem);
    });
    return main;
}

const renderSelectedMonth = () => {
    clearCalendar();
    main.appendChild(createHeaderMonth());
    main.appendChild(createWeek());
    main.appendChild(buildDates(datesCallback));
    document.body.appendChild(main);
}

const renderSelectedYear = () => {    
    clearCalendar();
    main.appendChild(createHeaderYear());
    main.appendChild(buildDates(monthsCallback));
    document.body.appendChild(main);
}

const renderSelectedDecade = () => {    
    clearCalendar();
    main.appendChild(createHeaderDecade());
    main.appendChild(buildDates(yearsCallback));
    document.body.appendChild(main);
}

const clearCalendar = () => {
    storeDays.splice(0, );
    storeWeek.splice(0, );
    storeMonths.splice(0, );
    storeYears.splice(0, );
    document.querySelectorAll('.clearable').
    forEach(elem => elem.remove());
}

const createButton = (textContent, callback) => {
    const button = document.createElement('button');
    button.classList.add('btn-switch', 'clearable');
    button.textContent = textContent;
    button.addEventListener('click', callback);
    return button
}

const funcNextMonth = () => {
    currentDate.month++;
    renderSelectedMonth();
}
const funcPrevMonth = () => {
    currentDate.month--;
    renderSelectedMonth();
}
const funcPrevYear = () => {
    currentDate.year--;
    renderSelectedYear();
}
const funcNextYear = () => {
    currentDate.year++;
    renderSelectedYear();
}
const funcNextDecade = () => {
    currentDate.year += 10;
    renderSelectedDecade();
}
const funcPrevDecade = () => {
    currentDate.year -= 10;
    renderSelectedDecade();
}


const createHeaderMonth = (title = monthName[currentDate.month] + ', ' + currentDate.year) => {
    const headerTitle = document.createElement('div');
    headerTitle.classList.add('clearable')
    headerTitle.textContent = (title);
    headerTitle.addEventListener('click', renderSelectedYear)

    const btnPrevMonth = createButton('<', funcPrevMonth)
    const btnNextMonth = createButton('>', funcNextMonth)

    header.appendChild(btnPrevMonth);
    header.appendChild(headerTitle);
    header.appendChild(btnNextMonth);
    return header
}

const createHeaderYear = (title = currentDate.year) => {
    const headerTitle = document.createElement('div');
    headerTitle.classList.add('clearable')
    headerTitle.textContent = (title);
    headerTitle.addEventListener('click', renderSelectedDecade)

    const btnPrevMonth = createButton('<<', funcPrevYear)
    const btnNextMonth = createButton('>>', funcNextYear)

    header.appendChild(btnPrevMonth);
    header.appendChild(headerTitle);
    header.appendChild(btnNextMonth);
    return header
}

const createHeaderDecade = (title = Math.floor(currentDate.year / 10) * 10
                            + ' - ' + Number(Math.floor(currentDate.year / 10) * 10 + 9)) => {
    const headerTitle = document.createElement('div');
    headerTitle.classList.add('clearable')
    headerTitle.textContent = (title);

    const btnPrevMonth = createButton('<<<', funcPrevDecade)
    const btnNextMonth = createButton('>>>', funcNextDecade)

    header.appendChild(btnPrevMonth);
    header.appendChild(headerTitle);
    header.appendChild(btnNextMonth);
    return header
}

const createWeek = () => {
    const week = document.createElement('div');
    week.classList.add('cell-container')
    for (let cell = firstCell(); storeWeek.length < DAYS_IN_WEEK; cell += clc.day) {
        const day = document.createElement('div');
        day.textContent = daysName[new Date(cell).getDay()];
        day.classList.add('clearable', 'day-of-week');
        storeWeek.push(day);
    }
    storeWeek.forEach(elem => week.appendChild(elem));
    return week;
}

const funcSelect = event => {
    let item
    if (event?.target) item = event.target
        else item = event
    if (selectedDates.includes(item)) {
        clearSelect()
        return
    }
    clearSelect()
    selectedDates.push(item)
    selectedDates.forEach(elem => elem.classList.add('selected-cell'))
    currentDate.date = item.date.getDate()
    createNote(item.date);
}

const createNote = date => {
    const note = document.createElement('main')
    const input = document.createElement('textarea')
    const applyBtn = document.createElement('button')
    const deleteBtn = document.createElement('button')

    note.classList.add('cell-container', 'note-body', 'clearable')
    applyBtn.classList.add('btn-switch')
    deleteBtn.classList.add('btn-switch')
    applyBtn.textContent = 'ok'
    deleteBtn.textContent = 'del'

    input.classList.add('note-input')
    input.addEventListener('keydown', event => noteAction(event, note, input, date)) //можно ли попроще?
    applyBtn.addEventListener('click', event => noteAction(event, note, input, date)) //можно ли попроще?
    deleteBtn.addEventListener('click', () => deleteNote(date))
    
    note.appendChild(input)
    note.appendChild(applyBtn)
    note.appendChild(deleteBtn)
    storeNotesByDates[date]?.forEach(elem => note.appendChild(elem))
    document.body.appendChild(note)
}

const noteAction = (event, note, input, date) => {
    if (event.key === 'Enter' && event.ctrlKey || event.type === 'click') {
        if(!input.value) return
        
        if (!storeNotesByDates[date]) storeNotesByDates[date] = []
        const textOutput = document.createElement('textarea')
        textOutput.classList.add('note-output')
        textOutput.textContent = input.value
        storeNotesByDates[date].push(textOutput)
        
        input.value = ''
        note.appendChild(textOutput)
    }
}

const deleteNote = date => {
    if (!storeNotesByDates[date]) return
    document.querySelectorAll('.note-output').forEach(elem => elem.remove())
    console.log(storeNotesByDates)
    storeNotesByDates[date].splice(0, )
    console.log(storeNotesByDates)
}

const clearSelect = () => {
    selectedDates.forEach(elem => elem.classList.remove('selected-cell'))
    selectedDates.splice(0, )
    document.querySelector('.note-body')?.remove()
}

const renderFromInput = event => {
    if (event.key != 'Enter') return
    const inputDate = input.value.split('.')
    currentDate.date = Number(inputDate[0])
    currentDate.month = Number(inputDate[1] - 1)
    currentDate.year = Number(inputDate[2])
    renderSelectedMonth();
}

const input = document.createElement('input')
input.addEventListener('keydown', renderFromInput)
main.appendChild(input)

renderSelectedMonth();
funcSelect(storeDays.find(day => day.date.getDate() === currentDate.date))