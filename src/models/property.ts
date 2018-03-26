import { ILocation } from './location';
import { IAmenities } from './amenities/amenities';

export interface IProperty {
    id: string;
    name: string;
    description: string;
    rating: number;
    comments: Array<any>;
    amenities: IAmenities;
    active: boolean;
    parent: string;
    location: ILocation;
    images: Array<any>;
}