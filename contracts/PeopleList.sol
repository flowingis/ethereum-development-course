pragma solidity ^0.4.23;

contract PeopleList {
    struct Person {
        string name;
        uint birthdate;
        string sex;
    }

    Person[] private list;

    function add(string _name, uint _birthdate, string _sex) public {
        list.push(Person(_name, _birthdate, _sex));
    }

    function getCount() public view returns(uint) {
        return list.length;
    }

    function get(uint index) public view returns(string name, uint birthdate, string sex) {
        Person memory person = list[index];
        return (person.name, person.birthdate, person.sex);
    }

}
