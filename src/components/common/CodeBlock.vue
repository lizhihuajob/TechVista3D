<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-language">{{ language }}</span>
      <button class="copy-btn" @click="copyCode" :disabled="isCopied">
        <span v-if="!isCopied">复制代码</span>
        <span v-else>已复制!</span>
      </button>
    </div>
    <pre class="code-content"><code :class="`language-${language}`">{{ formattedCode }}</code></pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import hljs from 'highlight.js'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  }
})

const isCopied = ref(false)

const formattedCode = (() => {
  const lines = props.code.split('\n')
  const minIndent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^\s*/)?.[0].length || 0))
  return lines.map(l => l.slice(minIndent)).join('\n').trim()
})()

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style lang="scss" scoped>
.code-block {
  margin: $spacing-lg 0;
  border-radius: $border-radius;
  overflow: hidden;
  background: #1e1e2e;
  box-shadow: $box-shadow;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: #282a36;
  border-bottom: 1px solid #343746;
}

.code-language {
  font-size: $font-size-xs;
  font-weight: 600;
  color: $primary-color;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.copy-btn {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-xs;
  color: $text-secondary;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba($primary-color, 0.2);
    color: $primary-color;
    border-color: $primary-color;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}

.code-content {
  margin: 0;
  padding: $spacing-lg;
  overflow-x: auto;
  
  :deep(code) {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: $font-size-sm;
    line-height: 1.8;
    background: transparent;
    padding: 0;
    border-radius: 0;
    
    /* 语法高亮颜色 */
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-section,
    .hljs-link {
      color: #c678dd;
    }
    
    .hljs-string,
    .hljs-title,
    .hljs-name,
    .hljs-type,
    .hljs-attribute,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-addition,
    .hljs-variable,
    .hljs-template-tag,
    .hljs-template-variable {
      color: #98c379;
    }
    
    .hljs-comment,
    .hljs-quote,
    .hljs-deletion,
    .hljs-meta {
      color: #5c6370;
      font-style: italic;
    }
    
    .hljs-number,
    .hljs-regexp,
    .hljs-literal,
    .hljs-built_in,
    .hljs-builtin-name {
      color: #d19a66;
    }
    
    .hljs-function,
    .hljs-attr {
      color: #61afef;
    }
    
    .hljs-params {
      color: #e06c75;
    }
    
    .hljs {
      color: #abb2bf;
      background: transparent;
    }
  }
}
</style>
