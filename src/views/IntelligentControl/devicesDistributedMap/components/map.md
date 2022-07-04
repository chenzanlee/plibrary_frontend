## 地图代码逻辑梳理
 ### 文件梳理  
   ###### myChina.json
   主要参数
  > properties.name (地区名称)  
  > properties.regionId  (地区id)  
  > geometry.coordinates  (单独区域地图轮廓---可修改)  
  附：地图轮廓获取地址  
        http://geojson.io/#map=2/20.0/0.0 (获取json)   
        http://datav.aliyun.com/tools/atlas/#&lat=31.80289258670676&lng=104.2822265625&zoom=4 (可自行通过打点获取某一个区域的轮廓数据)  
    
  ###### mapData.json
   主要参数
   >region (省、市、大区)  
   >area (第二级区域)
   >areaParent (一级区域和二级区域的对应关系)
  ###### mock.json（权限json---等同于后台返回的权限json）
   主要参数
   >parentId (父级区域id--为-1则当前区域为第一级区域)  
   >regionNum (当前区域id--必须与chinaMap下的regionId统一)  
   >regionName (区域名称)  
   >children (子级区域结构同上)
  ###### chinaMapData.json(全国地图展示数据信息 --- 等同于后台请求的数据json)  
主要参数
   >distributeStats(数组)  
   {  
        "totalNum": 20,     
        "bindedNum": 20,    
        "onlineNum": 4,     
        "offlineNum": 16,   
        "troubleNum": 13,   
        "warnNum": 13,      
        "areaCode": "-11",  
        "areaName": "牧原总部",
        "parentId": "-1"  
    }    
    {  
        总数  
        绑定数(页面显示的总数均为绑定数)  
        在线数  
        离线数  
        故障数  
        报警数  
        区域id  
        区域名称  
        父级区域id  
    }
    
### 绘制逻辑
   * 1 从权限json(mock.json)中取出regionId(大区id)、areaId(场区id)、filed三个数组  
   * 2 从数据json中取出需要绘制的数据(即mapChineseData.json中的distributeStats)  
   * 3 注册地图时使用自己定义的myChina.json
   * 4 绘制地图两个函数 drawChina(绘制中国地图)  drawChart(绘制区域以及场区地图)  
    

    option:[{
        name:'绘制区域名称',
        value:'根据数据分规则显示---第三模块详解'
        data:{
                totalNumber:''，
                ...
                弹框显示信息
            }
        },
        regionId:'大区id',//一定条件下可以为空
        areaId:'区域id',//一定条件下可以为空
        parentName:'父级区域名称',
    ]}
    
 * 5 场区一级多散点图配置，配置见：option.geo

### 规则判断划分逻辑
   * 1 判断当前区域是否在regionId或者areaId中（判断权限）如果在将warnNum设置为value，如果不在value为-1
   * 2 在及逆行显示的时候二次判断  
       
    if(存在filed){  
        if(当前fieID在权限列表region中存在){
              展示信息
        }else{
            if(当前数据有id){//此id为regionNum
                return '暂无权限'
            }else{
                return '暂无业务'
            }
            
        }
        
    }else if(存在areaId){
        if(当前areaId在二级权限areaId列表中){
            展示信息
        }else{
            if(当前数据有id){
                return '暂无权限'
            }else{
                return '暂无业务'
            }
        }
    }else if(存在fieldId){
        if(当前fieldId在二级权限field列表中){
            展示信息
        }else{
            return "暂无权限"
        }
    }  
* 3 区域色值根据value值进行区分  
   主要参数option.visualMap.pieces

