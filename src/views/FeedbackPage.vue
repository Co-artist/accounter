<template>
  <div class="feedback-container">
    <div class="feedback-header">
      <h2>反馈建议</h2>
      <button class="back-button" @click="$router.back()">
        <i class="icon-arrow-left"></i>
      </button>
    </div>
    
    <div class="feedback-form-wrapper">
      <form class="feedback-form" @submit.prevent="submitFeedback">
        <div class="form-group">
          <label for="feedback-type">反馈类型</label>
          <select id="feedback-type" v-model="feedback.type" required>
            <option value="">请选择反馈类型</option>
            <option value="bug">功能问题</option>
            <option value="suggestion">功能建议</option>
            <option value="ui">界面问题</option>
            <option value="other">其他</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="feedback-content">反馈内容</label>
          <textarea 
            id="feedback-content" 
            v-model="feedback.content" 
            rows="5" 
            placeholder="请详细描述您的问题或建议..." 
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="feedback-contact">联系方式（可选）</label>
          <input 
            type="text" 
            id="feedback-contact" 
            v-model="feedback.contact" 
            placeholder="邮箱或手机号，方便我们联系您"
          >
        </div>
        
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交反馈' }}
        </button>
      </form>
      
      <div v-if="submitSuccess" class="success-message">
        <i class="icon-check-circle"></i>
        <p>感谢您的反馈！我们会认真对待您的建议。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../utils/axios';

const feedback = ref({
  type: '',
  content: '',
  contact: ''
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);

const submitFeedback = async () => {
  if (!feedback.value.type || !feedback.value.content) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    await axios.post('/feedback', feedback.value);
    submitSuccess.value = true;
    
    // 清空表单
    feedback.value = {
      type: '',
      content: '',
      contact: ''
    };
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error('反馈提交失败:', error);
    alert('反馈提交失败，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.feedback-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.feedback-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.feedback-header h2 {
  font-size: 20px;
  margin: 0 auto;
}

.back-button {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.feedback-form-wrapper {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group select,
.form-group textarea,
.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.success-message {
  margin-top: 20px;
  padding: 16px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.icon-check-circle {
  font-size: 20px;
}
</style>