pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract TutorialToken is StandardToken {
    string public name = "TutorialToken";
    string public symbol = "TTK";
    uint8 public decimals = 0;
    uint public INITIAL_SUPPLY = 20000000000;

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}