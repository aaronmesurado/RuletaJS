<?php
    $respuesta = "";
    $conexion = new PDO('mysql:host=127.0.0.1;dbname=BDRuleta','root','root');

    $palabra = $_GET["palabra"];
    $pista = $_GET["pista"];
    $tipo = $_GET["tipo"];

    $respuesta = insertar($conexion, $palabra, $pista, $tipo);        

    function insertar($conexion, $palabra, $pista, $tipo){
        $insertar = $conexion->prepare("insert into preguntas values ('$palabra','$pista','$tipo')");
        $resultados = $insertar->execute(); 
        return $resultados;
    }

    echo $respuesta;

?>