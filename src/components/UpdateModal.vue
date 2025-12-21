<template>
  <div class="modal-overlay" v-if="visible" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">{{ title }}</h3>
      <div class="modal-body">
        <div class="update-row">
          <span class="update-label">{{ t('版本') }}</span>
          <span class="update-value">{{ version }}</span>
        </div>
        <div class="update-note" v-if="content">
          <p>{{ content }}</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn secondary" @click="$emit('neverShow')">{{ t('不再提示') }}</button>
        <button class="modal-btn primary" @click="$emit('close')">{{ t('关闭') }}</button>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { inject } from 'vue'
  
  const props = defineProps({
    visible: { type: Boolean, default: false },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    version: { type: String, default: '' }
  })
  
  const t = inject('t')
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.2s ease;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 16px;
    width: 90%;
    max-width: 360px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease;
  }
  .modal-title {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    text-align: center;
  }
  .modal-body {
    margin-bottom: 16px;
  }
  .update-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
  }
  .update-row:last-child {
    border-bottom: none;
  }
  .update-label {
    font-size: 14px;
    color: #666;
  }
  .update-value {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  .update-note p {
    font-size: 14px;
    color: #333;
    margin: 12px 0 0 0;
    line-height: 1.5;
    white-space: pre-wrap;
  }
  .modal-actions {
    display: flex;
    gap: 12px;
  }
  .modal-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .modal-btn.secondary {
    background: #f5f5f5;
    color: #666;
  }
  .modal-btn.primary {
    background: #667eea;
    color: white;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  </style>
