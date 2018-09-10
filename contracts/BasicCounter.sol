pragma solidity ^0.4.23;

contract BasicCounter {
    uint public counter = 0;

    function increment() public {
        counter++;
    }
}
