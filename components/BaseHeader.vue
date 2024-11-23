<template>
  <header class="bg-gray-800 text-white py-4 shadow-md">
    <nav class="mx-8 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-100">
        <nuxt-link to="/" class="hover:underline">
          Tooler
        </nuxt-link>
      </h1>
      <ul class="flex space-x-4">
        <li>
          <nuxt-link to="/convert" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md hover:underline">
            Convert DOCX to PDF
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/protect" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md hover:underline">
            Password Protect PDF
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
</script>

<style scoped>
header {
  background-color: #2d3748;
}

</style>

