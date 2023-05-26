import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { TickectsState } from '../types/types';
import { TicketData } from '../types/chat';

const initialState: TickectsState = {
    openedTicketIsOpen: "",
    closedTicket:"",
    ticketsOpened: [],
    ticketsClosed: []
};

export const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        setOpenedTicket: (state, action:PayloadAction<string>) => {
            state.openedTicketIsOpen = action.payload;
        },
        setClosedTicket: (state, action:PayloadAction<string>) => {
            state.closedTicket = action.payload;
        },
        setOpenedTicketData: (state, action:PayloadAction<Array<TicketData>>) => {
            state.ticketsOpened = action.payload;
        },
        setClosedTicketData: (state, action:PayloadAction<Array<TicketData>>) => {
            state.ticketsClosed = action.payload;
        }

    }
});
export const {setOpenedTicket,setClosedTicket,setOpenedTicketData,setClosedTicketData } = ticketsSlice.actions;
export const getModals = (state: RootState) => state.tickets;
export const getClosedTicketData = (state: RootState) => state.tickets.ticketsClosed;
export const getOpenedTicketData = (state: RootState) => state.tickets.ticketsOpened;