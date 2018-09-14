pragma solidity ^0.4.23;

contract Company {
    address[] associates;
    address public owner = msg.sender;

    modifier onlyByOwner()
    {
        require(
            msg.sender == owner,
            "Only owner authorized"
        );
        _;
    }

    modifier withAssociates()
    {
        require(
            associates.length > 0,
            "No Associates Yet"
        );
        _;
    }

    function 
        addAssociate(address _associate) 
        public
        onlyByOwner(){
        associates.push(_associate);
    }

    function 
        pay() 
        public 
        withAssociates()
        payable {
        uint fee = msg.value / 100;
        uint quota = (msg.value - fee) / associates.length;

        for (uint i = 0; i < associates.length; i++) {
            associates[i].transfer(quota);
        }

        owner.transfer(fee);
    }
}
