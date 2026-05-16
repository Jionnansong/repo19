<template>
  <el-container class="h-screen">
    <el-aside width="240px" class="flex flex-col">
      <div class="p-6 flex items-center space-x-3">
        <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Users class="text-white w-5 h-5" />
        </div>
        <span class="text-lg font-bold tracking-tight">MemberHub</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="flex-1"
        background-color="#1e1b4b"
        text-color="#a5b4fc"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item index="/">
          <el-icon><DataBoard /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/members">
          <el-icon><UserFilled /></el-icon>
          <span>Members</span>
        </el-menu-item>
        <el-menu-item index="/accounts">
          <el-icon><Avatar /></el-icon>
          <span>Accounts</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>

      <div class="p-4 border-t border-indigo-900">
        <div class="flex items-center space-x-3 px-3 py-2">
          <div class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold">
            {{ auth.user?.username?.substring(0, 2).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ auth.user?.username }}</p>
            <p class="text-xs text-indigo-300 truncate capitalize">{{ auth.user?.role }}</p>
          </div>
          <el-button link @click="handleLogout">
            <el-icon class="text-indigo-300"><SwitchButton /></el-icon>
          </el-button>
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header height="64px" class="bg-white border-b flex items-center justify-between px-8">
        <h2 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h2>
        <div class="flex items-center space-x-4">
          <el-badge is-dot class="cursor-pointer">
            <el-icon size="20"><Bell /></el-icon>
          </el-badge>
        </div>
      </el-header>
      
      <el-main class="bg-gray-50 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { Users } from 'lucide-vue-next';
import { ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const activeMenu = computed(() => route.path);

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard Overview',
    '/members': 'Member Management',
    '/accounts': 'System Accounts',
    '/settings': 'System Settings'
  };
  return titles[route.path] || 'MemberHub';
});

const handleLogout = () => {
  ElMessageBox.confirm('Are you sure you want to logout?', 'Logout', {
    confirmButtonText: 'Logout',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(() => {
    auth.logout();
    router.push('/login');
  });
};
</script>

<style scoped>
.el-menu-item.is-active {
  background-color: #312e81 !important;
}
.el-menu-item:hover {
  background-color: #312e81 !important;
}
</style>
