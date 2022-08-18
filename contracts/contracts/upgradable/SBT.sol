// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SBTStorage {
    CountersUpgradeable.Counter internal _tokenIdCounter;

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
        string baseTokenUri; //每个event是一批NFT，每个NFT都有一个ipfs，为了省钱，ipfs链接是个json文件
    }

    // receiver => tokenId list
    mapping(address => uint256[]) public ownSBTs;

    // eventId => tokenId list
    mapping(uint256 => uint256[]) public containSBTs;

    /**
     * soul bound data recorded
     */
    event issuedSBT(
        uint256 indexed tokenId,
        address indexed receiver,
        address indexed issuer,
        uint256 eventId
    );

    // eventId => CommunityEvent
    mapping(uint256 => CommunityEvent) public communityEventMap;

    // tokenId => eventId 
    mapping(uint256 => uint256) public tokenEventMap;

    // singature => is used
    mapping(bytes32 => bool) public usedSingatureMap;

    // bytes32(address,eventid) => has been awarded
    mapping(bytes32 => bool) public addressAwardedMap;
}


contract SBT is SBTStorage, ERC721URIStorageUpgradeable, OwnableUpgradeable {
    using StringsUpgradeable for uint256;
    using ECDSAUpgradeable for bytes32;
    using CountersUpgradeable for CountersUpgradeable.Counter;


    function callInitFuncData(string memory name_,string memory symbol_)public pure returns(bytes memory){
         return abi.encodeWithSignature("initialize(string,string)", name_,symbol_);
    }

    function initialize(string memory name_,string memory symbol_) public initializer {
        __ERC721_init(name_, symbol_);
        __Ownable_init();
    }

    // get tokenEventMap
    function getCommunityEventByTokenId(uint256 tokenId) public view returns (CommunityEvent memory) {
        return communityEventMap[tokenEventMap[tokenId]];
    }

    /**
     * record soul bound data
     */
    function issueSBT(address community, address reveiver,uint256 eventId) public returns(uint256){
        return _issueSBT(community,reveiver,eventId);
    }

    function _issueSBT(address community, address receiver, uint256 eventId) private returns(uint256){

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        ownSBTs[receiver].push(tokenId);
        containSBTs[eventId].push(tokenId);
        _safeMint(receiver, tokenId);

        emit issuedSBT(tokenId,community,receiver,eventId);

        return tokenId;

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
    function createEvent(
        address communityOwner,
        address communitySigner,
        string calldata eventUri,
        string calldata baseTokenUri
    ) public onlyOwner returns (uint256) {

        require( address(0) != communitySigner && address(0) != communityOwner);

        uint256 eventId = _eventId;

        unchecked {
            eventId += 1;
        }
        communityEventMap[eventId] = CommunityEvent(communityOwner, communitySigner, eventUri, baseTokenUri);

        _eventId = eventId;
        
        return eventId;

    }

    /**
     * update event data, only community owner can do this
     */
    function updateEvent(
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
    function transferEventController(
        uint eventId,
        address newCommunityOwner,
        address newCommunitySigner
    ) public onlyCommunityOwner(eventId){

        require( address(0) != newCommunityOwner && address(0) != newCommunitySigner ,"community controller can not be zero-address");
        CommunityEvent storage communityEvent = communityEventMap[eventId];
        communityEvent.communityOwner = newCommunityOwner;
        communityEvent.communitySigner = newCommunitySigner;

    }

    function _issueSBTWithEvent(address community,address to,uint256 eventId,string calldata tokenUri) private {
        
        bytes32 addressAwardKey = keccak256(abi.encodePacked(to,eventId));
        require(addressAwardedMap[addressAwardKey] == false, "Already issued");
        addressAwardedMap[addressAwardKey] = true;

        
        uint256 tokenId = _issueSBT(
                            community,
                            to,
                            eventId
                        );
        tokenEventMap[tokenId] = eventId;
        _setTokenURI(tokenId, tokenUri);

    }

    /**
     * communitySigner award token to address[]
     */
    function issueBatchSBTWithEvent(
        uint256 eventId,
        address[] calldata toArr,
        string[] calldata tokenUriSuffixArr
    ) public onlyCommunitySigner(eventId) {

        require( toArr.length == tokenUriSuffixArr.length );
        address communityOwner = communityEventMap[eventId].communityOwner;
        for (uint256 i = 0; i < toArr.length;) {
            _issueSBTWithEvent(communityOwner, toArr[i], eventId, tokenUriSuffixArr[i]);
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
    function issueSBTWithEvent(
        uint256 eventId,
        string calldata tokenUriSuffix,
        bytes calldata signature
    ) public checkCommunitySign(eventId,signature,
                                keccak256(abi.encodePacked(msg.sender, eventId, tokenUriSuffix))
                                ) {
        _issueSBTWithEvent(communityEventMap[eventId].communityOwner, msg.sender, eventId, tokenUriSuffix);
    
    }

    /**
     * transfer ownership of the given token with community Sign
     */
    function transferSBT(
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
        override(ERC721URIStorageUpgradeable)
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

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override{
        super._transfer(from,to,tokenId);
        uint256[] memory tokenIdList = ownSBTs[from];
        uint256 tokenIdIndex;
        for (tokenIdIndex =0;tokenIdIndex<tokenIdList.length;tokenIdIndex++){
            if (tokenIdList[tokenIdIndex] == tokenId){
                break;
            }
        }
        
        // remove the tokenId according to the tokenIdIndex
        ownSBTs[from][tokenIdIndex] = ownSBTs[from][tokenIdList.length-1];
        ownSBTs[from].pop();
    }

    /**
     * ban token transfer
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721Upgradeable) SoulBoundTokenTransferModifier {}

    /**
     * ban token transfer
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721Upgradeable) SoulBoundTokenTransferModifier {}

    /**
     * ban token transfer
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override(ERC721Upgradeable) SoulBoundTokenTransferModifier {}

}
