// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./ISoulScore.sol";

contract SoulScore is ISoulScore {

    mapping(bytes32 => uint256) private _score;

    function _getKey(bytes8 events, address recorder, address soul) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(recorder, soul, events));
    }

    /**
     * @dev recorder(msg.sender) adds a `score` to `soul` based on event `events`
     */
    function addScore(bytes8 events, address soul, uint256 score) override external {
        bytes32 key = _getKey(events, msg.sender, soul);
        uint256 value = _score[key];
        uint256 finalScore = value + score;
        _score[key] = finalScore;
        emit AddScore(msg.sender, soul, events, score, finalScore);
    }

    /**
     * @dev recorder(msg.sender) subtracts a `score` to `soul` based on event `events`
     */
    function subScore(bytes8 events, address soul, uint256 score) override external {
        bytes32 key = _getKey(events, msg.sender, soul);
        uint256 value = _score[key];
        uint256 finalScore = value - score;
        _score[key] = finalScore;
        emit SubScore(msg.sender, soul, events, score, finalScore);
    }

    /**
     * @dev Returns the `score`
     */
    function getScore(bytes8 events, address recorder, address soul) override external view returns (uint256) {
        return _score[_getKey(events, recorder, soul)];
    }
}
