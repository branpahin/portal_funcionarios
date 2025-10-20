export enum TypeUrlDev{
    portal = 'https://localhost:44326/api/'
}

export enum TypeServicio{
    login = 'Login/Loguear',
    camposFiltro = 'Colaboradores/GetCamposFiltros',
    colaboradores = 'Colaboradores/GetColaboradores',
    colaboradoresInterventor = 'Interventor/GetColaboradoresInterv',
    crearColaboradores = 'Colaboradores/CreateColaborador',
    crearColaboradoresInterv = 'Interventor/CreateColaboradorInterv',
    consultarColaboradores = 'Funcionario/GetNombresColaboradores',
    consultarColaborador = 'Funcionario/ObtenerInfoColaborador',
    consultarColaboradorCedula = 'Funcionario/ObtenerInfoColaboradorCC',
    getInfoColaborador = 'Colaboradores/GetInfoColaborador',
    getInfoColaboradorIntenventor = 'Interventor/GetInfoColaboradorInterv',
    getGerencias = 'Colaboradores/GetGerencias',
    getGetAreas = 'Colaboradores/GetAreas',
    getGetCCO = 'Colaboradores/GetCCO',
    ActualizarEstadoColaborador = 'Colaboradores/ActualizarEstadoColaborador',
    putInfoColaborador = 'Colaboradores/ActualizarColaborador',
    PutInactivarColaborador = 'Colaboradores/InactivarColaborador',
    PutActivarColaborador = 'Colaboradores/ActivarColaborador',
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
    AprobarRechazarColaborador='Colaboradores/AprobarRechazarColaborador',
    GetAplicativos='Colaboradores/GetAplicativos',
    GetMenu='Menu/ConsultarMenuPerfil'
}