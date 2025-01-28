<template>
  <div id="categoryManagePage">
    <!--搜索表单-->
    <div style="display: flex; align-items: center;">
      <a-form layout="inline" :model="searchParams" @finish="doSearch">
        <a-form-item label="分类ID">
          <a-input v-model:value="searchParams.id" placeholder="输入分类ID" allow-clear />
        </a-form-item>
        <a-form-item label="分类名">
          <a-input v-model:value="searchParams.name" placeholder="输入分类名" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">搜索</a-button>
        </a-form-item>
      </a-form>
      <!--新增按钮，绑定新增事件-->
      <a-button type="primary" style="margin-left: 8px" @click="showAddModal">新增</a-button>
    </div>
    <div style="margin-bottom: 16px"></div>
    <!--表格-->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <div v-if="!editing[record.id]">
            <a-tag color="blue">{{ record.name }}</a-tag>
          </div>
          <a-input v-model:value="record.name" v-else />
        </template>
        <template v-if="column.dataIndex === 'usageCount'">
          {{ (record.usageCount) }}
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.key === 'action'">
          <a-button @click="toggleEdit(record.id)" :danger="editing[record.id]" >
            {{ editing[record.id]? '保存' : '编辑' }}
          </a-button>
          <a-button danger @click="doDelete(record.id)" style="margin-left: 8px" v-if="!editing[record.id]">删除</a-button>
        </template>
      </template>
    </a-table>
    <!-- 新增分类的模态框 -->
    <a-modal
      :visible="addModalVisible"
      title="新增分类"
      @ok="handleAddSubmit"
      @cancel="handleAddCancel"
    >
      <a-form :model="addFormData" @finish="handleAddSubmit">
        <a-form-item label="分类名" name="name" :rules="[{ required: true, message: '请输入分类名' }]">
          <a-input v-model:value="addFormData.name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  addCategoryUsingPost,
  deleteCategoryUsingPost,
  listCategoryVoByPageUsingPost,
  updateCategoryUsingPost
} from '@/api/categoryController.ts'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '分类名',
    dataIndex: 'name',
  },
  {
    title: '使用次数',
    dataIndex: 'usageCount',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];

// 数据
const dataList = ref<API.CategoryVO>([]);
const total = ref(0);
const editing = ref<{ [key: string]: boolean }>({});

const addModalVisible = ref(false);
const addFormData = reactive({
  name: ''
});

//表格变化之后重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current;
  searchParams.pageSize = page.pageSize;
  fetchData();
};

// 获取数据
const fetchData = async () => {
  const res = await listCategoryVoByPageUsingPost({
    ...searchParams
  });
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records?? [];
    total.value = res.data.data.total?? 0;
  } else {
    message.error('获取数据失败，' + res.data.message);
  }
};

// 页面加载时请求一次
onMounted(() => {
  fetchData();
});

// 搜索条件
const searchParams = reactive<API.CategoryQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "ascend"
});

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  };
});

const doSearch = () => {
  //重置页码
  searchParams.current = 1;
  fetchData();
};

// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return;
  }
  const res = await deleteCategoryUsingPost({ id });
  if (res.data.code === 0) {
    message.success('删除成功');
    // 刷新数据
    fetchData();
  } else {
    message.error('删除失败');
  }
};

const toggleEdit = (id: string) => {
  if (editing.value[id]) {
    // 保存编辑
    const record = dataList.value.find(item => item.id === id);
    if (record) {
      updateCategoryUsingPost(record).then(res => {
        if (res.data.code === 0) {
          message.success('保存成功');
          editing.value[id] = false;
        } else {
          message.error('保存失败');
        }
      });
    }
  } else {
    editing.value[id] = true;
  }
};

const showAddModal = () => {
  addModalVisible.value = true;
  addFormData.name = '';
};

const handleAddSubmit = async () => {
  try {
    const res = await addCategoryUsingPost(addFormData);
    if (res.data.code === 0) {
      message.success('新增成功');
      addModalVisible.value = false;
      fetchData();
    } else {
      message.error('新增失败');
    }
  } catch (error) {
    message.error('新增失败');
  }
};

const handleAddCancel = () => {
  addModalVisible.value = false;
};
</script>
