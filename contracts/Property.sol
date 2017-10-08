pragma solidity ^0.4.13;

contract Property {
    string Name;
    string Country;
    string City;

    function Property(string name, string country, string city) payable {
        Name = name;
        Country = country;
        City = city;
    }

    function getPartial() constant returns (string, string, string){
        return(Name, Country, City);
    }

    function getName() constant returns (string) {
        return Name;
    }

    function getCountry() constant returns (string) {
        return Country;
    }

    function getCity() constant returns (string) {
        return City;
    }

    function getBalance() constant returns(uint) {
        return this.balance;
    }
}