pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TutorialToken {
    using SafeMath for uint256;
    mapping(address => uint256) internal balances;
    mapping (address => mapping (address => uint256)) internal allowed;
    string public name = "TutorialToken";
    string public symbol = "TTK";
    uint8 public decimals = 0;
    uint256 internal totalSupply_ = 20000;

    event Transfer(
        address from, 
        address to, 
        uint256 value
    );
    
    event Approval(
        address owner,
        address spender,
        uint256 value
    );

    constructor() public {
        balances[msg.sender] = 20000;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
    public
    returns (bool) {
        require(_value <= balances[_from], "Not Enough Balance");
        require(_value <= allowed[_from][msg.sender], "Not Enough Allowance");
        require(_to != address(0), "Invalid Address");

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[msg.sender], "Not Enough Balance");
        require(_to != address(0), "Invalid Address");

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(
        address _owner,
        address _spender
    )
    public
    view
    returns (uint256) {
        return allowed[_owner][_spender];
    }
}