<template>
  <div class="max-w-4xl space-y-6">
    <el-card shadow="never" class="!rounded-2xl border-none">
      <template #header>
        <span class="font-bold text-gray-800">General Settings</span>
      </template>
      <el-form label-position="top">
        <div class="grid grid-cols-2 gap-6">
          <el-form-item label="System Name">
            <el-input v-model="settings.systemName" />
          </el-form-item>
          <el-form-item label="Contact Email">
            <el-input v-model="settings.email" />
          </el-form-item>
        </div>
        <el-form-item label="Logo URL">
          <el-input v-model="settings.logoUrl" />
        </el-form-item>
        <div class="flex justify-end mt-4">
          <el-button type="primary" @click="handleSave">Save Changes</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card shadow="never" class="!rounded-2xl border-none">
      <template #header>
        <span class="font-bold text-gray-800">Loyalty Program</span>
      </template>
      <el-form label-position="top">
        <div class="grid grid-cols-2 gap-6">
          <el-form-item label="Points Multiplier (per $)">
            <el-input-number v-model="settings.pointsRate" :min="1" class="!w-full" />
          </el-form-item>
          <el-form-item label="Min Balance for Gold Level">
            <el-input-number v-model="settings.goldThreshold" :min="0" class="!w-full" />
          </el-form-item>
        </div>
        <el-form-item label="Birthday Bonus Points">
          <el-input-number v-model="settings.birthdayBonus" :min="0" class="!w-full" />
        </el-form-item>
        <div class="flex justify-end mt-4">
          <el-button type="primary" @click="handleSave">Update Program</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card shadow="never" class="!rounded-2xl border-none border-red-100 bg-red-50/30">
      <template #header>
        <span class="font-bold text-red-600">Danger Zone</span>
      </template>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold text-gray-800">Reset System Database</p>
          <p class="text-sm text-gray-500">This will wipe all members and logs. This action cannot be undone.</p>
        </div>
        <el-button type="danger" plain>Reset System</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

const settings = reactive({
  systemName: 'MemberHub CMS',
  email: 'admin@memberhub.com',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  pointsRate: 10,
  goldThreshold: 1000,
  birthdayBonus: 500
});

const handleSave = () => {
  ElMessage.success('Settings updated successfully');
};
</script>
