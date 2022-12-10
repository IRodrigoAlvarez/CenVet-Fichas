<template>
  <div>
    <h1>Agenda</h1>
    <v-dialog v-model="dialog" width="500"
      ><v-card>
        <v-card-title class="text-h5"> Eliminar reserva </v-card-title>

        <v-card-text>
          ¿Está seguro de querer eliminar la reserva? Esta acción es
          irreversible.
        </v-card-text>
        <v-card-text class="datos-reserva" v-if="reservaSeleccionada">
          <p>
            Apoderado: {{ reservaSeleccionada.nombreApoderado }}
            <span v-if="rutEsValido(reservaSeleccionada.rut)"
              >({{ reservaSeleccionada.rut | rut }})</span
            >
          </p>
          <p>
            Mascota: {{ reservaSeleccionada.nombreMascota }}
            <span
              >({{
                obtenerDatosMascota(
                  reservaSeleccionada.especie,
                  reservaSeleccionada.sexo,
                  reservaSeleccionada.edad
                )
              }})</span
            >
          </p>
          <p>Fecha: {{ reservaSeleccionada.fecha }}</p>
          <p>Hora: {{ reservaSeleccionada.hora }}</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="noEliminarReserva()">
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="eliminarReserva()">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="reservas"
      class="elevation-0"
      :page="pagina"
      :items-per-page="limite"
      :server-items-length="total"
      @update:page="(val) => (pagina = val)"
      @update:items-per-page="(val) => (limite = val)"
      ><template v-slot:[`item.nombreApoderado`]="{ item }">
        {{ item.nombreApoderado }}
        <span v-if="rutEsValido(item.rut)">({{ item.rut | rut }})</span>
      </template>
      <template v-slot:[`item.nombreMascota`]="{ item }">
        {{ item.nombreMascota }}
        <span
          >({{ obtenerDatosMascota(item.especie, item.sexo, item.edad) }})</span
        >
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          class="mx-2"
          fab
          dark
          x-small
          elevation="0"
          color="error"
          @click="eliminar(item)"
        >
          <v-icon dark> mdi-minus </v-icon>
        </v-btn>
      </template></v-data-table
    >
  </div>
</template>

<script>
import BackendService from "@/services/backend.service";
import RutUtils from "@/utils/rut.utils";
import Vue from "vue";

export default Vue.extend({
  name: "AgendaView",
  data: () => ({
    loading: true,
    reservas: [],
    pagina: 1,
    limite: 10,
    total: 0,
    reservaSeleccionada: null,
    loadingEliminar: false,
    dialog: false,
    headers: [
      {
        text: "Fecha",
        align: "start",
        sortable: false,
        value: "cita.fecha",
      },
      {
        text: "Hora",
        align: "start",
        sortable: false,
        value: "cita.hora",
      },
      {
        text: "Médico",
        align: "start",
        sortable: false,
        value: "responsable",
      },
      {
        text: "Apoderado",
        align: "start",
        sortable: false,
        value: "nombreApoderado",
      },
      {
        text: "Mascota",
        align: "start",
        sortable: false,
        value: "nombreMascota",
      },
      {
        text: "Acciones",
        align: "start",
        sortable: false,
        value: "actions",
      },
    ],
  }),
  mounted() {
    this.obtenerReservas();
  },
  watch: {
    pagina() {
      this.obtenerReservas();
    },
    limite() {
      this.obtenerReservas();
    },
  },
  methods: {
    async obtenerReservas() {
      this.loading = true;
      try {
        const res = await BackendService.obtenerReservas(
          this.pagina,
          this.limite
        );
        this.reservas = res.reservas;
        this.total = res.total;
      } catch (error) {
        // Handle error
      } finally {
        this.loading = false;
      }
    },
    rutEsValido(rut) {
      return RutUtils.validateRut(rut);
    },
    obtenerDatosMascota(especie, sexo, edad) {
      let resumenEspecie = "";
      if (sexo === "F") {
        if (especie === "Gato") {
          resumenEspecie = "Gata";
        } else if (especie === "Perro") {
          resumenEspecie = "Perra";
        } else {
          resumenEspecie = "Exótica";
        }
      } else {
        if (especie === "Gato") {
          resumenEspecie = "Gato";
        } else if (especie === "Perro") {
          resumenEspecie = "Perro";
        } else {
          resumenEspecie = "Exótico";
        }
      }
      return `${resumenEspecie}, ${edad}`;
    },
    eliminar(reserva) {
      this.reservaSeleccionada = reserva;
      this.dialog = true;
    },
    async eliminarReserva() {
      this.loadingEliminar = true;
      try {
        await BackendService.eliminarReserva(this.reservaSeleccionada._id);
        this.noEliminarReserva();
        this.obtenerReservas();
      } catch (error) {
        // Handle error
      } finally {
        this.loadingEliminar = false;
      }
    },
    noEliminarReserva() {
      this.reservaSeleccionada = null;
      this.dialog = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.datos-reserva {
  p {
    margin-bottom: 4px;
  }
}
</style>