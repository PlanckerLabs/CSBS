// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

interface ISoulScore {
    /**
     * @dev Emitted when `recorder` gives the (+)`score` of `events` recorded by `soul`
     */
    event AddScore(
        address indexed recorder,
        address indexed soul,
        bytes8 events,
        uint256 score,
        uint256 finalScore
    );

    /**
     * @dev Emitted when `recorder` gives the (-)`score` of `events` recorded by `soul`
     */
    event SubScore(
        address indexed recorder,
        address indexed soul,
        bytes8 events,
        uint256 score,
        uint256 finalScore
    );

    /**
     * @dev recorder(msg.sender) adds a `score` to `soul` based on event `events`
     */
    function addScore(bytes8 events, address soul, uint256 score) external;

    /**
     * @dev recorder(msg.sender) subtracts a `score` to `soul` based on event `events`
     */
    function subScore(bytes8 events, address soul, uint256 score) external;

    /**
     * @dev Returns the `score`
     */
    function getScore(bytes8 events,address recorder, address soul) external view returns (uint256);

}
