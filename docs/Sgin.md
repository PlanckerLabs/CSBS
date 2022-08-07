签名 以及验证签名部分“



链下生成签名数据
参数：
bigint eventId,
bigint tokenId,
string tokenUri
string signerPrivateKey

生成签名方法：

1.把签名内容打包
  const 请求哈希 = keccak256(pack(eventId，tokenId，tokenUri))；
  实例代码参见：https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/wallet-core-travel/src/utils/UserOp.ts#L119
2.使用私钥执行签名
  const msg1 = Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
    Buffer.from(arrayify(请求哈希))
  ])

  const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(signerPrivateKey)))
  const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s);
  实例代码参见：https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/wallet-core-travel/src/utils/UserOp.ts#L129-L138



=================================

链上检验签名
参数：  uint256 eventId,
       uint256 tokenId,
       string calldata tokenUri,
       bytes calldata signature

检验签名方法：
 1. 把要验签内容打包并求bytes32哈希
	 bytes32 中间哈希值 = keccak256(
	            abi.encodePacked(
	                eventId,
	                tokenId,
	                tokenUri
	            )
	        );

 	bytes32 内容的哈希值 = 中间哈希值.toEthSignedMessageHash();
 实例代码参考1：https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/wallet-core-travel/src/contracts/SimpleWallet.sol#L1293-L1304
 实例代码参考2：https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/wallet-core-travel/src/contracts/EntryPoint.sol#L611


 2. 验证签名
    
    require(
            event.signerAddress == 内容的哈希值.recover(signature),
            "wallet: wrong signature"
        );
   实例参考：https://github.com/proofofsoulprotocol/smart-contract-wallet-4337/blob/main/wallet-core-travel/src/contracts/SimpleWallet.sol#L1463-L1467
