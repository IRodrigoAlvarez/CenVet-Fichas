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
}
