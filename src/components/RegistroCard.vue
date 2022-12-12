<template>
  <v-card class="registro" elevation="0" color="#f5f5f5">
    <!-- Actualizar -->
    <v-dialog v-model="dialogoActualizar" width="500"
      ><v-card :loading="loadingActualizar">
        <v-card-title class="text-h5"> Actualizar registro </v-card-title>

        <v-card-text>
          <v-form :disabled="loadingActualizar">
            <v-text-field
              label="Diagnóstico"
              v-model="registroActualizado.diagnostico"
            ></v-text-field>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Fecha"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                :active-picker.sync="activePicker"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              label="Motivo"
              v-model="registroActualizado.motivo"
            ></v-text-field>
            <v-text-field
              label="Tratamiento"
              v-model="registroActualizado.tratamiento"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cerrarDialogoActualizar()">
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="actualizar()"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Eliminar -->
    <v-dialog v-model="dialogoEliminar" width="500"
      ><v-card :loading="loadingEliminar">
        <v-card-title class="text-h5"> Eliminar registro </v-card-title>

        <v-card-text
          >¿Está seguro de eliminar el registro del
          {{ obtenerFecha(registro.fecha) }}? Este es un proceso
          irreversible</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cerrarDialogoEliminar()">
            Cancelar
          </v-btn>
          <v-btn color="error" text @click="eliminar()"> Eliminar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="contenido">
      <v-card-title>{{ obtenerFecha(registro.fecha) }}</v-card-title>
      <v-card-text>
        <p>Diagnóstico: {{ registro.diagnostico }}</p>
        <p>Motivo consulta: {{ registro.motivo }}</p>
        <p>Tratamiento: {{ registro.tratamiento }}</p>
      </v-card-text>
    </div>
    <div class="acciones">
      <v-btn
        class="mx-2"
        fab
        dark
        x-small
        elevation="0"
        color="primary"
        @click="abrirDialogoActualizar()"
      >
        <v-icon dark> mdi-pencil </v-icon>
      </v-btn>
      <v-btn
        class="mx-2"
        fab
        dark
        x-small
        elevation="0"
        color="error"
        @click="abrirDialogoEliminar()"
      >
        <v-icon dark> mdi-minus </v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import BackendService from "@/services/backend.service";
import Vue from "vue";

export default Vue.extend({
  name: "RegistroCard",
  props: ["registro", "obtenerRegistros"],
  data: () => ({
    datosRegistro: {},
    dialogoActualizar: false,
    loadingActualizar: false,
    dialogoEliminar: false,
    loadingEliminar: false,
    registroActualizado: {},
    activePicker: null,
    date: null,
    menu: false,
  }),
  mounted() {
    // this.datosRegistro = registro;
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    obtenerFecha(fecha) {
      let [yyyy, mm, dd] = fecha.split("T")[0].split("-");
      return `${dd}/${mm}/${yyyy}`;
    },
    abrirDialogoActualizar() {
      this.registroActualizado = { ...this.registro };
      this.date = this.registro.fecha.split("T")[0];
      this.dialogoActualizar = true;
    },
    cerrarDialogoActualizar() {
      this.registroActualizado = {};
      this.dialogoActualizar = false;
    },
    abrirDialogoEliminar() {
      this.dialogoEliminar = true;
    },
    cerrarDialogoEliminar() {
      this.dialogoEliminar = false;
    },
    async actualizar() {
      this.loadingActualizar = true;
      try {
        await BackendService.actualizarRegistro(
          this.registro._id,
          this.registroActualizado
        );
        this.cerrarDialogoActualizar();
        this.obtenerRegistros();
      } catch (error) {
        // Handle error
      } finally {
        this.loadingActualizar = false;
      }
    },
    async eliminar() {
      this.loadingEliminar = true;
      try {
        await BackendService.eliminarRegistro(this.registro._id);
        this.cerrarDialogoEliminar();
        this.obtenerRegistros();
      } catch (error) {
        // handle rrorr
      } finally {
        this.loadingEliminar = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.registro {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  .contenido {
    width: 80%;

    p {
      margin-bottom: 0.35rem;
    }
  }

  .acciones {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>