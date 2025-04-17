<template>
  <div id="userManagePage">
    <!--搜索表单-->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
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
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userName'">
          <span v-if="!editing[record.id]">{{ record.userName }}</span>
          <a-input v-model:value="record.userName" v-else />
        </template>
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-avatar :src="record.userAvatar" :width="120" v-if="!editing[record.id]"/>
          <a-input v-model:value="record.userAvatar" v-else />
        </template>
        <template v-if="column.dataIndex === 'userProfile'">
          <span v-if="!editing[record.id]">{{ record.userProfile }}</span>
          <a-input v-model:value="record.userProfile" v-else />
        </template>
        <template v-if="column.dataIndex === 'userRole'">
          <div v-if="!editing[record.id]">
            <a-tag :color="record.userRole === 'admin'? 'green' : 'blue'">
              {{ record.userRole === 'admin'? '管理员' : '普通用户' }}
            </a-tag>
          </div>
          <a-select v-model:value="record.userRole" v-else>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
          </a-select>
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
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { deleteUserUsingPost, listUserVoByPageUsingPost, updateUserUsingPost } from '@/api/userController.ts';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];

// 数据
const dataList = ref<API.UserVO>([]);
const total = ref(0);
const editing = ref<{ [key: string]: boolean }>({});

//表格变化之后重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current;
  searchParams.pageSize = page.pageSize;
  fetchData();
};

// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
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
const searchParams = reactive<API.UserQueryRequest>({
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
  const res = await deleteUserUsingPost({ id });
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
      updateUserUsingPost(record).then(res => {
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
</script>
