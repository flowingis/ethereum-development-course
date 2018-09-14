pragma solidity ^0.4.23;

contract LoggableCounter {
    uint public counter = 0;
    address public owner = msg.sender;

    event Increment(uint value);
    event Reset();

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
        emit Increment(counter);
    }

    function 
        reset() 
        public 
        onlyByOwner() {
        counter = 0;
        emit Reset();
    }
}
