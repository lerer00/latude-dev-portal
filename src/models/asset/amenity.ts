import { assetAmenityBedTypes } from './types';

export interface IAmenity {
    type: number;
    properties: any;
}

export interface IBedType {

}

export interface IBedAmenity {
    type: assetAmenityBedTypes;
    number: number;
}