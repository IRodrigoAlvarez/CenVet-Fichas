<template>
  <div>
    <div class="header">
      <h1>Clientes</h1>
      <v-btn depressed color="primary" @click="abrirDialogo()">
        Crear cliente
      </v-btn>
    </div>
    <v-dialog v-model="dialog" width="500"
      ><v-card :loading="loadingCrear">
        <v-card-title class="text-h5"> Crear cliente </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              label="Nombre"
              v-model="nuevoCliente.nombre"
            ></v-text-field>
            <v-text-field
              label="Teléfono"
              v-model="nuevoCliente.telefono"
            ></v-text-field>
            <v-text-field
              label="Correo electrónico"
              v-model="nuevoCliente.email"
            ></v-text-field>
            <v-text-field
              label="Dirección"
              v-model="nuevoCliente.direccion"
            ></v-text-field>
            <v-text-field
              label="RUT"
              v-model.lazy="rut"
              @input="changeRut"
              :rules="rutRules"
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
            @click="crearCliente()"
            :disabled="desbloquearCrearCliente()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="clientes"
      class="elevation-0"
      :page="pagina"
      :items-per-page="limite"
      :server-items-length="total"
      @update:page="(val) => (pagina = val)"
      @update:items-per-page="(val) => (limite = val)"
    >
      <template v-slot:[`item.nombre`]="{ item }">
        <a :href="`/clientes/${item._id}`">{{ item.nombre }}</a>
      </template>
      <template v-slot:[`item.rut`]="{ item }">
        {{ item.rut | rut }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import BackendService from "@/services/backend.service";
import RutUtils from "@/utils/rut.utils";
import Vue from "vue";

export default Vue.extend({
  name: "ClientesView",
  data: () => ({
    loading: true,
    clientes: [],
    pagina: 1,
    limite: 10,
    total: 0,
    dialog: false,
    nuevoCliente: {},
    loadingCrear: false,
    rut: "",
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
      },
      {
        text: "RUT",
        align: "start",
        sortable: false,
        value: "rut",
      },
      {
        text: "Dirección",
        align: "start",
        sortable: false,
        value: "direccion",
      },
      {
        text: "Correo",
        align: "start",
        sortable: false,
        value: "email",
      },
      {
        text: "Teléfono",
        align: "start",
        sortable: false,
        value: "telefono",
      },
    ],
    rutRules: [(v) => RutUtils.validateRut(v) || "RUT no válido"],
  }),
  mounted() {
    this.obtenerClientes();
  },
  watch: {
    pagina() {
      this.obtenerClientes();
    },
    limite() {
      this.obtenerClientes();
    },
  },
  methods: {
    async obtenerClientes() {
      this.loading = true;
      try {
        const res = await BackendService.obtenerClientes(
          this.pagina,
          this.limite
        );
        console.log("res", res);
        this.clientes = res.clientes;
        this.total = res.total;
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
    abrirDialogo() {
      this.dialog = true;
      this.nuevoCliente = {};
    },
    cerrarDialogo() {
      this.dialog = false;
      this.nuevoCliente = {};
    },
    async crearCliente() {
      this.loadingCrear = true;
      try {
        const res = await BackendService.crearCliente(this.nuevoCliente);
        console.log("res", res);
        this.nuevoCliente = {};
        this.obtenerClientes();
        this.cerrarDialogo();
      } catch (error) {
        // Handle error
      } finally {
        this.loadingCrear = false;
      }
    },
    changeRut(rut) {
      this.nuevoCliente.rut = RutUtils.clean(rut);
      this.rut = RutUtils.formatRut(rut);
    },
    desbloquearCrearCliente() {
      if (
        this.nuevoCliente.rut &&
        RutUtils.validateRut(this.nuevoCliente.rut) &&
        this.nuevoCliente.telefono &&
        this.nuevoCliente.email &&
        this.nuevoCliente.nombre &&
        this.nuevoCliente.direccion
      ) {
        return false;
      }
      return true;
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
</style>