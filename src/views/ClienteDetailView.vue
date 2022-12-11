<template>
  <div>
    <v-dialog v-model="dialog" width="500"
      ><v-card :loading="loadingCrear">
        <v-card-title class="text-h5"> Crear mascota </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              label="Nombre"
              v-model="nuevaMascota.nombre"
            ></v-text-field>
            <v-text-field
              label="Peso"
              v-model="nuevaMascota.peso"
              type="number"
            ></v-text-field>
            <v-select
              v-model="nuevaMascota.especie"
              :items="especieOpciones"
              label="Especie"
            ></v-select>
            <v-text-field
              label="Raza"
              v-model="nuevaMascota.raza"
            ></v-text-field>
            <v-select
              v-model="nuevaMascota.sexo"
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
                  v-model="date"
                  label="Fecha de nacimiento"
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
            @click="crearMascota()"
            :disabled="desbloquearCrearMascota()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
    <div class="header">
      <h1>Cliente</h1>
      <v-switch v-model="editar" label="Editar"></v-switch>
    </div>
    <div v-if="cliente && !loading">
      <div class="datos-cliente">
        <v-form v-if="cliente">
          <v-text-field
            :readonly="!editar"
            label="Nombre"
            v-model="cliente.nombre"
          ></v-text-field>
          <v-text-field
            :readonly="!editar"
            label="Teléfono"
            v-model="cliente.telefono"
          ></v-text-field>
          <v-text-field
            :readonly="!editar"
            label="Correo electrónico"
            v-model="cliente.email"
          ></v-text-field>
          <v-text-field
            :readonly="!editar"
            label="Dirección"
            v-model="cliente.direccion"
          ></v-text-field>
          <v-text-field
            :readonly="!editar"
            label="RUT"
            v-model.lazy="rut"
            @input="changeRut"
            :rules="rutRules"
          ></v-text-field>
        </v-form>
      </div>
      <v-divider style="margin: 1.5rem 1rem"></v-divider>
      <div class="header">
        <h2>Mascotas</h2>
        <v-btn depressed color="primary" @click="abrirDialogo()">
          Crear mascota
        </v-btn>
      </div>
      <v-data-table
        :loading="loadingMascotas"
        :headers="headers"
        :items="mascotas"
        class="elevation-0"
      >
        <template v-slot:[`item.peso`]="{ item }">
          {{ item.peso }} kg
        </template>
        <template v-slot:[`item.fechaNacimiento`]="{ item }">
          {{ filtroFecha(item.fechaNacimiento) }}
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import BackendService from "@/services/backend.service";
import RutUtils from "@/utils/rut.utils";
import Vue from "vue";

export default Vue.extend({
  name: "ClienteDetailView",
  data: () => ({
    clienteId: null,
    cliente: null,
    loading: true,
    loadingMascotas: true,
    dialog: false,
    nuevaMascota: {},
    loadingCrear: false,
    rutRules: [(v) => RutUtils.validateRut(v) || "RUT no válido"],
    editar: false,
    activePicker: null,
    date: null,
    menu: false,
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
    mascotas: [],
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
      },
      {
        text: "Especie",
        align: "start",
        sortable: false,
        value: "especie",
      },
      {
        text: "Sexo",
        align: "start",
        sortable: false,
        value: "sexo",
      },
      {
        text: "Raza",
        align: "start",
        sortable: false,
        value: "raza",
      },
      {
        text: "Peso",
        align: "start",
        sortable: false,
        value: "peso",
      },
      {
        text: "Fecha de nacimiento",
        align: "start",
        sortable: false,
        value: "fechaNacimiento",
      },
    ],
  }),
  beforeMount() {
    const clienteId = this.$route.params.clienteId;
    this.clienteId = clienteId;
    this.obtenerCliente();
  },
  watch: {
    editar() {
      this.obtenerCliente();
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    async obtenerCliente() {
      this.loading = true;
      try {
        const res = await BackendService.obtenerCliente(this.clienteId);
        this.cliente = res;
        this.changeRut(this.cliente.rut);
        this.obtenerMascotas();
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
    async obtenerMascotas() {
      this.loadingMascotas = true;
      try {
        const res = await BackendService.obtenerMascotasPorCliente(
          this.clienteId
        );
        console.log("res", res);
        this.mascotas = res;
      } catch (error) {
        // Handle error
      } finally {
        this.loadingMascotas = false;
      }
    },
    changeRut(rut) {
      this.cliente.rut = RutUtils.clean(rut);
      this.rut = RutUtils.formatRut(rut);
    },
    abrirDialogo() {
      this.dialog = true;
      this.nuevaMascota = {};
    },
    cerrarDialogo() {
      this.dialog = false;
      this.nuevaMascota = {};
    },
    async crearMascota() {
      this.loadingCrear = true;
      try {
        this.nuevaMascota.fechaNacimiento = this.date;
        this.nuevaMascota.apoderado = this.clienteId;
        const res = await BackendService.crearMascota(this.nuevaMascota);
        console.log("res", res);
        this.nuevaMascota = {};
        this.obtenerMascotas();
        this.cerrarDialogo();
      } catch (error) {
        // Handle error
      } finally {
        this.loadingCrear = false;
      }
    },
    desbloquearCrearMascota() {
      if (
        this.nuevaMascota.nombre &&
        this.nuevaMascota.peso &&
        this.nuevaMascota.raza &&
        this.nuevaMascota.especie &&
        this.nuevaMascota.sexo &&
        this.date
      ) {
        return false;
      }
      return true;
    },
    filtroFecha(fecha) {
      try {
        fecha = fecha.split("T")[0];
        const [yyyy, dd, mm] = fecha.split("-");
        return `${dd}/${mm}/${yyyy}`;
      } catch (error) {
        return "";
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

.datos-cliente {
  max-width: 500px;
  margin-left: 0.5rem;
}
</style>