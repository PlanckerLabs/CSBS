// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CommunitySBT is ERC721URIStorage {
    using Strings for uint256;
    using ECDSA for bytes32;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint _eventId;

    struct CommunityEvent {
        /**
         * community event Owner
         */
        address communityOwner;

        /**
         * community event signer
         */
        address communitySigner;

        /**
         * community event data uri (RFC 3986)
         */
        string eventUri;

        /**
         * prefix for tokenURI
         */
        string baseTokenUri; //每个event是一批NFT，每个NFT都有一个ipfs，为了省钱，ipfs链接是个json文件，是
    }

    uint256 _soulBoundIndex;

    struct SoulBoundData {
        address soul;
        address recorder;
        bytes32 key;
        uint256 value;
    }

    // index => SoulBoundData
    mapping(uint256 => SoulBoundData) private  soulBoundDataRecordMap;

    // soul => SoulBoundData index
    mapping(address => uint256[]) private soulBoundSoulMap;

    // recorder => SoulBoundData index
    mapping(address => uint256[]) private soulBoundRecorderMap;

    /**
     * soul bount data recorded
     */
    event SoulBoundRecorded(
        address indexed soul,
        address indexed recorder,
        bytes4 indexed key,
        uint256 value
    );

    // eventId => CommunityEvent
    mapping(uint256 => CommunityEvent) private communityEventMap;

    // tokenId => eventId 
    mapping(uint256 => uint256) private tokenEventMap;

    // singature => is used
    mapping(bytes32 => bool) private usedSingatureMap;

    // bytes32(address,eventid) => has been awarded
    mapping(bytes32 => bool) private addressAwardedMap;

    constructor(string memory name,string memory symbol) ERC721(name,symbol) {
    }



    // get soulBoundDataRecordMap
    function getSoulBoundDataRecordMap(uint256 index) public view returns (SoulBoundData memory) {
        return soulBoundDataRecordMap[index];
    }

    // get soulBoundSoulMap
    function getSoulBoundSoulMap(address soul) public view returns (uint256[] memory) {
        return soulBoundSoulMap[soul];
    }

    // get soulBoundRecorderMap
    function getSoulBoundRecorderMap(address recorder) public view returns (uint256[] memory) {
        return soulBoundRecorderMap[recorder];
    }

    // get communityEventMap
    function getCommunityEventMap(uint256 index) public view returns (CommunityEvent memory) {
        return communityEventMap[index];
    }

    // get tokenEventMap
    function getTokenEventMap(uint256 tokenId) public view returns (CommunityEvent memory) {
        return communityEventMap[tokenEventMap[tokenId]];
    }

    /**
     * record soul bound data
     */
    function soulBountDataRecord(address soul,bytes4 key,uint256 value) public {
        _soulBountDataRecord(msg.sender,soul,key,value);
    }

    function _soulBountDataRecord(address recorder,address soul,bytes4 key,uint256 value) private {

        soulBoundDataRecordMap[_soulBoundIndex] = SoulBoundData(
            soul,
            recorder,
            key,
            value
        );
        soulBoundSoulMap[soul].push(_soulBoundIndex);
        soulBoundRecorderMap[msg.sender].push(_soulBoundIndex);

        emit SoulBoundRecorded(soul,msg.sender,key,value);

    unchecked {
        _soulBoundIndex += 1;
    }

    }



    modifier onlyCommunitySigner(uint256 eventId) {
        require(communityEventMap[eventId].communitySigner == msg.sender);
        _;
    }
    modifier onlyCommunityOwner(uint256 eventId) {
        require(communityEventMap[eventId].communityOwner == msg.sender);
        _;
    }

    /**
     * add event
     */
    function addEvent(
        address communitySigner,
        string calldata eventUri,
        string calldata baseTokenUri
    ) public returns (uint256) {

        require( address(0) != communitySigner );

    unchecked {
        _eventId += 1;
    }
        communityEventMap[_eventId] = CommunityEvent(msg.sender, communitySigner, eventUri, baseTokenUri);
        
        _soulBountDataRecord(address(this),
                            msg.sender,
                            bytes4(keccak256("addEvent")),
                            _eventId);

        return _eventId;

    }
    //可以根据eventid查到信息
    // 添加事件，每次调用，event与eventId形成一个映射关系，eventId + 1

    /**
     * update event data, only community owner can do this
     */
    function eventUpdate(
        uint eventId,
        string calldata eventUri, 
        string calldata baseTokenUri
    ) public onlyCommunityOwner(eventId) {

        CommunityEvent storage communityEvent = communityEventMap[eventId];
        communityEvent.eventUri = eventUri;
        communityEvent.baseTokenUri = baseTokenUri;

    }

    /**
     * update the community owner and signer of the event
     */
    function eventControllerUpdate(
        uint eventId,
        address newCommunityOwner,
        address newCommunitySigner
    ) public onlyCommunityOwner(eventId){

        require( address(0) != newCommunityOwner && address(0) != newCommunitySigner );
        CommunityEvent storage communityEvent = communityEventMap[eventId];
        communityEvent.communityOwner = newCommunityOwner;
        communityEvent.communitySigner = newCommunitySigner;

    }

    function _Award(address to,uint256 eventId,string calldata tokenUri) private {
        
        bytes32 addressAwardKey = keccak256(abi.encodePacked(to,eventId));
        require(addressAwardedMap[addressAwardKey] == false, "Already awarded");
        addressAwardedMap[addressAwardKey] = true;

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        tokenEventMap[tokenId] = eventId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);

        _soulBountDataRecord(communityEventMap[eventId].communityOwner,
                            to,
                            bytes4(keccak256("Award")),
                            eventId);

    }

    /**
     * communitySigner award token to address[]
     */
    function issuerAwards(
        uint256 eventId,
        address[] calldata toArr,
        string[] calldata tokenUriSuffixArr
    ) public onlyCommunitySigner(eventId) {

        require( toArr.length == tokenUriSuffixArr.length );

        for (uint256 i = 0; i < toArr.length;) {
            _Award(toArr[i], eventId, tokenUriSuffixArr[i]);
        unchecked { 
            i += 1; 
        }
        }

    }

    modifier checkCommunitySign(uint256 eventId,bytes calldata signature,bytes32 packedhash) {

        bytes32 message = packedhash.toEthSignedMessageHash();
        require(message.recover(signature) == communityEventMap[eventId].communitySigner,"wrong signature");

        _;

    }

    /**
     * user claim token with community sign
     */
    function userAwards(
        uint256 eventId,
        string calldata tokenUriSuffix,
        bytes calldata signature
    ) public checkCommunitySign(eventId,signature,
                                keccak256(abi.encodePacked(msg.sender, eventId, tokenUriSuffix))
                                ) {
        
        _Award(msg.sender, eventId, tokenUriSuffix);
    
    }

    /**
     * transfer ownership of the given token with community Sign
     */
    function changeAddress(
        uint256 tokenId,
        uint eventId,
        address newAddress,
        bytes calldata signature
    ) public checkCommunitySign(eventId,signature,
                                keccak256(abi.encodePacked(msg.sender, newAddress, tokenId))
                                ) {

        bytes32 addressAwardKey = keccak256(abi.encodePacked(newAddress,eventId));
        require(addressAwardedMap[addressAwardKey] == false, "Not a individual address");
        addressAwardedMap[addressAwardKey] = true;

        _safeTransfer(msg.sender, newAddress, tokenId, "");

    }


    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {

        string memory baseTokenUri = communityEventMap[tokenEventMap[tokenId]].baseTokenUri;
        return string(abi.encodePacked(
                            baseTokenUri,
                            super.tokenURI(tokenId)
                     ));

    }

    modifier SoulBoundTokenTransferModifier() {
        require(msg.sender == address(0),"SoulBound token cannot be transfered");// ignored "unreachable code" warning
        _;
    }

    /**
     * ban token transfer
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721) SoulBoundTokenTransferModifier {}

    /**
     * ban token transfer
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721) SoulBoundTokenTransferModifier {}

    /**
     * ban token transfer
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override(ERC721) SoulBoundTokenTransferModifier {}

}
