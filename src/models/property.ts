import { ILocation } from './location';

export interface IProperty {
    id: string;
    name: string;
    description: string;
    rating: string;
    comments: Array<any>;
    active: boolean;
    parent: string;
    location: ILocation;
}