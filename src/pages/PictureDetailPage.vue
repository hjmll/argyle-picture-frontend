<template>
  <div id="pictureDetailPage">
    <a-row :gutter="[16, 16]">
      <!-- 图片展示区 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <a-image
            style="max-height: 600px; object-fit: contain"
            :src="picture.url"
          />
        </a-card>
      </a-col>
      <!-- 图片信息区 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name ?? '未命名' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              {{ picture.category ?? '默认' }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
          </a-descriptions>

        <!--图片操作-->
          <a-space>
            <a-button type="primary" @click="doDownload">
              免费下载
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>

            <a-button v-if="canEdit" :icon="h(EditOutlined)" @click="doEdit">编辑</a-button>
            <a-popconfirm
              title="确定要删除这条记录吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="doDelete"
            >
              <a-button v-if="canEdit" danger :icon="h(DeleteOutlined)" >删除</a-button>
            </a-popconfirm>
            <!--<a-button v-if="canEdit" danger :icon="h(DeleteOutlined)" @click="doDelete">删除</a-button>-->
          </a-space>
          <a-space style="margin-top: 16px">
            <!-- 审核操作按钮（仅管理员可见） -->
            <a-button
              v-if="isAdmin && picture.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="primary"
              @click="handleReview(PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              通过
            </a-button>
            <a-button
              v-if="isAdmin && picture.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              danger
              @click="handleReview(PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
          </a-space>
          <!-- 审核拒绝原因模态框 -->
          <a-modal
            v-model:visible="rejectModalVisible"
            title="图片审核 - 拒绝"
            @ok="handleConfirmReject"
            @cancel="handleCancelReject"
            :maskClosable="false"
          >
            <a-form :model="rejectForm">
              <a-form-item
                label="拒绝原因"
                :rules="[{ required: true, message: '拒绝时必须填写原因' }]"
              >
                <a-textarea
                  v-model:value="rejectForm.reviewMessage"
                  placeholder="请输入拒绝原因（必填）"
                  :rows="4"
                />
              </a-form-item>
            </a-form>
          </a-modal>

        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
// 数据
import { computed, onMounted, reactive, ref ,h} from 'vue'
import { message } from 'ant-design-vue'
import {
  deletePictureUsingPost, doPictureReviewUsingPost,
  getPictureVoByIdUsingGet,
  listPictureVoByPageUsingPost
} from '@/api/pictureController.ts'
import { downloadImage, formatSize } from '@/utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import router from '@/router'
import { PIC_REVIEW_STATUS_ENUM } from '@/components/constants/picture.ts'

const dataList = ref<API.PictureVo[]>([])
const total = ref(0)
const loading = ref(true)


interface Props {
  id: string | number
}

const props = defineProps<Props>()

const picture = ref<API.PictureVO>({})



// 审核拒绝模态框状态
const rejectModalVisible = ref(false)
const rejectForm = reactive({
  reviewMessage: '',
})
// 获取图片详情
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchPictureDetail()
})



// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})


// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [] as String[]
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records?? []
    total.value = res.data.data.total?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}




// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

const loginUserStore = useLoginUserStore()
// 是否具有编辑权限
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser;
  // 未登录不可编辑
  if (!loginUser.id) {
    return false
  }
  // 仅本人或管理员可编辑
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

// 是否是管理员
const isAdmin = computed(() => {
  return loginUserStore.loginUser?.userRole === 'admin'
})

// // 审核操作
// const handleReview = async (reviewStatus: number) => {
//   try {
//     const res = await doPictureReviewUsingPost({
//       id: picture.value.id,
//       reviewStatus,
//       reviewMessage: reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝',
//     })
//     if (res.data.code === 0) {
//       message.success('审核操作成功')
//       fetchPictureDetail() // 刷新图片详情
//     } else {
//       message.error('审核操作失败，' + res.data.message)
//     }
//   } catch (e: any) {
//     message.error('审核操作失败：' + e.message)
//   }
// }

// 审核操作
const handleReview = (reviewStatus: number) => {
  if (reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS) {
    // 直接通过，无需弹框
    handleConfirmReview(PIC_REVIEW_STATUS_ENUM.PASS)
  } else {
    // 拒绝操作，打开弹框填写原因
    rejectModalVisible.value = true
  }
}

// 确认审核通过
const handleConfirmReview = async (reviewStatus: number) => {
  try {
    const res = await doPictureReviewUsingPost({
      id: picture.value.id,
      reviewStatus,
      reviewMessage: reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS
        ? '管理员操作通过'
        : rejectForm.reviewMessage,
    })
    if (res.data.code === 0) {
      message.success('审核操作成功')
      rejectModalVisible.value = false // 关闭模态框
      fetchPictureDetail() // 刷新图片详情
    } else {
      message.error('审核操作失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('审核操作失败：' + e.message)
  }
}

// 确认审核拒绝
const handleConfirmReject = async () => {
  if (!rejectForm.reviewMessage.trim()) {
    message.error('拒绝时必须填写原因')
    return
  }
  await handleConfirmReview(PIC_REVIEW_STATUS_ENUM.REJECT)
}

// 取消审核拒绝
const handleCancelReject = () => {
  rejectModalVisible.value = false
  rejectForm.reviewMessage = '' // 清空原因
}
// 编辑
const doEdit = () => {
  router.push('/add_picture?id=' + picture.value.id)
}
// 删除
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
}

// 处理下载
const doDownload = () => {
  downloadImage(picture.value.url)
}


</script>

<style scoped>
#pictureDetailPage {
  margin-bottom: 16px;
}
</style>
