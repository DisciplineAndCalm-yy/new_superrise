<template>
  <RouterView>
    <template #default="{ Component, route }">
      <!--      <transition-->
      <!--        :name="-->
      <!--          getTransitionName({-->
      <!--            route,-->
      <!--            openCache,-->
      <!--            enableTransition: getEnableTransition,-->
      <!--            cacheTabs: getCaches,-->
      <!--            def: getBasicTransition,-->
      <!--          })-->
      <!--        "-->
      <!--        mode="out-in"-->
      <!--        appear-->
      <!--      >-->
      <keep-alive v-if="openCache" :include="getCaches">
        <component :is="formatComponent(Component, route)" :key="route.fullPath" />
      </keep-alive>
      <component v-else :is="Component" :key="route.fullPath" />
      <!--      </transition>-->
    </template>
  </RouterView>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts">
  import { computed, defineComponent, h, unref } from 'vue';

  import FrameLayout from '/@/layouts/iframe/index.vue';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { getTransitionName } from './transition';

  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  export default defineComponent({
    name: 'PageLayout',
    components: { FrameLayout },
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting();
      const tabStore = useMultipleTabStore();

      const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return [...superviseCacheRoutr];
        }
        return [...tabStore.getCachedTabList, ...superviseCacheRoutr];
      });

      const superviseCacheRoutr: any = [];

      const storeComponents = new Map();

      // const regex = /^\/supervise\/\d+$/;
      const whiteList = ['/supervise/detail', '/supervise/line/lineAdd'] //排除详情
      // /supervise动态路由包裹一层 name
      function formatComponent(component, route) {
        let afterComponent;
        if (component && route && (route.path.startsWith('/supervise') && !whiteList.includes(route.path))) {
          const path = route.path;
          if (storeComponents.has(path)) {
            afterComponent = storeComponents.get(path);
          } else {
            afterComponent = {
              name: path,
              render() {
                return h(component);
              },
            };
            superviseCacheRoutr.push(path);
            storeComponents.set(path, afterComponent);
          }
          return h(afterComponent);
        } else {
          return component;
        }
      }

      return {
        getTransitionName,
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
        getCanEmbedIFramePage,
        formatComponent,
      };
    },
  });
</script>
