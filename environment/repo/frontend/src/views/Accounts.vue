<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-bold text-gray-800">System Accounts</h3>
      <el-button type="primary" disabled>
        <el-icon class="mr-2"><Plus /></el-icon>
        Create User
      </el-button>
    </div>

    <el-card shadow="never" class="!rounded-2xl border-none">
      <el-table :data="users" style="width: 100%" v-loading="loading">
        <el-table-column prop="username" label="Username">
          <template #default="{ row }">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Avatar class="w-6 h-6 text-slate-500" />
              </div>
              <span class="font-bold">{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="Role">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" class="capitalize">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" effect="dark">
              {{ row.status ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Created Time">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-alert
      title="User Management restriction"
      type="info"
      description="Creating and deleting system users is currently restricted to Root administrators in the backend."
      show-icon
      :closable="false"
      class="!rounded-xl"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userApi } from '../api';
import { ElMessage } from 'element-plus';

const loading = ref(true);
const users = ref([]);

const fetchUsers = async () => {
  try {
    const { data } = await userApi.list();
    users.value = data;
  } catch (error) {
    ElMessage.error('Failed to load system accounts');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
</script>
