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
    putInfoColaborador = 'Colaboradores/ActualizarColaborador',
    PutInactivarColaborador = 'Colaboradores/InactivarColaborador',
    getUsuarios ='Usuario/GetListarUsuarios',
    CrearUsuario ='Usuario/CrearUsuario',
    GetInfoUsuario ='Usuario/GetInfoUsuario',
    GetListarUsuariosAgregar = 'Usuario/GetListarUsuariosAregar',
    ActualizarUsuario ='Usuario/ActualizarUsuario',
    ActualizarClave='Usuario/ActualizarClave',
    GetRolesUsuario='Usuario/GetRolesUsuario',
    GetNombresFiltros='Filtros/GetNombresFiltros',
    GetNombresFiltroDet='Filtros/GetNombresFiltroDet',
    CrearFiltroDet='Filtros/CrearFiltroDet',
    ActualzarFiltroDet='Filtros/ActualzarFiltroDet',
    GetCamposEstado='Colaboradores/GetCamposEstado',
    AprobarRechazarColaborador='Colaboradores/AprobarRechazarColaborador'
}