<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  created() {
    document.title = "Veterinaria CenVet";
  },
};
</script>

<style lang="scss">
h1 {
  font-size: 1.5rem;
}
h2 {
  font-size: 1.25rem;
}
</style>
