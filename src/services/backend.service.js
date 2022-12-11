import LocalStorageUtils from "@/utils/local-storage.utils";
import axios from "axios";

const backendurl = process.env.VUE_APP_BACKEND_URL;

export default class BackendService {
  static login = async (email, password) => {
    const url = `${backendurl}/users/login`;
    const datos = { email, password };
    const response = await axios.post(url, datos);
    const userData = response.data.data;

    // Eliminar datos
    LocalStorageUtils.remove("usuario");

    // Guardar nuevos datos
    LocalStorageUtils.write("usuario", userData);

    return userData;
  };

  static check = async () => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/users/check`;
    const response = await axios.post(url, null, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
    const userData = response.data.data;
    return userData;
  };

  static obtenerReservas = async (pagina, limite) => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/agenda/reservas?pagina=${pagina}&limite=${limite}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
    return response.data.data;
  };

  static eliminarReserva = async (reservaId) => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/agenda/reservas/${reservaId}`;
    await axios.delete(url, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
  };

  // Clientes
  static obtenerClientes = async (pagina, limite) => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/clientes?pagina=${pagina}&limite=${limite}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
    return response.data.data;
  };

  static crearCliente = async (cliente) => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/clientes`;
    const response = await axios.post(url, cliente, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
    return response.data.data;
  };

  static obtenerCliente = async (clienteId) => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/clientes/${clienteId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
    return response.data.data;
  };

  // Mascotas
  static crearMascota = async (mascota) => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/mascotas`;
    const response = await axios.post(url, mascota, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
    return response.data.data;
  };

  static obtenerMascotasPorCliente = async (clienteId) => {
    const usuario = LocalStorageUtils.read("usuario");
    if (!usuario) {
      throw Error();
    }
    const url = `${backendurl}/mascotas/cliente/${clienteId}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${usuario.accessToken}` },
    });
    return response.data.data;
  };
}
