<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <el-card shadow="hover" class="!rounded-2xl border-none shadow-sm">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserFilled class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Members</p>
            <h3 class="text-2xl font-bold">{{ stats.totalMembers }}</h3>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="!rounded-2xl border-none shadow-sm">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-green-50 text-green-600 rounded-xl">
            <CircleCheckFilled class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Active Members</p>
            <h3 class="text-2xl font-bold">{{ stats.activeMembers }}</h3>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="!rounded-2xl border-none shadow-sm">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <WalletFilled class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Balance</p>
            <h3 class="text-2xl font-bold">${{ stats.totalBalance.toFixed(2) }}</h3>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="!rounded-2xl border-none shadow-sm">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <StarFilled class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Points</p>
            <h3 class="text-2xl font-bold">{{ stats.totalPoints }}</h3>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity Table -->
      <el-card shadow="never" class="lg:col-span-2 !rounded-2xl border-none">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-800">Recent Member Registrations</span>
            <el-button link type="primary" @click="$router.push('/members')">View all</el-button>
          </div>
        </template>
        <el-table :data="stats.recentMembers" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="Member Name" width="180">
            <template #default="{ row }">
              <div class="flex items-center space-x-2">
                <el-avatar :size="32">{{ row.name.charAt(0) }}</el-avatar>
                <span class="font-medium">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="Level">
            <template #default="{ row }">
              <el-tag :type="getLevelTag(row.level)">{{ row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="Balance">
            <template #default="{ row }">
              <span class="text-gray-900 font-medium">${{ row.balance }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status">
            <template #default="{ row }">
              <div class="flex items-center">
                <span class="w-2 h-2 rounded-full mr-2" :class="row.status === 'active' ? 'bg-green-500' : 'bg-red-500'"></span>
                {{ row.status }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- Quick Actions & Alerts -->
      <div class="space-y-6">
        <el-card shadow="never" class="!rounded-2xl border-none">
          <template #header>
            <span class="font-bold text-gray-800">Quick Actions</span>
          </template>
          <div class="grid grid-cols-2 gap-4">
            <el-button class="!h-20 !rounded-xl flex flex-col items-center justify-center m-0" @click="$router.push('/members')">
              <el-icon :size="24" class="mb-2"><Plus /></el-icon>
              <span>Add Member</span>
            </el-button>
            <el-button class="!h-20 !rounded-xl flex flex-col items-center justify-center m-0" @click="$router.push('/settings')">
              <el-icon :size="24" class="mb-2"><Setting /></el-icon>
              <span>Settings</span>
            </el-button>
          </div>
        </el-card>

        <el-card shadow="never" class="!rounded-2xl border-none bg-indigo-600 text-white">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-bold text-lg mb-1">System Update</h4>
              <p class="text-indigo-100 text-sm">New member loyalty features are now live. Check the settings to configure points rewards.</p>
            </div>
            <el-icon :size="24"><InfoFilled /></el-icon>
          </div>
          <el-button class="mt-4 !bg-white/20 !border-none !text-white hover:!bg-white/30" size="small">Learn More</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { statsApi } from '../api';
import { ElMessage } from 'element-plus';

const loading = ref(true);
const stats = ref({
  totalMembers: 0,
  activeMembers: 0,
  totalBalance: 0,
  totalPoints: 0,
  recentMembers: []
});

const getLevelTag = (level) => {
  const tags = {
    'Platinum': 'danger',
    'Gold': 'warning',
    'Silver': '',
    'Normal': 'info'
  };
  return tags[level] || 'info';
};

const fetchStats = async () => {
  try {
    const { data } = await statsApi.get();
    stats.value = data;
  } catch (error) {
    ElMessage.error('Failed to load dashboard statistics');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);
</script>
