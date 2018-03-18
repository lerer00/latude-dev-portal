import { IAsset } from './asset';

export interface IAsset {
    id: string;
    name: string;
    description: string;
    active: boolean;
    parent: string;
    staysMap: any;
    stays: Array<any>;
    price: number;
    currency: string;
}