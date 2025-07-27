export enum TypeUrlDev{
    portal = 'https://localhost:44326/api/'
}

export enum TypeServicio{
    login = 'Login/Loguear',
    camposFiltro = 'Colaboradores/GetCamposFiltros',
    colaboradores = 'Colaboradores/GetColaboradores',
    crearColaboradores = 'Colaboradores/CreateColaborador',
    consultarColaboradores = 'Funcionario/GetNombresColaboradores',
    consultarColaborador = 'Funcionario/ObtenerInfoColaborador',
    getInfoColaborador = 'Colaboradores/GetInfoColaborador',
    ActualizarEstadoColaborador = 'Colaboradores/ActualizarEstadoColaborador',
    putInfoColaborador = 'Colaboradores/UpdateInfoColaborador',
    PutInactivarUsuario = 'Colaboradores/PutInactivarUsuario',
    getUsuarios ='Usuario/GetListarUsuarios',
    CrearUsuario ='Usuario/CrearUsuario',
    GetUsuarioSistema ='Usuario/GetUsuarioSistema',
    GetListarUsuariosAgregar = 'Usuario/GetListarUsuariosAregar',
    ActualizarUsuario ='Usuario/ActualizarUsuario',
    ActualizarClave='Usuario/ActualizarClave'
}