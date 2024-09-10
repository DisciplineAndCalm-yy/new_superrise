<template>
    <BasePage @init="useInit"/>
</template>

<script setup lang="ts">
import BasePage from "../components/BasePage.vue";
import { TypeEnum } from "/@/views/service/enterprise-library/index.data";
const useInit  = (cb: Function) => {
    cb(TypeEnum.edit)
}
</script>

<style>

</style>