import '../css/style.css';
import './plugins'
import location from './store/locations';
import formUI from './views/form';
import currencyUI from './views/currence';
import ticketsUI from './views/tickets';



document.addEventListener("DOMContentLoaded", () => {
    initApp();

    const form = formUI.form;

    form.addEventListener("submit" , (e) => {
        e.preventDefault();
        onFormSubmit();
    })

    async function initApp() {
        await location.init();
        formUI.setAutocompleteData(location.shortListCities)
    }

    async function onFormSubmit() {
        const origin = location.getCityCodeByKey(formUI.originValue),
              destination = location.getCityCodeByKey(formUI.destinationValue) ,
              return_date = formUI.returnValue,
              depart_date = formUI.departValue,
              currency = currencyUI.currencyValue;
        
              await location.fetchTickets({
                  origin,destination,return_date,depart_date,currency
              })

              console.log(location.lastSearch)
              ticketsUI.renderTickets(location.lastSearch)
    }
})