import { IAmenityAccessibility } from './amenity/amenityAccessibility';
import { IAmenityComputers } from './amenity/amenityComputers';
import { IAmenityConferenceVenues } from './amenity/amenityConferenceVenues';
import { IAmenityLibrary } from './amenity/amenityLibrary';
import { IAmenityLockers } from './amenity/amenityLockers';
import { IAmenityPet } from './amenity/amenityPet';
import { IAmenityRestaurants } from './amenity/amenityRestaurants';
import { IAmenitySmoking } from './amenity/amenitySmoking';
import { IAmenityWifi } from './amenity/amenityWifi';

export interface IAmenities {
    accessibility: IAmenityAccessibility;
    computers: IAmenityComputers;
    conferenceVenues: IAmenityConferenceVenues;
    library: IAmenityLibrary;
    lockers: IAmenityLockers;
    pet: IAmenityPet;
    restaurants: IAmenityRestaurants;
    smoking: IAmenitySmoking;
    wifi: IAmenityWifi;
}