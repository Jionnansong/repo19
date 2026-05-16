<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <el-input
          v-model="search"
          placeholder="Search members by name or phone..."
          class="!w-80 shadow-sm"
          clearable
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-model="filterLevel" placeholder="All Levels" clearable class="!w-40 shadow-sm">
          <el-option label="Normal" value="Normal" />
          <el-option label="Silver" value="Silver" />
          <el-option label="Gold" value="Gold" />
          <el-option label="Platinum" value="Platinum" />
        </el-select>
      </div>
      <el-button type="primary" class="!rounded-xl shadow-md px-6" @click="handleAdd">
        <el-icon class="mr-2"><Plus /></el-icon>
        New Member
      </el-button>
    </div>

    <!-- Member Table -->
    <el-card shadow="never" class="!rounded-2xl border-none">
      <el-table :data="filteredMembers" style="width: 100%" v-loading="loading">
        <el-table-column label="Member Info" min-width="250">
          <template #default="{ row }">
            <div class="flex items-center space-x-3">
              <el-avatar :size="40" class="!bg-indigo-100 !text-indigo-600 font-bold">
                {{ row.name.charAt(0) }}
              </el-avatar>
              <div>
                <p class="font-bold text-gray-900">{{ row.name }}</p>
                <p class="text-xs text-gray-500">{{ row.phone }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="Level" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelTag(row.level)" effect="light" class="!rounded-full px-3">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Balance" width="140">
          <template #default="{ row }">
            <span class="font-semibold text-gray-900">${{ row.balance }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Points" width="120">
          <template #default="{ row }">
            <div class="flex items-center space-x-1">
              <el-icon class="text-amber-400"><StarFilled /></el-icon>
              <span class="text-gray-600">{{ row.points }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Join Date" width="180">
          <template #default="{ row }">
            <span class="text-gray-500 text-sm">{{ formatDate(row.joinDate) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Status" width="120">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="(val) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="120" fixed="right">
          <template #default="{ row }">
            <div class="flex space-x-1">
              <el-button circle size="small" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button circle size="small" type="danger" plain @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Member Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? 'Edit Member' : 'Add New Member'"
      width="500px"
      class="!rounded-2xl"
    >
      <el-form :model="memberForm" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="memberForm.name" placeholder="Enter name" />
        </el-form-item>
        <el-form-item label="Phone Number" prop="phone">
          <el-input v-model="memberForm.phone" placeholder="Enter phone number" />
        </el-form-item>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Membership Level" prop="level">
            <el-select v-model="memberForm.level" class="w-full">
              <el-option label="Normal" value="Normal" />
              <el-option label="Silver" value="Silver" />
              <el-option label="Gold" value="Gold" />
              <el-option label="Platinum" value="Platinum" />
            </el-select>
          </el-form-item>
          <el-form-item label="Initial Balance" prop="balance">
            <el-input-number v-model="memberForm.balance" :min="0" class="!w-full" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="flex space-x-3 justify-end">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" :loading="saving" @click="handleSave">Save Member</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { memberApi } from '../api';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(true);
const saving = ref(false);
const members = ref([]);
const search = ref('');
const filterLevel = ref('');
const dialogVisible = ref(false);
const editingId = ref(null);
const formRef = ref(null);

const memberForm = ref({
  name: '',
  phone: '',
  level: 'Normal',
  balance: 0,
  status: 'active'
});

const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  phone: [{ required: true, message: 'Phone is required', trigger: 'blur' }],
};

const filteredMembers = computed(() => {
  return members.value.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.value.toLowerCase()) || 
                      m.phone.includes(search.value);
    const matchLevel = !filterLevel.value || m.level === filterLevel.value;
    return matchSearch && matchLevel;
  });
});

const fetchMembers = async () => {
  try {
    const { data } = await memberApi.list();
    members.value = data;
  } catch (error) {
    ElMessage.error('Failed to load members');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  editingId.value = null;
  memberForm.value = { name: '', phone: '', level: 'Normal', balance: 0, status: 'active' };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  editingId.value = row.id;
  memberForm.value = { ...row };
  dialogVisible.value = true;
};

const handleSave = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      saving.value = true;
      try {
        if (editingId.value) {
          await memberApi.update(editingId.value, memberForm.value);
          ElMessage.success('Member updated');
        } else {
          await memberApi.create(memberForm.value);
          ElMessage.success('Member created');
        }
        dialogVisible.value = false;
        fetchMembers();
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Save failed');
      } finally {
        saving.value = false;
      }
    }
  });
};

const handleDelete = (row) => {
  ElMessageBox.confirm(`Delete member ${row.name}?`, 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'error',
  }).then(async () => {
    try {
      await memberApi.delete(row.id);
      ElMessage.success('Member deleted');
      fetchMembers();
    } catch (error) {
      ElMessage.error('Delete failed');
    }
  });
};

const handleStatusChange = async (row, val) => {
  try {
    await memberApi.update(row.id, { status: val });
    ElMessage.success(`Status updated to ${val}`);
  } catch (error) {
    row.status = val === 'active' ? 'inactive' : 'active';
    ElMessage.error('Status update failed');
  }
};

const getLevelTag = (level) => {
  const tags = { Platinum: 'danger', Gold: 'warning', Silver: '', Normal: 'info' };
  return tags[level] || 'info';
};

const formatDate = (date) => new Date(date).toLocaleDateString();

onMounted(fetchMembers);
</script>
