import { getAutocompleteInstance, getDatePickerInstance } from "../plugins/materialize";

class FormUI {
    constructor(datePickerInstance,autocompleteInstance) {
        this._form = document.forms["formControl"];
        this.origin = document.getElementById('autocomplete-origin')
        this.destination = document.getElementById('autocomplete-destination')
        this.return = document.getElementById('datepicker-return')
        this.depart = document.getElementById('datepicker-depart')
        this.returnDatePickerInstance = getDatePickerInstance(this.return);
        this.departDatePickerInstance = getDatePickerInstance(this.depart);
        this.originAutocompleteInstance = getAutocompleteInstance(this.origin)
        this.destinationAutocompleteInstance = getAutocompleteInstance(this.destination)
    }

    get form() {
        return this._form;
    }

    get originValue() {
        return this.origin.value;
    }

    get destinationValue() {
        return this.destination.value;
    }

    get departValue() {
        return this.depart.value.toString();
    }

    get returnValue() {
        return this.return.value.toString();
    }


    setAutocompleteData(data) {
        this.originAutocompleteInstance.updateData(data);
        this.destinationAutocompleteInstance.updateData(data)
    }
}

const formUI = new FormUI(getDatePickerInstance,getAutocompleteInstance)

export default formUI;