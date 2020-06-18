import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class FormInputToDateService {

    convertISOStringToDate(ISOString: string, delimiter: string): Date {
        let dateComponents = ISOString.split(delimiter);
        return new Date(
            +dateComponents[0],
            //Date constructor uses zero based month value
            (+dateComponents[1] - 1),
            +dateComponents[2]
        );
    }

    clearTimeFromDate(dateTime: Date): Date {
        return new Date(
            +dateTime.getFullYear(),
            +dateTime.getMonth(),
            +dateTime.getDate()
        );
    }
}