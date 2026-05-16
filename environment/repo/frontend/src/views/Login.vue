<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
          <Users class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p class="text-gray-500 mt-2">Member Management System</p>
      </div>

      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
        <el-form :model="form" :rules="rules" ref="loginForm" label-position="top" @keyup.enter="handleLogin">
          <el-form-item label="Username" prop="username">
            <el-input v-model="form.username" placeholder="Enter your username" size="large">
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="Password" prop="password">
            <el-input v-model="form.password" type="password" placeholder="••••••••" size="large" show-password>
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>

          <div class="flex items-center justify-between mb-6">
            <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
            <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>

          <el-button 
            type="primary" 
            class="w-full !rounded-xl !h-12 !bg-indigo-600 hover:!bg-indigo-700 !border-none text-base font-semibold"
            :loading="loading"
            @click="handleLogin"
          >
            Sign In
          </el-button>
        </el-form>

        <div class="mt-8 pt-6 border-t border-slate-100 text-center">
          <p class="text-sm text-gray-500">
            Demo Account: <span class="font-medium text-gray-800">admin / admin123</span>
          </p>
        </div>
      </div>
      
      <p class="text-center text-xs text-gray-400 mt-8">
        &copy; 2024 MemberHub Inc. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { Users } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';

const router = useRouter();
const auth = useAuthStore();
const loginForm = ref(null);
const loading = ref(false);
const rememberMe = ref(false);

const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }]
};

const handleLogin = async () => {
  if (!loginForm.value) return;
  
  await loginForm.value.validate(async (valid) => {
    if (valid) {
      loading.ref = true;
      try {
        const success = await auth.login(form);
        if (success) {
          ElMessage.success('Login successful');
          router.push('/');
        } else {
          ElMessage.error('Invalid username or password');
        }
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Login failed');
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>
