<template>
  <div>
    <el-dialog
      title="定制天气"
      class="customizationWeather"
      width="520px"
      :modal="false"
      :visible.sync="dialogTableVisible"
      :append-to-body="true"
      :modal-append-to-body="true"
    >
      <div slot="footer" class="dialog-footer">
        <div class="customForm">
          <el-select
            v-for=" i in list"
            :key="i.areaId"
            v-model="i.value"
            class=""
            clearable
            filterable
            placeholder="请选择"
            style="margin-bottom:30px;"
            theme-type="default"
            @change="change"
          >
            <div v-for="item in allSubsidiary" :key="item.areaId">
              <el-option
                :key="item.areaId"
                :label="item.subCompanyName"
                :value="item.areaId"
              />
            </div>
          </el-select>
          <div class="submit">
            <el-button class="btn-blue" type="primary" icon="el-icon-plus" @click="add">添加</el-button>
            <el-button class="btn-blue" type="primary" @click="setSave">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllSubsidiary, setConcern } from '@/http/api/mapMess'
export default {
  props: ['off', 'attentionAllList'],
  data() {
    return {
      allSubsidiary: [], // 所有子公司列表
      dialogFormVisible: false,
      dialogTableVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      orderList: [],
      value: '',
      list: [
        {
          value: ''
        }
      ],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      formLabelWidth: '120px'
    }
  },
  watch: {
    'off'() {
      this.dialogTableVisible = true
      this.list = []
      for (let i = 0; i < this.attentionAllList.length; i++) {
        this.orderList.push(this.attentionAllList[i].areaId)
        this.list.push({
          value: this.attentionAllList[i].areaId
        })
        // this.list[i].label = this.attentionAllList[i].subCompanyName
      }
      if (this.list.length < 5) {
        const len = 5 - this.list.length
        for (let i = 0; i < len; i++) {
          this.list.push({})
        }
      }
    }
  },
  created() {
    getAllSubsidiary({}).then((data) => {
      this.allSubsidiary = data.data
    })
  },
  methods: {
    change() {
      this.$forceUpdate()
    },
    setSave() {
      const arr = []
      for (var i = 0; i < this.list.length; i++) {
        for (var j = 0; j < this.allSubsidiary.length; j++) {
          if (this.list[i].value === this.allSubsidiary[j].areaId) {
            // console.log(this.allSubsidiary[j])
            arr.push({
              areaId: this.list[i].value,
              orderNum: '1',
              subcompanyName: this.allSubsidiary[j].subCompanyName
            })
          }
        }
      }
      setConcern(arr).then((data) => {
        if (data.status === 200) {
          this.$emit('setStatus')
          this.dialogTableVisible = false
        }
      })
    },
    add() {
      this.list.push({
        value: ''
      })
    }
  }

}
</script>
<style lang="css">
.customizationWeather .el-dialog__body{
  padding: 5px;
}
/* 重写button */
.el-button--primary.is-active,
.el-button--primary:active {
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  outline: none;
  font-weight: normal;
  background-image: linear-gradient(
    180deg,
    #105FB6 0%,
    #0C4297 100%
  );
  border: 0px solid #fff;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
}

.el-button--primary:focus,
.el-button--primary:hover {
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  outline: none;
  font-weight: normal;
  background-image: linear-gradient(
    180deg,
    #105FB6 100%,
    #0C4297 0%
  );
  border-color: #3f80b9;
}

.el-button--primary {
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  outline: none;
  font-weight: normal;
  background-image: linear-gradient(
    180deg,
    #105FB6 0%,
    #0C4297 100%
  );
  border: 0px solid #fff;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
}
.el-input__inner{
  height: 35px;
  background-color: #00113a;
  border: 1px solid #1a3166;
}
.el-input__inner:hover{
  border: 1px solid #294fa7;
}
</style>
<style lang="css">
.el-dialog__header{
  border:1px solid #e8e8e8;
}
.customForm{
  /* width: 263px; */
  width: 70%;
  height: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.submit{
  /* width: 80%; */
  /* display: flex; */
  /* margin-top: 15px; */
  height: 32px;
  /* flex-direction: row-reverse; */
  /* justify-content:right; */
  /* align-items: center; */
}
</style>
