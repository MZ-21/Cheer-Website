import React from 'react'

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: (index) => {},
    showEventModel: false,
    setShowEventModel: () => {},
    daySelected: null,
    setDaySelected: (day) => {},
    dispatchCallEvent: ({type, payload}) => {},
    savedEvents: [],
    selectedEvent: null,
    setSelectedEvent: () => {},
    labels : [],
    setLabels: () => {},
    updateLabel: () => {},
    filteredEvents: () => {}
})

export default GlobalContext;