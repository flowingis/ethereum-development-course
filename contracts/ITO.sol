pragma solidity ^0.4.23;

import "./TutorialToken.sol";

contract ITO {
    TutorialToken token;
    address[] private bakers;
    address public owner = msg.sender;
    address public tokenAddress;
    bool public started = false;
    bool public stopped = false;

    event Purchase();

    modifier onlyByOwner()
    {
        require(
            msg.sender == owner,
            "Only owner authorized "
        );
        _;
    }

    modifier onlyWhenStarted()
    {
        require(
            started && !stopped,
            "ITO not active"
        );
        _;
    }

    constructor(address _address) public {
        token = TutorialToken(_address);
        tokenAddress = _address;
    }

    function start() public onlyByOwner(){
        started = true;
    }

    function stop() public onlyByOwner(){
        stopped = true;
    }

    function getBakersCount() public view returns(uint) {
        return bakers.length;
    }

    function getBaker(uint _index) public view returns(address) {
        return bakers[_index];
    }

    function getRatio() public view returns(uint) {
        uint remaining = token.balanceOf(this);
        uint ONE_ETHER = 10**18;
        if(remaining <= 1000){
            return ONE_ETHER;
        }

        if(remaining <= 10000){
            return ONE_ETHER / 10;
        }

        if(remaining <= 19000){
            return ONE_ETHER / 100;
        }

        return ONE_ETHER / 1000;
    }

    function 
        purchase() 
        public 
        payable 
        onlyWhenStarted()
        returns(bool success) {

        address receiver = msg.sender;

        uint tokens = msg.value / getRatio();
        
        success = token.transfer(receiver, tokens);
        require(success, "Token not trasfered");

        bakers.push(msg.sender);

        emit Purchase();
    }
}
