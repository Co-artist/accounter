I have identified the missing English translations and hardcoded Chinese strings across several files.

**Plan:**

1.  **Update Translation Files (`src/i18n/index.js`)**:
    *   Add missing translation keys for "Splash Animation", "Data Management" (Backup/Restore/Export), "Transaction Added", and Chart labels.
    *   Ensure both `zh-CN` and `en-US` dictionaries are updated.

2.  **Update `src/views/ProfilePage.vue`**:
    *   Replace hardcoded strings in the "Data Management" modal (Backup/Restore/Export sections) with `t()` calls.
    *   Replace hardcoded strings in `alert()` calls.

3.  **Update `src/views/HomePage.vue`**:
    *   Inject the `t` function.
    *   Replace hardcoded strings like "✅ 交易添加成功" and "选择记账类型".

4.  **Update `src/views/StatisticsPage.vue`**:
    *   Replace hardcoded chart series names ('收入', '支出') with `t('收入')`, `t('支出')` to ensure they match the legend in English mode.

5.  **Update `src/views/CategoryPage.vue`**:
    *   Replace hardcoded chart series names ('分类占比', '使用频率') with `t()`.

This will ensure that when the language is switched to English, all interface elements including modals, alerts, and charts are correctly translated.