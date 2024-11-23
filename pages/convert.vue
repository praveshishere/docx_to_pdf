<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
  >
    <div class="bg-white rounded-lg p-8 shadow-2xl w-full max-w-md">
      <h1 class="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Convert .docx to .pdf
      </h1>
      <form
        @submit.prevent="handleSubmit"
        class="flex flex-col items-center space-y-6"
      >
        <div class="relative w-full">
          <label for="file" class="block text-gray-600 text-lg mb-2 font-medium"
            >Select a file</label
          >
          <input
            type="file"
            id="file"
            @change="onFileChange"
            accept=".docx"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-sm text-gray-500 mt-2 text-center">
            Only .docx files are supported
          </p>
        </div>

        <!-- Display metadata if available -->
        <div
          v-if="fileMetadata"
          class="w-full bg-gray-50 p-4 rounded-lg shadow-md mt-4"
        >
          <p><strong>Filename:</strong> {{ fileMetadata.name }}</p>
          <p><strong>Size:</strong> {{ fileMetadata.size }} bytes</p>
          <p><strong>Type:</strong> {{ fileMetadata.mimeType }}</p>
        </div>

        <button
          v-if="!downloadLink"
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Convert
        </button>

        <div class="mt-6 w-full" v-if="downloadLink">
          <a
            :href="downloadLink"
            :download="downloadName"
            class="w-full bg-green-600 hover:bg-green-700 transition duration-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 block text-center"
          >
            Download {{ downloadName }}
          </a>
        </div>
      </form>

      <!-- Download link after conversion -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const file = ref(null);
const fileMetadata = ref(null);
const downloadLink = ref(null);
const downloadName = ref(null);
const showPasswordForm = ref(false);
const password = ref(null);

function onFileChange(event) {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    // Extract metadata
    fileMetadata.value = {
      name: selectedFile.name,
      size: selectedFile.size,
      mimeType: selectedFile.type,
    };
  } else {
    file.value = null;
    fileMetadata.value = null;
  }

  downloadLink.value = null;
  showPasswordForm.value = false;
}

async function handleSubmit() {
  if (!file.value) return alert("Please select a file.");

  const formData = new FormData();
  formData.append("file", file.value);

  const response = await fetch("/api/convert-docx", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    downloadLink.value = url;
    const filename = fileMetadata.value.name.replace(/\.[^.]+$/, "");
    downloadName.value = `${filename}.pdf`;
  } else {
    alert("Conversion failed.");
  }
}

async function passwordProtect() {
  if (!password.value) return alert("Please enter a password.");

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("password", password.value);

  const response = await fetch("/api/convert-docx-protected", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    downloadLink.value = url;
    const filename = fileMetadata.value.name.replace(/\.[^.]+$/, "");
    downloadName.value = `${filename}.pdf`;
  } else {
    alert("Conversion failed.");
  }
}
</script>

