pragma solidity ^0.4.23;

contract SecureCounter {
    uint public counter = 0;
    address public owner = msg.sender;

    modifier onlyByOwner()
    {
        require(
            msg.sender == owner,
            "Only owner authorized "
        );
        _;
    }

    function increment() public {
        counter++;
    }

    function 
        reset() 
        public 
        onlyByOwner() {
        counter = 0;
    }
}
