pragma solidity ^0.4.23;

contract Poll {
    int private constant FAVORABLE_VOTE = 1;
    int private constant NOT_FAVORABLE_VOTE = -1;

    enum Result { 
        Draw, 
        Favorable,
        NotFavorable
    }

    address public owner = msg.sender;
    bool public started = false;
    int private voteCount = 0;
    mapping(address => int) private votes;

    modifier onlyByOwner()
    {
        require(
            msg.sender == owner,
            "Only owner authorized"
        );
        _;
    }

    modifier whenStarted()
    {
        require(
            started,
            "Poll Not Started"
        );
        _;
    }

    modifier whenStopped()
    {
        require(
            !started,
            "Poll Not Started"
        );
        _;
    }

    function 
        start() 
        public
        onlyByOwner()
        whenStopped() {
        started = true;
    }

    function 
        stop()
        public
        onlyByOwner()
        whenStarted() {
        started = false;
    }

    function 
        vote(bool favorable) 
        public
        whenStarted() {
        if (started && votes[msg.sender] == 0) {
            int voteValue = favorable ? FAVORABLE_VOTE : NOT_FAVORABLE_VOTE;
            votes[msg.sender] = voteValue;
            voteCount += voteValue;
        }
    }

    function 
        result() 
        public
        view
        whenStopped()
        returns (Result) {
        if (voteCount == 0) {
            return Result.Draw;
        }

        if (voteCount > 0) {
            return Result.Favorable;
        }

        return Result.NotFavorable;
    }
}