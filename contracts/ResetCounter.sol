pragma solidity ^0.4.23;

contract ResetCounter {
    uint public counter = 0;

    function increment() public {
        counter++;
    }

    function reset() public {
        counter = 0;
    }
}
