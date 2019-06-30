<?php
    $conexion = new PDO('mysql:host=127.0.0.1;dbname=BDRuleta','root','root');
    
    $conexion->query("SET NAMES 'utf8'");
    $consulta = $conexion -> prepare('select * from configuracion');
    $consulta -> execute();

    $configuracion = $consulta -> fetchAll();

    echo json_encode($configuracion);

?>