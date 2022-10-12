## 背景
+ 本文档记录Genesis团队的系列的例会和结论，以及相关设计开发进展。

## Logs
### 9-4
```
海绵认领了后端excel处理和调用mint任务
周三前会再次沟通，根据jhf提供的0.1版流程，确定方案和分工。
目标是月底前发放SBT给大理大会builder
```
### 9-8
+ [V0.1 prd draft doc](docs/v0.1-draft.md)
+ https://meeting.tencent.com/user-center/shared-record-info?id=e8775f6b-7c4c-468b-8e4d-0eb58b56eb8b&form=-1&click_source_for_middle_login=2
```
快速会议结论：
产品@zik回归，一周一次产品设计沟通，@rulin，作为产品助手加入，设计@Dane加入（瓦猫SBT设计者）
9月底完成代码并发放测试，10月中之前完成发放，10月底之前启动0.2
@amagi需要看下视频和文档，和@eason一起写作开发
```
### 10-11
+ We decide to mint SBT before November!
+ Detail plan:
```
1.create community ok,return URI(json in IPFS)

2.Excel template parser, ok, json

3.create event, ABI invoke, 

4.data assembly: 1. Event abi NFT(SBT) + community json uri+ image (excel json export, image 2)

5.image merge: ok, 	

6.loop 100 times to mint NFT and drop to special(excel json)



B1 --------,-------, upload

B2------,merge image, store to IFPS,URI( + copy community ), link to image

B3----- mint(create even)



##### 1.2简化版Community字段

- community_name: 社区name
- community_seal：社区seal，签名用，生成格式待定，就是一个hash，
- auth_lists:授权签名使用者的列表，默认加入创建人的addr，[addr][777],使用linux的文件权限管理方式，映射表晚点放出+ 来，目前默认有全部权限：777
- commu_lists: 合约会把创建的所有社区，存入此变量，[seal][name]?还是[name][seal],或者都存上？
- 关于社区除管理员外的更多成员的注册，加入，授权，本次不管+

##### 1.3简化版Event字段

- URL,image, event_name, community_name, start_time, end_time
- URL：活动内容（如翻译活动的页面内容），notion，网址等即可
- image：一张有意义或者代表性的图片，2Mb 以内，进入AR+IPFS，Hash上链
- event_name: 活动名称20字
- community_name: 社区名称（registry保存）
- // community_sign: 点选community进入创建，计算的一个hash（community seal+event name+creator addr）
- start_time:开始时间，如果只有开始时间，认为是当天结束，必填
- end_time:结束时间，非必填
- receiver:参与人（接收人），数组list，存储在IPFS，hash存储在此字段+






```
