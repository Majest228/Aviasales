import api from '../services/apiService';
import {formatDate} from '../helpers/date';

class Location {
    constructor(api,helpers) {
        this.api = api;
        this.countries = null;
        this.cities = null;
        this.shortList = {}
        this.airlines = {};
        this.lastSearch = {};
        this.formatDate = helpers.formatDate;
    }
    async init() {
        const response = await Promise.all([
            this.api.countries(),
            this.api.cities(),
            this.api.airlines(),
        ]);
        const [countries,cities,airlines] = response;
        this.countries = this.serializeCountries(countries);
        this.cities = this.serializeCities(cities);
        this.shortListCities = this.createShortCitiesList(this.cities)
        this.airlines = this.serializeAirlines(airlines);
        return response;
    }

    serializeCountries(countries) {
        return countries.reduce((acc,country) => {
            acc[country.code] = country 
            return acc
        }, {})
    }

    createShortCitiesList(cities) {
        return Object.entries(cities).reduce((acc,[,city])=> {
            acc[city.full_name] = null;
            return acc
        }, {})
    }

    serializeCities(cities) {
        return cities.reduce((acc,city) => {
            const country_name = this.countries[city.country_code].name;
            city.name = city.name || city.name_translations.en
            const full_name = `${city.name},${country_name}`
            acc[city.code] = {
                ...city,country_name,full_name,
            }
            return acc
        }, {})
    }

    
    serializeAirlines(airlines) {
        return airlines.reduce((acc,company) => {
            company.logo = `http://pics.avs.io/200/200/${company.code}.png`;
            company.name = company.name || company.name_translations.en;
            acc[company.code] = company;
            return acc;
        }, {})
    }
    getCountryNameByCode(code) {
        return this.countries[code].name
    }

    getCityNameByCode(code) {
        return this.cities[code].name
    }


    getCountryCode(code) {
        return this.cities.filter(city => city.country_code === code)
    }
    getCityCodeByKey(key) {
        const city = Object.values(this.cities).find(item => item.full_name === key);
        return city.code
    } 
    getLogoByCode(code) {
        return this.airlines[code] ? this.airlines[code].logo : "";
    }
    getCompanyNameByCode(code) {
        return this.airlines[code] ? this.airlines[code].name : "";
    }

    async fetchTickets(params) {
        const response = await this.api.prices(params)
        this.lastSearch = this.serializeTickets(response.data)
    }

    serializeTickets(tickets) {
        return Object.values(tickets).map(ticket => {
            return {
                ...ticket,
                origin_name : this.getCityNameByCode(ticket.origin),
                destination_name : this.getCityNameByCode(ticket.destination),
                airleine_logo : this.getLogoByCode(ticket.airline),
                airleine_name : this.getCompanyNameByCode(ticket.airline),
                departure_at : this.formatDate(ticket.departure_at, "dd MMM yyyy hh:mm"),
                return_at : this.formatDate(ticket.return_at, "dd MMM yyyy hh:mm")

            }
        })
    }
}

const location = new Location(api, { formatDate})

export default location;