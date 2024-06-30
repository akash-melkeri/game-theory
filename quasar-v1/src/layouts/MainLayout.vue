<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered color="transparent">
      <div class="">
        <div class="container tw-flex tw-justify-between tw-relative tw-items-center tw-py-2">
          <div>
            <div class="tw-h-8 tw-w-32 tw-bg-gray-200 tw-rounded-lg"></div>
          </div>
          <div class="tw-absolute tw-flex tw-gap-4 tw-items-center tw-left-[50%] tw-translate-x-[-50%]">
            <q-btn flat dense no-caps class="tw-px-3 tw-rounded-lg">Home</q-btn>
            <q-btn flat dense no-caps class="tw-px-3 tw-rounded-lg">Comparison</q-btn>
            <q-btn flat dense no-caps class="tw-px-3 tw-rounded-lg">About Me</q-btn>
          </div>
          <div>
            <q-btn icon="notifications" flat dense no-caps size="0.9em" class="tw-rounded-full tw-p-1"></q-btn>
          </div>
        </div>
      </div>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {

  },

  setup () {
    return {

    }
  }
})
</script>
<style >
.q-layout__section--marginal{
  background-color: transparent !important;
  color: black !important;
}
</style>
