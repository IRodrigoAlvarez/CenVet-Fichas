<template>
  <div class="login">
    <v-card :loading="loading" class="mx-auto" max-width="374">
      <div class="pa-2">
        <v-card-title>Iniciar sesión</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="email"
                :disabled="loading"
                :loading="loading"
                label="Correo electrónico"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Contraseña"
                placeholder="••••••••"
                :disabled="loading"
                :loading="loading"
                @click:append="show1 = !show1"
              ></v-text-field>
              <div class="actions">
                <v-btn
                  elevation="2"
                  color="primary"
                  :loading="loading"
                  @click="login()"
                  >Entrar</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import BackendService from "@/services/backend.service";

export default {
  name: "LoginView",

  components: {},
  data() {
    return {
      show1: false,
      password: null,
      email: null,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      loading: false,
    };
  },
  methods: {
    async login() {
      if (this.password && this.email) {
        this.loading = true;
        try {
          await BackendService.login(this.email, this.password);
          this.$router.push({ path: "/" });
        } catch (error) {
          // Handle error
        } finally {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  background-color: #19a25c;
  height: 100%;
  top: 0;
  padding-top: 1.5rem;

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>