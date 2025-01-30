<template>
  <div id="PictureManagePage">
    <!--搜索表单-->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="类型" name="category">
        <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          placeholder="请输入标签"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="审核状态" name="reviewStatus">
        <a-select
          v-model:value="searchParams.reviewStatus"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          placeholder="请输入审核状态"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <div style="margin-bottom: 16px"></div>
    <!--表格-->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'id'">
          {{record.id}}
        </template>
        <template v-if="column.dataIndex === 'name'">
          {{record.name}}
        </template>
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="120" />
        </template>
        <template v-if="column.dataIndex === 'introduction'">
          {{record.introduction}}
        </template>
        <template v-if="column.dataIndex === 'category'">
          {{record.category}}
        </template>
        <!-- 标签 -->
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
          </a-space>
        </template>
        <!-- 图片信息 -->
        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
        </template>
        <!-- 图片信息 -->
        <template v-if="column.dataIndex === 'reviewMessage'">
          <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
          <div>审核信息：{{ record.reviewMessage }}</div>
          <div>审核人：{{ record.reviewerId }}</div>
          <div v-if="record.reviewTime">
            审核时间：{{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              通过
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank"
            >编辑
            </a-button>
            <!-- 删除按钮：添加确认提示 -->
            <a-popconfirm
              title="确定要删除这条记录吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="doDelete(record.id)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>

        <template>
          <!-- 审核原因模态框（仅用于拒绝操作） -->
          <a-modal
            v-model:visible="reviewModalVisible"
            title="图片审核 - 拒绝"
            @ok="handleConfirmReview"
            @cancel="handleCancelReview"
            :maskClosable="false"
            :maskStyle="{ background: 'transparent' }"
          >
            <a-form :model="reviewForm">
              <a-form-item
                label="拒绝原因"
                :rules="[{ required: true, message: '拒绝时必须填写原因' }]"
              >
                <a-textarea
                  v-model:value="reviewForm.reviewMessage"
                  placeholder="请输入拒绝原因（必填）"
                  :rows="4"
                />
              </a-form-item>
            </a-form>
          </a-modal>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost, doPictureReviewUsingPost,
  listPictureByPageUsingPost,
  updatePictureUsingPost
} from '@/api/PictureController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS
} from '../../components/constants/picture.ts'


// 新增状态变量
const reviewModalVisible = ref(false)
const currentReviewStatus = ref<number>(PIC_REVIEW_STATUS_ENUM.PASS)
const currentRecord = ref<API.Picture|null>(null)
const reviewForm = reactive({
  reviewMessage: '',
})

// 审核处理方法
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  if (reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS) {
    // 直接通过，无需弹框
    const res = await doPictureReviewUsingPost({
      id: record.id,
      reviewStatus: PIC_REVIEW_STATUS_ENUM.PASS,
      reviewMessage: '管理员操作通过', // 默认通过原因
    })
    if (res.data.code === 0) {
      message.success('审核通过成功')
      fetchData() // 刷新数据
    } else {
      message.error('审核操作失败，' + res.data.message)
    }
  } else {
    // 拒绝操作，打开弹框填写原因
    currentRecord.value = record
    currentReviewStatus.value = reviewStatus
    reviewForm.reviewMessage = '' // 重置输入框
    reviewModalVisible.value = true
  }
}

// 确认审核（仅用于拒绝操作）
const handleConfirmReview = async () => {
  if (!currentRecord.value) return

  const res = await doPictureReviewUsingPost({
    id: currentRecord.value.id,
    reviewStatus: currentReviewStatus.value,
    reviewMessage: reviewForm.reviewMessage || '管理员操作拒绝',
  })

  if (res.data.code === 0) {
    message.success('审核拒绝成功')
    reviewModalVisible.value = false
    fetchData() // 刷新数据
  } else {
    message.error('审核操作失败，' + res.data.message)
  }
}

// 取消审核
const handleCancelReview = () => {
  reviewModalVisible.value = false
  currentRecord.value = null
}

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
  },
  {
    title: '用户id',
    dataIndex: 'PictureId',
    width: 80,
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref<API.Picture>([])
const total = ref(0)
const editing = ref<{ [key: string]: boolean }>({})

//表格变化之后重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

const doSearch = () => {
  //重置页码
  searchParams.current = 1
  fetchData()
}

// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

const toggleEdit = (id: string) => {
  if (editing.value[id]) {
    // 保存编辑
    const record = dataList.value.find((item) => item.id === id)
    if (record) {
      updatePictureUsingPost(record).then((res) => {
        if (res.data.code === 0) {
          message.success('保存成功')
          editing.value[id] = false
        } else {
          message.error('保存失败')
        }
      })
    }
  } else {
    editing.value[id] = true
  }
}

// const handleReview = async (record: API.Picture, reviewStatus: number) => {
//   const reviewMessage = reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'
//   const res = await doPictureReviewUsingPost({
//     id: record.id,
//     reviewStatus,
//     reviewMessage,
//   })
//   if (res.data.code === 0) {
//     message.success('审核操作成功')
//     // 重新获取列表
//     fetchData()
//   } else {
//     message.error('审核操作失败，' + res.data.message)
//   }
// }

</script>
