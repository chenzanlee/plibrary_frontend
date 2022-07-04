--
title: Dialog
--

介绍： 弹框中间件

## 用法：

## 引入
import Dialog from '../dialog';
## 用法
Dialog(options);

## -options详情
    options={
        closeDialog: ()=>{}, //关闭弹窗回调，必须参数
        
        childs: DOM,      //弹窗内容，必须参数

        /* 以下为自定义参数，用于父组件向弹框传递数据，非必须 */
        handleOk: ()=>{},    //自定义事件
        data:{},
        aa: '',
    }
## 传入组件，接收参数
export default {
    props:{
        data = this.$options.data,
        aa = this.$options.aa,
    },
    methods:{
        close(){
            //提交事件
            this._handleOk('传参');
            //关闭事件
            this._close('传参');
            
        }
    }
}
## 上述组件如有不明白请查看使用案例