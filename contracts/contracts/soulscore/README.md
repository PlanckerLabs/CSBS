想实现一种公开的基于的链上的数值记录系统
可能的用途：

1. DAO用来链上记录成员贡献值
2. 链上借贷协议记录用户的信用分
... 等等

合约bytecode基于 0.8.15+commit.e14f2714 & 5000 optimize 编译

合约部署基于 EIP-2470 提供的 create2 factory(0xce0042B868300000d44A59004Da54A005ffdcf9f)部署

参数：(_initCode=[SoulScore.bytecode](SoulScore.bytecode),_salt='0x0000000000000000000000000000000000000000000000000000000000000000')

部署后的合约地址为：0x5FefB7641e929BDC0ad17FB9B290AcEA0F34d003
