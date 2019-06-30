<?php
    $respuesta = "";
    $conexion = new PDO('mysql:host=127.0.0.1;dbname=BDRuleta','root','root');

    $numJugadores = $_GET["numJug"];
    $numRondas = $_GET["numRnd"];
    $bote = $_GET["bote"];
    $jugadores = $_GET["jugadores"];

    $respuesta = configuracion($conexion, $numJugadores, $numRondas, $bote);
    $respuesta = jugadores($conexion, $jugadores);

    function configuracion($conexion, $numJugadores, $numRondas, $bote){
        $actualizacion = $conexion->prepare('update configuracion set jugadores=?, rondas = ?, bote = ?');
        $actualizacion ->bindParam(1,$numJugadores);
        $actualizacion ->bindParam(2,$numRondas);
        $actualizacion ->bindParam(3,$bote);
        $resultados = $actualizacion->execute();

        return $resultados;
    }

    function jugadores($conexion,$jugadores){
        $borrar = $conexion->prepare('delete from jugadores');
        $resultados = $borrar->execute();

        for($i = 0; $i<count($jugadores); $i++){
            insertar($i, $jugadores[$i]);
        }

        return $resultados;
    }

    function insertar($id, $nombre){
        $conexion = new PDO('mysql:host=127.0.0.1;dbname=BDRuleta','root','root');
        $insertar = $conexion->prepare("insert into jugadores values ($id, '$nombre')");
        $resultados = $insertar->execute(); 
    }

    echo $respuesta;

?>