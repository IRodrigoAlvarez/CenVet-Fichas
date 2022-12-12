<template>
  <div>
    <v-dialog v-model="dialog" width="500"
      ><v-card :loading="loadingCrear">
        <v-card-title class="text-h5"> Crear registro </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              label="Diagnóstico"
              v-model="nuevoRegistro.diagnostico"
            ></v-text-field>
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date2"
                  label="Fecha"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date2"
                :active-picker.sync="activePicker2"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
                @change="save2"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              label="Motivo"
              v-model="nuevoRegistro.motivo"
            ></v-text-field>
            <v-text-field
              label="Tratamiento"
              v-model="nuevoRegistro.tratamiento"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cerrarDialogo()">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="crearRegistro()"
            :disabled="desbloquearCrearRegistro()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
    <div class="header">
      <h1>Mascota</h1>
      <v-switch v-model="editar" label="Editar"></v-switch>
    </div>
    <div v-if="mascota">
      <div class="datos-mascota">
        <v-form v-if="mascota">
          <v-text-field
            :readonly="!editar"
            :loading="loading"
            :disabled="loading"
            label="Nombre"
            v-model="mascota.nombre"
          ></v-text-field>
          <v-text-field
            :readonly="!editar"
            :loading="loading"
            :disabled="loading"
            label="Peso"
            v-model="mascota.peso"
            type="number"
          ></v-text-field>
          <v-select
            :readonly="!editar"
            :loading="loading"
            :disabled="loading"
            v-model="mascota.especie"
            :items="especieOpciones"
            label="Especie"
          ></v-select>
          <v-text-field label="Raza" v-model="mascota.raza"></v-text-field>
          <v-select
            :readonly="!editar"
            :loading="loading"
            :disabled="loading"
            v-model="mascota.sexo"
            :items="sexoOpciones"
            item-text="etiqueta"
            item-value="valor"
            label="Sexo"
            :return-object="false"
          ></v-select>
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
                readonly
                :loading="loading"
                :disabled="loading"
                v-model="date"
                label="Fecha de nacimiento"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :readonly="!editar"
              :loading="loading"
              :disabled="loading"
              :active-picker.sync="activePicker"
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              min="1950-01-01"
              @change="save"
            ></v-date-picker> </v-menu
        ></v-form>
        <v-btn
          v-if="editar"
          depressed
          color="primary"
          @click="guardarMascota()"
        >
          Guardar
        </v-btn>
      </div>
      <div class="header">
        <h2>Historial</h2>
        <v-btn depressed color="primary" @click="abrirDialogo()">
          Agregar registro
        </v-btn>
      </div>
      <div v-if="registros && !loadingRegistros" class="mt-4">
        <registro-card
          v-for="registro in registros"
          :key="registro._id"
          :registro="registro"
          :obtenerRegistros="obtenerRegistros"
        ></registro-card>
        <div class="text-center">
          <v-pagination v-model="pagina" :length="totalPaginas"></v-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackendService from "@/services/backend.service";
import RegistroCard from "@/components/RegistroCard.vue";
import Vue from "vue";

export default Vue.extend({
  name: "ClienteDetailView",
  components: { RegistroCard },
  data: () => ({
    mascotaId: null,
    mascota: null,
    loading: true,
    loadingRegistros: true,
    dialog: false,
    nuevoRegistro: {},
    loadingCrear: false,
    editar: false,
    activePicker: null,
    date: null,
    menu: false,
    activePicker2: null,
    date2: null,
    menu2: false,
    pagina: 1,
    limite: 5,
    totalPaginas: 0,
    especieOpciones: ["Gato", "Perro", "Exótico"],
    sexoOpciones: [
      {
        valor: "M",
        etiqueta: "Masculino",
      },
      {
        valor: "F",
        etiqueta: "Femenino",
      },
    ],
    registros: [],
  }),
  beforeMount() {
    const mascotaId = this.$route.params.mascotaId;
    this.mascotaId = mascotaId;
    this.obtenerMascota();
  },
  watch: {
    editar() {
      if (!this.editar) {
        this.obtenerMascota();
      }
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
    pagina() {
      this.obtenerRegistros();
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    save2(date2) {
      this.$refs.menu2.save(date2);
    },
    async obtenerMascota() {
      this.loading = true;
      try {
        const res = await BackendService.obtenerMascota(this.mascotaId);
        this.mascota = res;
        this.date = this.mascota.fechaNacimiento.split("T")[0];
        console.log("this.mascota", this.mascota);
        this.obtenerRegistros();
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
    async guardarMascota() {
      this.loading = true;
      try {
        const res = await BackendService.actualizarMascota(
          this.mascotaId,
          this.mascota
        );
        this.mascota = res;
        this.obtenerRegistros();
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
    async obtenerRegistros() {
      this.loadingRegistros = true;
      try {
        const res = await BackendService.obtenerRegistrosMascota(
          this.mascotaId,
          this.pagina,
          this.limite
        );
        console.log("res", res);
        this.total = res.total;
        this.registros = res.registros;
        this.totalPaginas = Math.ceil(this.total / this.limite);
      } catch (error) {
        // Handle error
      } finally {
        this.loadingRegistros = false;
      }
    },
    abrirDialogo() {
      this.dialog = true;
      this.nuevoRegistro = {};
    },
    cerrarDialogo() {
      this.dialog = false;
      this.nuevoRegistro = {};
    },
    desbloquearCrearRegistro() {
      if (
        this.nuevoRegistro.diagnostico &&
        this.nuevoRegistro.motivo &&
        this.nuevoRegistro.tratamiento &&
        this.date2
      ) {
        return false;
      }
      return true;
    },
    async crearRegistro() {
      this.loadingCrear = true;
      try {
        this.nuevoRegistro.fecha = this.date2;
        this.nuevoRegistro.mascota = this.mascotaId;
        const res = await BackendService.crearRegistro(this.nuevoRegistro);
        console.log("res", res);
        this.nuevoRegistro = {};
        this.obtenerRegistros();
        this.cerrarDialogo();
      } catch (error) {
        // Handle error
      } finally {
        this.loadingCrear = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.datos-mascota {
  max-width: 500px;
  margin-left: 0.5rem;
}
</style>